import { SubstrateNetwork } from '../model';
import {
  BalancesBalanceSetEvent as KusamaBalancesBalanceSetEvent,
  BalancesDepositEvent as KusamaBalancesDepositEvent,
  BalancesEndowedEvent as KusamaBalancesEndowedEvent,
  BalancesTransferEvent as KusamaBalancesTransferEvent,
} from '../types/kusama/events';
// it feels a bit wrong using kusama types on all the getters but ChainContext and Event are generic
import { ChainContext, Event } from '../types/kusama/support';
import {
  BalancesBalanceSetEvent as PolkadotBalancesBalanceSetEvent,
  BalancesDepositEvent as PolkadotBalancesDepositEvent,
  BalancesEndowedEvent as PolkadotBalancesEndowedEvent,
  BalancesTransferEvent as PolkadotBalancesTransferEvent,
} from '../types/polkadot/events';

// import {
//   BalancesBalanceSetEvent as KhalaBalancesBalanceSetEvent,
//   BalancesDepositEvent as KhalaBalancesDepositEvent,
//   BalancesEndowedEvent as KhalaBalancesEndowedEvent,
//   BalancesTransferEvent as KhalaBalancesTransferEvent,
// } from '../types/khala/events';
// import {
//   BalancesBalanceSetEvent as LitentryBalancesBalanceSetEvent,
//   BalancesDepositEvent as LitentryBalancesDepositEvent,
//   BalancesEndowedEvent as LitentryBalancesEndowedEvent,
//   BalancesTransferEvent as LitentryBalancesTransferEvent,
// } from '../types/litentry/events';
// import {
//   BalancesBalanceSetEvent as LitmusBalancesBalanceSetEvent,
//   BalancesDepositEvent as LitmusBalancesDepositEvent,
//   BalancesEndowedEvent as LitmusBalancesEndowedEvent,
//   BalancesTransferEvent as LitmusBalancesTransferEvent,
// } from '../types/litmus/events';

export function getBalancesBalanceSetEvent(
  ctx: ChainContext,
  event: Event,
  network: SubstrateNetwork
): {
  who: Uint8Array;
  free: bigint;
  reserved: bigint;
} {
  switch (network) {
    case SubstrateNetwork.kusama: {
      const data = new KusamaBalancesBalanceSetEvent(ctx, event);
      if (data.isV1031) {
        const [who, free, reserved] = data.asV1031;
        return { who, free, reserved };
      }

      if (data.isV9130) {
        return data.asV9130;
      }

      throw new Error('Unexpected version');
    }

    case SubstrateNetwork.polkadot: {
      const data = new PolkadotBalancesBalanceSetEvent(ctx, event);
      if (data.isV0) {
        const [who, free, reserved] = data.asV0;
        return { who, free, reserved };
      }

      if (data.isV9140) {
        return data.asV9140;
      }

      throw new Error('Unexpected version');
    }
    // case SubstrateNetwork.phala: {
    //   const event = new KhalaBalancesBalanceSetEvent(ctx);

    //   if (event.isV1) {
    //     const [who, free, reserved] = event.asV1;
    //     return { who, free, reserved };
    //   } else if (event.isV1090) {
    //     return event.asV1090;
    //   } else {
    //     return event.asLatest;
    //   }
    // }

    // case SubstrateNetwork.litentry: {
    //   const event = new LitentryBalancesBalanceSetEvent(ctx);
    //   if (event.isV9000) {
    //     const [who, free, reserved] = event.asV9000;
    //     return { who, free, reserved };
    //   }

    //   if (event.isV9071) {
    //     return event.asV9071;
    //   }

    //   return event.asLatest;
    // }

    // case SubstrateNetwork.litmus: {
    //   const event = new LitmusBalancesBalanceSetEvent(ctx);
    //   if (event.isV9020) {
    //     return event.asV9020;
    //   }

    //   return event.asLatest;
    // }

    default: {
      throw new Error('getBalancesBalanceSetEvent::network not supported');
    }
  }
}

export function getBalancesDepositEvent(
  ctx: ChainContext,
  event: Event,
  network: SubstrateNetwork
): {
  who: Uint8Array;
  amount: bigint;
} {
  switch (network) {
    case SubstrateNetwork.kusama: {
      const data = new KusamaBalancesDepositEvent(ctx, event);

      if (data.isV1032) {
        const [who, amount] = data.asV1032;
        return { who, amount };
      }

      if (data.isV9130) {
        return data.asV9130;
      }

      throw new Error('Unexpected version');
    }

    case SubstrateNetwork.polkadot: {
      const data = new PolkadotBalancesDepositEvent(ctx, event);

      if (data.isV0) {
        const [who, amount] = data.asV0;
        return { who, amount };
      }

      if (data.isV9140) {
        return data.asV9140;
      }

      throw new Error('Unexpected version');
    }

    // case SubstrateNetwork.phala: {
    //   const event = new KhalaBalancesDepositEvent(ctx);

    //   if (event.isV1) {
    //     const [who, amount] = event.asV1;
    //     return { who, amount };
    //   } else if (event.isV1090) {
    //     return event.asV1090;
    //   } else {
    //     return event.asLatest;
    //   }
    // }

    // case SubstrateNetwork.litmus: {
    //   const event = new LitmusBalancesDepositEvent(ctx);

    //   if (event.isV9020) {
    //     return event.asV9020;
    //   }
    //   return event.asLatest;
    // }

    // case SubstrateNetwork.litentry: {
    //   const event = new LitentryBalancesDepositEvent(ctx);
    //   if (event.isV9000) {
    //     const [who, amount] = event.asV9000;
    //     return { who, amount };
    //   }

    //   if (event.isV9071) {
    //     return event.asV9071;
    //   }

    //   return event.asLatest;
    // }

    default: {
      throw new Error('getBalancesDepositEvent::network not supported');
    }
  }
}

