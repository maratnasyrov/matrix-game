import { assign, setup } from 'xstate';
import { api } from './api';
import {
  BuyFeatureData,
  BuyFeatureItem,
  Result,
  UiElementsState,
} from './types';
import { InitResponseData, InitResponseV2Data } from './api/broadcast';
import { isBonusFinished, isBonusGame, isBonusStarted } from './guards';

export type GameContext = {
  onboardingCompleted: boolean;
  progress: number;
  result: Result | null;
  uiElementsState: UiElementsState;
  buyFeatureData?: BuyFeatureData;
};

export type GameEvents =
  | { type: 'INIT_RESPONSE_COMPLETE'; data: InitResponseData }
  | { type: 'INIT_RESPONSE_V2_COMPLETE'; data: InitResponseV2Data }
  | { type: 'INITIALIZE' }
  | { type: 'BET_START' }
  | { type: 'BET_COMPLETE'; data: Result }
  | { type: 'NEXT' };

export type GameActions = {
  startPreloader: () => void;
  endPreloader: () => void;
  startPreview: () => void;
  endPreview: () => void;
  incrementProgress: () => void;
};

export type BuyFeature = NonNullable<BuyFeatureData>;

export type BuyFeatureGroup = {
  title: BuyFeature[0]['title'];
  items: Array<BuyFeature[0]['items'][0]>;
};

const freeSpins: BuyFeatureItem = {
  id: 'free-spins',
  title: '3 Scatters',
  groupName: 'Free Spins',
  backgroundSrc: 'assets/images/buy-feature/free-spins.png',
  type: 'bonus-game',
};

const doubleBooster: BuyFeatureItem = {
  id: 'juicy-bet',
  title: 'Doubles booster',
  groupName: 'Boosters',
  backgroundSrc: 'assets/images/buy-feature/double-booster.png',
  type: 'bonus-game-boosted-chance',
};

const buyFeatureData = [freeSpins, doubleBooster];

