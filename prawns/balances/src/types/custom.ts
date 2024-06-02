import {
  BatchContext,
  BatchProcessorEventItem,
  BatchProcessorItem,
} from '@subsquid/substrate-processor';
import { Store } from '@subsquid/typeorm-store';
import {
  SubstrateBalanceAccount,
  SubstrateBalanceChangeEvent,
  SubstrateBalanceTransfer,
  SubstrateNetwork,
} from '../model';

// this makes things circular...
import { processor } from '../processor';

export type Item = BatchProcessorItem<typeof processor>;
export type Context = BatchContext<Store, Item>;
export type EventItem = BatchProcessorEventItem<typeof processor>;

export type Models = {
  accounts: SubstrateBalanceAccount[];
  changeEvents: SubstrateBalanceChangeEvent[];
  transfers: SubstrateBalanceTransfer[];
};

export type EventProcessorParams = {
  ctx: Context;
  item: EventItem;
  models: Models;
  blockNumber: bigint;
  date: Date;
  network: SubstrateNetwork;
};
