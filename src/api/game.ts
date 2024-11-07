import { gameProducer } from './broadcast';
import { BuyFeatureData, UiElementsState } from '../types';

export const initialize = (
  uiElementsState: UiElementsState,
  buyFeatureData?: BuyFeatureData
) => {
  gameProducer.emit('initialize', '1.0.0', {
    uiElementsState,
    buyFeatureData,
    gameName: 'Game 1',
    rules: {},
  });
};

export const ready = () => {
  gameProducer.emit('ready', '1.0.0', {});
};

export const nextRoundReady = () => {
  gameProducer.emit('next-round-ready', '1.0.0', {});
};

export const previewEndState = () => {
  gameProducer.emit('state', '1.0.0', { state: 'preview.end' });
};

export const idleState = () => {
  gameProducer.emit('state', '1.0.0', { state: 'idle' });
};

export const idleBonusStartState = () => {
  gameProducer.emit('state', '1.0.0', { state: 'idleBonus.start' });
};

export const idleBonusEndState = () => {
  gameProducer.emit('state', '1.0.0', { state: 'idleBonus.end' });
};

export const transitionState = () => {
  gameProducer.emit('state', '1.0.0', { state: 'transition' });
};

export const transitionBonusState = () => {
  gameProducer.emit('state', '1.0.0', { state: 'transitionBonus' });
};
