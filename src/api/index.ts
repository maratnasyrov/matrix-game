import * as game from './game';
import * as preloader from './preloader';
import * as preview from './preview';
import * as subscribes from './subscribes';

export const api = {
  pub: {
    game,
    preloader,
    preview,
  },
  sub: subscribes,
};
