import { KnownArchives, lookupArchive } from '@subsquid/archive-registry';
import { SubstrateBatchProcessor } from '@subsquid/substrate-processor';
import { TypeormDatabase } from '@subsquid/typeorm-store';
import { In } from 'typeorm';
import handleBalanceChange from './handleBalanceChange';
import {
  SubstrateBalanceAccount,
  SubstrateBalanceChangeEventType,
  SubstrateNetwork,
} from './model';
import {
  getBalancesBalanceSetEvent,
  getBalancesDepositEvent,
  getBalancesEndowedEvent,
  getBalancesTransferEvent,
} from './typeGetters/getBalancesEvents';
import { getTreasuryAwardedEvent } from './typeGetters/getTreasuryEvents';
import { Context, EventProcessorParams, Models } from './types/custom';

const supportedNetworks = ['kusama', 'polkadot'];
const network: SubstrateNetwork = process.env.NETWORK as SubstrateNetwork;

if (!supportedNetworks.includes(network)) {
  throw Error('Network not supported');
}

export const processor = new SubstrateBatchProcessor()
  .setBatchSize(500)
  .setTypesBundle(network)
  .setDataSource({
    archive: lookupArchive(network as KnownArchives, { release: 'FireSquid' }),
  })
  .addEvent('Balances.Transfer', {
    data: { event: { args: true } },
  } as const)
  .addEvent('Balances.BalanceSet', {
    data: { event: { args: true } },
  } as const)
  .addEvent('Balances.Endowed', {
    data: { event: { args: true } },
  } as const)
  .addEvent('Balances.Deposit', {
    data: { event: { args: true } },
  } as const)
  .addEvent('Treasury.Awarded', {
    data: { event: { args: true } },
  } as const);

// doing .run above breaks the types... bit odd
processor.run(new TypeormDatabase(), processBatch);

async function processBatch(ctx: Context): Promise<void> {
  const models: Models = {
    accounts: [],
    changeEvents: [],
    transfers: [],
  };

  // synchronously process all data in the batch, mutating models (above) as the batch's data cache
  for (const block of ctx.blocks) {
    for (const item of block.items) {
      if (item.kind === 'call') {
        // we have none, leaving for reference
      } else if (item.kind === 'event') {
        const blockNumber = BigInt(block.header.height);
        const date = new Date(block.header.timestamp);
        processEvent({
          ctx,
          item,
          blockNumber,
          date,
          models,
          network,
        });
      }
    }
  }

  // save accounts first as they are FKeyed in the other models
  const existingAccounts = await ctx.store.findBy<SubstrateBalanceAccount>(
    SubstrateBalanceAccount,
    { id: In(models.accounts.map((acc) => acc.id)) }
  );
  await ctx.store.save(mergeAccounts(models.accounts, existingAccounts));
  await ctx.store.save([...models.transfers, ...models.changeEvents]);

  ctx.log.info(
    JSON.stringify(
      {
        batchStart: ctx.blocks[0].header.height,
        batchEnd: ctx.blocks[ctx.blocks.length - 1].header.height,
        accounts: models.accounts.length,
        changeEvents: models.changeEvents.length,
        transfers: models.transfers.length,
      },
      null,
      2
    )
  );
}

async function processEvent(params: EventProcessorParams) {
  switch (params.item.name) {
    case 'Balances.Transfer': {
      const { from, to, amount } = getBalancesTransferEvent(
        params.ctx,
        params.item.event,
        network
      );
      handleBalanceChange({
        eventType: SubstrateBalanceChangeEventType.BalancesTransfer,
        processorParams: params,
        eventParams: {
          amount,
          account: to,
          from,
        },
      });
      break;
    }

    case 'Balances.BalanceSet': {
      const { who, free, reserved } = getBalancesBalanceSetEvent(
        params.ctx,
        params.item.event,
        network
      );
      handleBalanceChange({
        eventType: SubstrateBalanceChangeEventType.BalancesBalanceSet,
        processorParams: params,
        eventParams: {
          amount: free + reserved,
          account: who,
        },
      });
      break;
    }

    case 'Balances.Endowed': {
      const { account, freeBalance } = getBalancesEndowedEvent(
        params.ctx,
        params.item.event,
        network
      );
      handleBalanceChange({
        eventType: SubstrateBalanceChangeEventType.BalancesEndowed,
        processorParams: params,
        eventParams: {
          amount: freeBalance,
          account,
        },
      });
      break;
    }

    case 'Balances.Deposit': {
      const { who, amount } = getBalancesDepositEvent(
        params.ctx,
        params.item.event,
        network
      );
      handleBalanceChange({
        eventType: SubstrateBalanceChangeEventType.BalancesDeposit,
        processorParams: params,
        eventParams: {
          amount,
          account: who,
        },
      });
      break;
    }

    case 'Treasury.Awarded': {
      const { award, account } = getTreasuryAwardedEvent(
        params.ctx,
        params.item.event,
        network
      );
      handleBalanceChange({
        eventType: SubstrateBalanceChangeEventType.TreasuryAwarded,
        processorParams: params,
        eventParams: {
          amount: award,
          account,
        },
      });
      break;
    }
  }
}

function mergeAccounts(
  accounts: SubstrateBalanceAccount[],
  existingAccounts: SubstrateBalanceAccount[]
) {
  return accounts.map((account) => {
    const existingAccount = existingAccounts.find((ea) => ea.id === account.id);

    if (existingAccount) {
      return updateAccount(account, existingAccount);
    }

    return account;
  });
}

function updateAccount(
  account: SubstrateBalanceAccount,
  existing: SubstrateBalanceAccount
) {
  existing.totalBalanceChangeEvents = account.totalBalanceChangeEvents;
  existing.lastBalanceChangeEventBlockNumber =
    account.lastBalanceChangeEventBlockNumber;
  existing.lastBalanceChangeEventDate = account.lastBalanceChangeEventDate;

  if (account.totalTransfers) {
    existing.totalTransfers = account.totalTransfers;
  }

  return existing;
}
