import { SlotUISchema } from '@releaseband/ui-pub-sub/broadcast';
import { ContinueCtx, SpinStateCtx } from '../types';
import {
  BaseServerSchema,
  InitResponseData,
  InitResponseV2Data,
  serverConsumer,
  slotUIConsumer,
} from './broadcast';

type Func<T, P = {}> = (data?: P) => T;

export const onSlotUIReady = (callback: Func<void, unknown>) => {
  slotUIConsumer.on('ready', '1.0.0', callback);
};

export const onContinue = (callback: Func<void, ContinueCtx>) => {
  slotUIConsumer.on('continue', '1.0.0', callback);
};

export const onSpin = (callback: Func<void, SpinStateCtx>) => {
  slotUIConsumer.on('spin', '1.0.0', callback);
};

export const onInitResponse = (callback: Func<void, InitResponseData>) => {
  serverConsumer.on('init-response', '1.0.0', callback);
};

export const onInitV2Response = (callback: Func<void, InitResponseV2Data>) => {
  serverConsumer.on('init-response', '2.0.0', callback);
};

export const onBetRequest = (callback: Func<void, unknown>) => {
  serverConsumer.on('bet-request', '1.0.0', callback);
};

export const onBetResponse = (
  callback: Func<void, BaseServerSchema['events']['bet-response']['1.0.0']>
) => {
  serverConsumer.on('bet-response', '1.0.0', callback);
};

export const onBetV2Response = (
  callback: Func<void, BaseServerSchema['events']['bet-response']['2.0.0']>
) => {
  serverConsumer.on('bet-response', '2.0.0', callback);
};

export const onAutoplay = (
  callback: Func<void, SlotUISchema['events']['autoplay']['1.0.0']>
) => {
  slotUIConsumer.on('autoplay', '1.0.0', callback);
};
