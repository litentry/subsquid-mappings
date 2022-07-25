import { EventHandlerContext } from '@subsquid/substrate-processor';
import { SubstrateNetwork } from '../../model';
import { DemocracyPreimageNotedEvent as KusamaDemocracyPreimageNotedEvent } from '../../types/kusama/events';
import { DemocracyPreimageNotedEvent as PolkadotDemocracyPreimageNotedEvent } from '../../types/polkadot/events';
import { DemocracyPreimageNotedEvent as KhalaDemocracyPreimageNotedEvent } from '../../types/khala/events';

export function getDemocracyPreimageNotedEvent(
  ctx: EventHandlerContext,
  network: SubstrateNetwork
) {
  switch (network) {
    case SubstrateNetwork.kusama: {
      const event = new KusamaDemocracyPreimageNotedEvent(ctx);
      if (event.isV1022) {
        const [proposalHash, who, deposit] = event.asV1022;
        return { proposalHash, who, deposit };
      }
      if (event.isV9130) {
        return event.asV9130;
      }

      return event.asLatest;
    }

    case SubstrateNetwork.polkadot: {
      const event = new PolkadotDemocracyPreimageNotedEvent(ctx);

      if (event.isV0) {
        const [proposalHash, who, deposit] = event.asV0;
        return { proposalHash, who, deposit };
      }
      if (event.isV9140) {
        return event.asV9140;
      }

      return event.asLatest;
    }

    case SubstrateNetwork.phala: {
      const event = new KhalaDemocracyPreimageNotedEvent(ctx);

      if (event.isV1) {
        const [proposalHash, who, deposit] = event.asV1;
        return { proposalHash, who, deposit };
      }
      if (event.isV1090) {
        return event.asV1090;
      }

      return event.asLatest;
    }

    default: {
      throw new Error('getDemocracyPreimageNotedEvent::network not supported');
    }
  }
}