export const gameMachine = setup<GameContext, GameEvents, {}, {}, GameActions>({
  actions: {
    startPreloader: api.pub.preloader.start,
    endPreloader: api.pub.preloader.end,
    startPreview: api.pub.preview.start,
    endPreview: () => {
      api.pub.preview.end();
      api.pub.game.previewEndState();
    },
    incrementProgress: assign({
      progress: ({ context }) => context.progress + 50,
    }),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5RQIYFswDoCWA7bALgMQCSAciQCoD6ASgKIDKACgPJmP3UBqATNQGFWAWWYAZepXoBtAAwBdRKAAOAe1iFsq3EpAAPRABZeAGhABPRLwCMAdkwBOWQDZeshwGYHvQ4aceAXwCzVAwcfGJyKjomNg4uIVEJKTlFJBA1DQItHXSDBABWAsxZWQ9rXltnZ3KPW3qCs0sECt5MOr9nQ1kADgLDAtlbHqCQ9Cw8QlIKShIAQTESAC0ZBV1MzW1dfI9eB0deHusCyodhiocmqwdiw2se53rjHsMPHpHgkFCsZQAnMAANqoUBAwL9wgBjf4YXDEVLrdSbXKgfLWXrOTBuG4eQZ1BytK4IDyvTA9LyDHq2Y6GZwFWyjL7jTB-QHA0Hg2AEFC-OFrdIbbJbPKIKltSk9Xi0lylG6GQkeGqk5zWck2CWuemfb7M-5AkFgnWqKD-WCwIjw-mIwXI-SIBxHTCGWxuGzK1weD2EmnFE5+BwDeq8ckM7UsvXsw3GuBmvSclAELAoABmCd+AAo0bIAJREUO6tkGv5Gk2wC0qK05bZ2h1Ol3WN1Bz0WRBeWQHIbvYbeWRuAohplhgvgsC4CDmvnlrKV4UtAY9TDWTxVQaVNF0r20zC+hz+unOrwDfthFkAN2wYAA7pDoSPeWlJ0iqwgbLZ9mcCirDnZZMcve9HLYQzDJ2sgDIYR4-P8Z6XpgcY8uO94ZBWQooog9wuJgXRvK4ZL4mcHiEhSjjeF07iPD4FQQTqYDQVeRZRqaCEIlOKG2s+QzFEGtgnN+fgeGUhLKm2tJuoBBQvNYxhUae550b8xbRkQsZcgmmDJqmGalDmeY0bJkYlmWSEsTa+RuNxmJ1DxgF8QJzaFAqJQnLI4kOM4HaLtJUF6SOY6GQK06oc+-QeO0thOj+ew+DcjR2faxQepKvh3PWvC8J5ukwT55rWIh-msaZXQYhKxyDL4rl3IRtghT2i5+OJe4qlR2AQACYBEGQ9AABqUH5yEmS2BQOTUg3GJJ-TrrFZIlOqQaVAq+KBFqTLNa1ABC2gAK6wLBXLwR13W9cZT44oNpLDHNVU3PWlX2L4gFkkcJxUtYTUtWA624FthoQop+09RORmPjOOI3Gdjzfj0P5UoJJJkj4vT2t6divWtm3bVlf2HUDgXlK4mEuDuzmuN4v52X086VEUdTVMSzl9ktYQEL8KC4MZmAAEZgAQtBgAAjhtcB3sx2NsXcwyYe8HqBmcFWxadVTPB69zWMcVFMyzbOcwQADqKCaLgUBEKtkiCCI4iSKsuV9U+vgYTYP7kyJfSEt4+yDZ4pSAZJLxpQzWDq6zSIc1zPOwGorNtZjAN5f1RKGC8mEer4QmvL4hIVNU7RolS-RCUuavM4H1rB9zcDh7AbVY9ax0FE4mLcfWrz2sq-rp7sbagRKCp7Px9YFxrQda6H5dtcp8aJimYJpvxWm5kyAeayHZfaBXVcBWxOI9lnTq03c-jOOnL6OJSZz3aBzn90XOQfV9Q98wLnJMZaR0zncJI3D2vAnGcq6VdYmD1HuDnDO3EPhjEZoXYyN9tpa11vrQ2xsaCJHNikaO1tX51H-rWCo8c-BqkIk6LcNIHh3WJK8TU4D-aQKRNAkuw8V6Ry6v9K2L8cblHsCqD8VUeg7jwuneOACezEnxO4f0xgKGMggQPa0tC75hwYU-B81cZyHEzmRKoQZSiSTOPKOuEo+j2kXC8cai1KGYAXjQtGdDl4RyUnGVS6kp4z2zHPKRV9tCyKXvIiOa98othsMUe4RRXiHCqsNQkDoHiVF6KlVKi5FqfFwKoUE8B0jfGFsowKABaA+dksmcXKM5V8zlUq12Rn7cIhAMnr1RL4EogFdgaleLSUwdlyjznIWBZwO47qNQqYOfUvxql+IQAMNskov4kJVh6E4hI3BYNcjwkieFVb9PzIM68YAYQEGGbHFWkMlR0lpI9Om8ocQLheM4o4S4wGSMgqyDZcEdnPxFvkPwFNXDiS6NMnErTmgen2DiGaUVBrOBeOlcMhZ5IMVSUompiBIb2BGnVMk+4ehnMBeJCZIKFTgrWQ8iMPldlPhVqDTMFRap9DcLk5ott673BpO4cokpQLpVosSmcJVDCOnIfiIMdg9hyjaZ4TENgnBFE8PHBobK9J4ChFs28HLAqpTConDOtcyjcT+UYA55QiiAS-jiOw-QZUwSeUqti9Yt6+DxBUdhgq-zcvjtFMF5C7AOFNXJBSpoLWoicP-PYvDa5f0lTSnVTqeFFFdZg18nrMBEpeZktimi2ipSGK8YJBQsKET6I6MoKtXBdDEh6ipK0wC+pbPcaqzKZ5VHqLYF2tctyvlGuRClEjtRlugRWokZEShnDRJSfigCG12T4o6esZJFyLi6HVFG70rHmsTfCokkluXuCpL0KqQE7A5rbB+UCrk6SuTCh25ab1aFFh+j65dIzyh128E9BltQCJ2TBT6M4YinCgTpLcztF6rEJrhXetd-bN1Dp3aO5oYV134iqjM8SydL6sMBkmnYA6AEUlJYMMKMVmgSn2JOvooLuhXWQ4PJe-NBY9u6IuTDvRsPprw3aesmINRFG-vxPw5Hi6wL1tkA2NG5rtGTtURczp3jMYQDcNoRRIZ7AqBJ+0PGcjWO8RXGj9UlRHvEsSQNjbZPiR7HypTf757UJkWjHtXg6glEU24XoNIqhekIXYaoZRSn8qqCpjxVi75Uc5NZuKdnKgOZeI8MN9luXRMlMBE4yp6ZmIsZZz6MCuZwIE1AITbx8ZdCOOdN+lV90iXxJSQY-QzNuKgX5rxI9NMfgXHq1KZJ+iHCK1uWkwallRXAkEAIQA */
  id: 'game',
  initial: 'init',
  context: {
    onboardingCompleted: false,
    progress: 0,
    result: null,
    buyFeatureData: undefined,
    uiElementsState: {
      'preview.end': ['game-start', 'sound-onboarding'],
      idle: [
        'balance',
        'total-bet',
        'spin-start',
        'gift-spin',
        'total-bet-change',
        'autoplay-start',
        'buy-feature',
        'menu',
        'quick-spin',
      ],
      'idleBonus.start': ['bonus-start', 'total-bet', 'balance'],
      'idleBonus.end': ['bonus-end', 'total-bet', 'balance'],
      transition: [
        'spin-stop',
        'quick-spin',
        'autoplay-stop',
        'menu',
        'total-bet',
        'balance',
      ],
      transitionBonus: ['menu', 'total-bet', 'balance'],
    },
  },
  states: {
    init: {
      on: {
        INIT_RESPONSE_V2_COMPLETE: {
          actions: assign({
            result: ({ event }) => event.data,
            buyFeatureData: ({ event }) => {
              if (event.data.rules.buyFeatures === undefined) {
                return undefined;
              }

              return event.data.rules.buyFeatures.reduce<
                Array<BuyFeatureGroup>
              >((acc, { id, multiplier }) => {
                const feature = buyFeatureData.find(
                  (feature) => feature.id === id
                );

                if (feature !== undefined) {
                  const findGroup = acc.find(
                    (group) => group.title === feature.groupName
                  );

                  if (findGroup) {
                    findGroup.items.push({
                      id: feature.id,
                      title: feature.title,
                      backgroundSrc: feature.backgroundSrc,
                      type: feature.type,
                      multiplier,
                    });

                    return acc;
                  }

                  const group: BuyFeatureGroup = {
                    title: feature.groupName,
                    items: [
                      {
                        id: feature.id,
                        title: feature.title,
                        backgroundSrc: feature.backgroundSrc,
                        type: feature.type,
                        multiplier,
                      },
                    ],
                  };
                  acc.push(group);
                }

                return acc;
              }, []);
            },
          }),
        },
        INIT_RESPONSE_COMPLETE: {
          actions: assign({
            buyFeatureData: ({ event }) => {
              if (event.data.rules.buyFeatures === undefined) {
                return undefined;
              }

              return event.data.rules.buyFeatures.reduce<
                Array<BuyFeatureGroup>
              >((acc, { id, multiplier }) => {
                const feature = buyFeatureData.find(
                  (feature) => feature.id === id
                );

                if (feature !== undefined) {
                  const findGroup = acc.find(
                    (group) => group.title === feature.groupName
                  );

                  if (findGroup) {
                    findGroup.items.push({
                      id: feature.id,
                      title: feature.title,
                      backgroundSrc: feature.backgroundSrc,
                      type: feature.type,
                      multiplier,
                    });

                    return acc;
                  }

                  const group: BuyFeatureGroup = {
                    title: feature.groupName,
                    items: [
                      {
                        id: feature.id,
                        title: feature.title,
                        backgroundSrc: feature.backgroundSrc,
                        type: feature.type,
                        multiplier,
                      },
                    ],
                  };
                  acc.push(group);
                }

                return acc;
              }, []);
            },
          }),
        },
        INITIALIZE: {
          actions: ({ context }) =>
            api.pub.game.initialize(
              context.uiElementsState,
              context.buyFeatureData
            ),
          target: 'preloader',
        },
      },
    },
    preloader: {
      initial: 'start',
      states: {
        increment: {
          entry: { type: 'incrementProgress', params: () => {} },
          always: { target: '#game.preloader.progress' },
        },

        start: {
          entry: { type: 'startPreloader', params: () => {} },
          always: { target: '#game.preloader.progress' },
        },
        progress: {
          entry: ({ context }) => api.pub.preloader.progress(context.progress),
          after: {
            100: {
              target: '#game.preloader.increment',
              guard: ({ context }) => context.progress < 100,
            },
          },
          always: {
            target: '#game.preloader.end',
            guard: ({ context }) => context.progress >= 100,
          },
        },
        end: {
          entry: { type: 'endPreloader', params: () => {} },
          always: {
            target: '#game.preview',
            guard: ({ context }) => context.progress >= 100,
          },
        },
      },
      exit: assign({ progress: 0 }),
    },
    preview: {
      initial: 'start',
      states: {
        increment: {
          entry: { type: 'incrementProgress', params: () => {} },
          always: { target: '#game.preview.progress' },
        },

        start: {
          entry: { type: 'startPreview', params: () => {} },
          always: { target: '#game.preview.progress' },
        },
        progress: {
          entry: ({ context }) => api.pub.preview.progress(context.progress),
          after: {
            100: {
              target: '#game.preview.increment',
              guard: ({ context }) => context.progress < 100,
            },
          },
          always: {
            target: '#game.preview.end',
            guard: ({ context }) => context.progress >= 100,
          },
        },
        end: {
          entry: { type: 'endPreview', params: () => {} },
          on: {
            NEXT: [
              {
                target: '#game.idle',
                guard: ({ context }) =>
                  context.progress >= 100 &&
                  !isBonusGame(context.result) &&
                  !isBonusStarted(context.result) &&
                  !isBonusFinished(context.result),
              },
              {
                target: '#game.idleBonus.start',
                guard: ({ context }) =>
                  context.progress >= 100 &&
                  (isBonusGame(context.result) ||
                    isBonusStarted(context.result)),
              },
              {
                target: '#game.idleBonus.end',
                guard: ({ context }) =>
                  context.progress >= 100 && isBonusFinished(context.result),
              },
            ],
          },
        },
      },
    },
    idle: {
      entry: [api.pub.game.idleState, api.pub.game.nextRoundReady],
      on: {
        NEXT: '#game.transition',
      },
    },
    idleBonus: {
      initial: 'process',
      states: {
        start: {
          entry: api.pub.game.idleBonusStartState,
          on: {
            NEXT: '#game.transitionBonus',
          },
        },
        process: {
          entry: api.pub.game.nextRoundReady,
          on: {
            NEXT: '#game.transitionBonus',
          },
        },
        end: {
          entry: api.pub.game.idleBonusEndState,
          on: {
            NEXT: '#game.idle',
          },
        },
      },
    },
    transition: {
      initial: 'betRequest',
      states: {
        betRequest: {
          entry: [api.pub.game.transitionState, assign({ result: null })],
          always: {
            target: '#game.transition.betWaiting',
          },
        },
        betWaiting: {
          on: {
            BET_COMPLETE: {
              target: '#game.transition.betResponse',
              actions: assign(({ event }) => ({ result: event.data })),
            },
          },
        },
        betResponse: {
          on: {
            NEXT: [
              {
                target: '#game.idle',
                guard: ({ context }) => !isBonusStarted(context.result),
              },
              {
                target: '#game.idleBonus.start',
                guard: ({ context }) => isBonusStarted(context.result),
              },
            ],
          },
          after: {
            3000: [
              {
                target: '#game.idle',
                guard: ({ context }) => !isBonusStarted(context.result),
              },
              {
                target: '#game.idleBonus.start',
                guard: ({ context }) => isBonusStarted(context.result),
              },
            ],
          },
        },
      },
    },
    transitionBonus: {
      initial: 'betRequest',
      states: {
        betRequest: {
          entry: [api.pub.game.transitionBonusState, assign({ result: null })],
          always: {
            target: '#game.transitionBonus.betWaiting',
          },
        },
        betWaiting: {
          on: {
            BET_COMPLETE: {
              target: '#game.transitionBonus.betResponse',
              actions: assign(({ event }) => ({ result: event.data })),
            },
          },
        },
        betResponse: {
          on: {
            NEXT: {
              target: '#game.idleBonus',
            },
          },
          after: {
            3000: {
              target: '#game.idleBonus',
            },
          },
          always: {
            target: '#game.idleBonus.end',
            guard: ({ context }) => isBonusFinished(context.result),
          },
        },
      },
    },
  },
});