export function getBalancesEndowedEvent(
  ctx: ChainContext,
  event: Event,
  network: SubstrateNetwork
): {
  account: Uint8Array;
  freeBalance: bigint;
} {
  switch (network) {
    case SubstrateNetwork.kusama: {
      const data = new KusamaBalancesEndowedEvent(ctx, event);

      if (data.isV1050) {
        const [account, freeBalance] = data.asV1050;
        return { account, freeBalance };
      }

      if (data.isV9130) {
        return data.asV9130;
      }

      throw new Error('Unexpected version');
    }

    case SubstrateNetwork.polkadot: {
      const data = new PolkadotBalancesEndowedEvent(ctx, event);

      if (data.isV0) {
        const [account, freeBalance] = data.asV0;
        return { account, freeBalance };
      }

      if (data.isV9140) {
        return data.asV9140;
      }

      throw new Error('Unexpected version');
    }

    // case SubstrateNetwork.phala: {
    //   const event = new KhalaBalancesEndowedEvent(ctx);

    //   if (event.isV1) {
    //     const [account, freeBalance] = event.asV1;
    //     return { account, freeBalance };
    //   } else if (event.isV1090) {
    //     return event.asV1090;
    //   } else {
    //     return event.asLatest;
    //   }
    // }

    // case SubstrateNetwork.litentry: {
    //   const event = new LitentryBalancesEndowedEvent(ctx);
    //   if (event.isV9000) {
    //     const [account, freeBalance] = event.asV9000;
    //     return { account, freeBalance };
    //   }

    //   if (event.isV9071) {
    //     return event.asV9071;
    //   }

    //   return event.asLatest;
    // }

    // case SubstrateNetwork.litmus: {
    //   const event = new LitmusBalancesEndowedEvent(ctx);

    //   if (event.isV9020) {
    //     return event.asV9020;
    //   }
    //   return event.asLatest;
    // }

    default: {
      throw new Error('getBalancesEndowedEvent::network not supported');
    }
  }
}

export function getBalancesTransferEvent(
  ctx: ChainContext,
  event: Event,
  network: SubstrateNetwork
): {
  from: Uint8Array;
  to: Uint8Array;
  amount: bigint;
} {
  switch (network) {
    case SubstrateNetwork.kusama: {
      const data = new KusamaBalancesTransferEvent(ctx, event);

      if (data.isV1020) {
        const [from, to, amount] = data.asV1020;
        return { from, to, amount };
      }

      if (data.isV1050) {
        const [from, to, amount] = data.asV1050;
        return { from, to, amount };
      }

      if (data.isV9130) {
        return data.asV9130;
      }
      throw new Error('Unexpected version');
    }

    case SubstrateNetwork.polkadot: {
      const data = new PolkadotBalancesTransferEvent(ctx, event);

      if (data.isV0) {
        const [from, to, amount] = data.asV0;
        return { from, to, amount };
      } else if (data.isV9140) {
        return data.asV9140;
      }
      throw new Error('Unexpected version');
    }

    // case SubstrateNetwork.phala: {
    //   const event = new KhalaBalancesTransferEvent(ctx);

    //   if (event.isV1) {
    //     const [from, to, amount] = event.asV1;
    //     return { from, to, amount };
    //   } else if (event.isV1090) {
    //     return event.asV1090;
    //   } else {
    //     return event.asLatest;
    //   }
    // }

    // case SubstrateNetwork.litentry: {
    //   const event = new LitentryBalancesTransferEvent(ctx);
    //   if (event.isV9000) {
    //     const [from, to, amount] = event.asV9000;
    //     return { from, to, amount };
    //   }

    //   if (event.isV9071) {
    //     return event.asV9071;
    //   }

    //   return event.asLatest;
    // }

    // case SubstrateNetwork.litmus: {
    //   const event = new LitmusBalancesTransferEvent(ctx);

    //   if (event.isV9020) {
    //     return event.asV9020;
    //   }
    //   return event.asLatest;
    // }

    default: {
      throw new Error('getBalancesTransferEvent::network not supported');
    }
  }
}
