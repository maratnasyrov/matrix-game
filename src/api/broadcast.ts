import {
  GameProducer,
  ServerConsumer,
  ServerSchema,
  SlotUIConsumer,
} from '@releaseband/ui-pub-sub/broadcast';

export type InitRange = Array<number>;

export type ClientId = string;

export type InitCurrency = {
  code: string;
  defaultBet: number;
  betRange: InitRange;
  subunits: number;
};

export type InitRules = {
  buyFeatures?: ReadonlyArray<{ id: string; multiplier: number }>;
};

export type InitResponseData = {
  currency: InitCurrency;
  clientId: ClientId;
  balance: number;
  rules: InitRules;
};

export type InitResponseV2Data = {
  currency: InitCurrency;
  clientId: ClientId;
  balance: number;
  rules: InitRules;
  step: {
    type: 1 | 2 | 3;
    payload: {
      nextStepType: 1 | 2 | 3;
    };
  };
};

export type CommandResponseData = {
  balance: number;
  result: any;
};

export type CommandV2ResponseData = {
  balance: number;
  step: {
    type: 1 | 2 | 3;
    payload: {
      nextStepType: 1 | 2 | 3;
    };
  };
};

export interface BaseServerSchema extends ServerSchema {
  topic: 'server';
  events: {
    'bet-request': {
      '1.0.0': unknown;
    };
    'bet-response': {
      '1.0.0': CommandResponseData;
      '2.0.0': CommandV2ResponseData;
    };
    'buyFeature-request': {
      '1.0.0': unknown;
    };
    'buyFeature-response': {
      '1.0.0': unknown;
      '2.0.0': unknown;
    };
    'gift-received': {
      '1.0.0': unknown;
    };
    'init-request': {
      '1.0.0': unknown;
    };
    'init-response': {
      '1.0.0': InitResponseData;
      '2.0.0': InitResponseV2Data;
    };
  };
}

export const gameProducer = new GameProducer();
export const slotUIConsumer = new SlotUIConsumer();
export const serverConsumer = new ServerConsumer<BaseServerSchema>();
