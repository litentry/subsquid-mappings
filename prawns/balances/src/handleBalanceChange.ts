import {
  SubstrateBalanceAccount,
  SubstrateBalanceChangeEvent,
  SubstrateBalanceChangeEventType,
  SubstrateBalanceTransfer,
  SubstrateNetwork,
} from './model';
import { EventProcessorParams } from './types/custom';
import { decodeAddress, encodeAddress, getRegistry } from './utils';

export default function handleBalanceChange({
  eventType,
  processorParams: { blockNumber, date, network, item, models },
  eventParams: { account, amount, from },
}: {
  eventType: SubstrateBalanceChangeEventType;
  processorParams: EventProcessorParams;
  eventParams: {
    account: Uint8Array;
    amount: bigint;
    from?: Uint8Array; // presence indicates it's a transfer
  };
}) {
  const symbol = getRegistry(network).symbols[0];
  const decimals = getRegistry(network).decimals[0];
  const id = encodeAddress(network, account);
  const publicKey = decodeAddress(account);
  const fromId = from ? encodeAddress(network, from) : null;

  const accountModel = upsertAccount(
    models.accounts,
    {
      id,
      publicKey,
      blockNumber,
      date,
      network,
      symbol,
      decimals,
    },
    !!from
  );

  models.changeEvents.push(
    new SubstrateBalanceChangeEvent({
      id: `${network}:${blockNumber.toString()}:${item.event.pos}`,
      network,
      account: accountModel,
      type: eventType,
      symbol,
      decimals,
      amount,
      blockNumber,
      date,
    })
  );

  if (fromId) {
    const fromAccount = upsertAccount(
      models.accounts,
      {
        id: fromId,
        publicKey: decodeAddress(fromId),
        blockNumber,
        date,
        network,
        symbol,
        decimals,
      },
      true
    );

    models.changeEvents.push(
      new SubstrateBalanceChangeEvent({
        id: `${network}:${blockNumber.toString()}:${item.event.pos}.from`,
        network,
        account: fromAccount,
        type: eventType,
        symbol,
        decimals,
        amount: -amount,
        blockNumber,
        date,
      })
    );

    models.transfers.push(
      new SubstrateBalanceTransfer({
        id: `${network}:${blockNumber.toString()}:${item.event.pos}`,
        network,
        from: fromAccount,
        to: accountModel,
        symbol,
        decimals,
        amount,
        blockNumber,
        date,
      })
    );
  }
}

function upsertAccount(
  models: SubstrateBalanceAccount[],
  {
    id,
    publicKey,
    blockNumber,
    date,
    network,
    symbol,
    decimals,
  }: {
    id: string;
    publicKey: string;
    blockNumber: bigint;
    date: Date;
    network: SubstrateNetwork;
    decimals: number;
    symbol: string;
  },
  isTransfer = false
): SubstrateBalanceAccount {
  let model = models.find((acc) => acc.id === id);

  if (!model) {
    model = new SubstrateBalanceAccount({
      id,
      publicKey,
      network,
      symbol,
      decimals,
      firstBalanceChangeEventDate: date,
      firstBalanceChangeEventBlockNumber: blockNumber,
      lastBalanceChangeEventDate: date,
      lastBalanceChangeEventBlockNumber: blockNumber,
      totalTransfers: 0,
      totalBalanceChangeEvents: 0,
    });
    models.push(model);
  }

  model.lastBalanceChangeEventDate = date;
  model.lastBalanceChangeEventBlockNumber = blockNumber;
  model.totalBalanceChangeEvents += 1;

  if (isTransfer) {
    model.totalTransfers += 1;
  }

  return model;
}
