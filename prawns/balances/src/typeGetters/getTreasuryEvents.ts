import { SubstrateNetwork } from '../model';
import { TreasuryAwardedEvent as KusamaTreasuryAwardedEvent } from '../types/kusama/events';
import { ChainContext, Event } from '../types/kusama/support';
import { TreasuryAwardedEvent as PolkadotTreasuryAwardedEvent } from '../types/polkadot/events';
// import { TreasuryAwardedEvent as KhalaTreasuryAwardedEvent } from '../types/khala/events';
// import { TreasuryAwardedEvent as LitentryTreasuryAwardedEvent } from '../types/litentry/events';
// import { TreasuryAwardedEvent as LitmusTreasuryAwardedEvent } from '../types/litmus/events';

export function getTreasuryAwardedEvent(
  ctx: ChainContext,
  event: Event,
  network: SubstrateNetwork
): {
  award: bigint;
  account: Uint8Array;
} {
  switch (network) {
    case SubstrateNetwork.kusama: {
      const data = new KusamaTreasuryAwardedEvent(ctx, event);

      if (data.isV1020) {
        const [, award, account] = data.asV1020;
        return {
          award,
          account,
        };
      }

      if (data.isV9160) {
        return data.asV9160;
      }

      throw new Error('Unexpected version');
    }

    case SubstrateNetwork.polkadot: {
      const data = new PolkadotTreasuryAwardedEvent(ctx, event);

      if (data.isV0) {
        const [, award, account] = data.asV0;
        return {
          award,
          account,
        };
      }

      if (data.isV9170) {
        return data.asV9170;
      }

      throw new Error('Unexpected version');
    }

    // case SubstrateNetwork.phala: {
    //   const event = new KhalaTreasuryAwardedEvent(ctx);

    //   if (event.isV1) {
    //     const [, award, account] = event.asV1;
    //     return {
    //       award,
    //       account,
    //     };
    //   } else if (event.isV1110) {
    //     return event.asV1110;
    //   } else {
    //     return event.asLatest;
    //   }
    // }

    // case SubstrateNetwork.litmus: {
    //   const event = new LitmusTreasuryAwardedEvent(ctx);

    //   if (event.isV9020) {
    //     const [, award, account] = event.asV9020;
    //     return {
    //       award,
    //       account,
    //     };
    //   }

    //   if (event.isV9031) {
    //     return event.asV9031;
    //   }

    //   return event.asLatest;
    // }

    // case SubstrateNetwork.litentry: {
    //   const event = new LitentryTreasuryAwardedEvent(ctx);

    //   if (event.isV9000) {
    //     const [, award, account] = event.asV9000;
    //     return {
    //       award,
    //       account,
    //     };
    //   }

    //   if (event.isV9071) {
    //     return event.asV9071;
    //   }

    //   return event.asLatest;
    // }
    default: {
      throw new Error('getTreasuryAwardedEvent::network not supported');
    }
  }
}
