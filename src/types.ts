import { GameSchema, SlotUISchema } from '@releaseband/ui-pub-sub/broadcast';

export type GameState = GameSchema['events']['state']['1.0.0']['state'];
export type UiElementsState =
  GameSchema['events']['initialize']['1.0.0']['uiElementsState'];
export type BuyFeatureData =
  GameSchema['events']['initialize']['1.0.0']['buyFeatureData'];

export type SpinStateCtx = SlotUISchema['events']['spin']['1.0.0'];

export type ContinueCtx = SlotUISchema['events']['continue']['1.0.0'];

type ExtractBuyFeatureItem<T> = T extends ReadonlyArray<{
  title: string;
  items: ReadonlyArray<Readonly<infer U>>;
}>
  ? U
  : never;
export type BuyFeatureItem = Omit<
  ExtractBuyFeatureItem<
    GameSchema['events']['initialize']['1.0.0']['buyFeatureData']
  >,
  'multiplier'
> & { groupName: string };

export type Result = {
  step: {
    type: 1 | 2 | 3;
    payload: {
      nextStepType: 1 | 2 | 3;
    };
  };
};
