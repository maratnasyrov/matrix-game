import { createActor } from 'xstate';
import { gameMachine } from './gameMachine';
import { CanvasMatrixManager } from './canvas-matrix';
import { api } from './api';

export const slot = () => {
  let subscribesDone = false;
  let canvasManager: CanvasMatrixManager | undefined;

  const stateMachine = createActor(gameMachine);

  stateMachine.subscribe((state) => {
    if (state.matches('init')) {
      if (subscribesDone) return;

      api.sub.onInitResponse((ctx) => {
        canvasManager = new CanvasMatrixManager('#game-canvas');
        if (ctx) {
          stateMachine.send({ type: 'INIT_RESPONSE_COMPLETE', data: ctx });
        }
        stateMachine.send({ type: 'INITIALIZE' });
      });
      api.sub.onInitV2Response((ctx) => {
        canvasManager = new CanvasMatrixManager('#game-canvas');
        if (ctx) {
          stateMachine.send({ type: 'INIT_RESPONSE_V2_COMPLETE', data: ctx });
        }
        stateMachine.send({ type: 'INITIALIZE' });
      });
      api.sub.onBetRequest(() => {
        stateMachine.send({ type: 'NEXT' });
        canvasManager?.resumeAnimation();
      });
      // api.sub.onBetResponse((ctx) => {
      //   if (ctx) {
      //     stateMachine.send({ type: 'BET_COMPLETE', data: {} });
      //   }

      //   canvasManager?.pauseAnimation(3000, () => {
      //     stateMachine.send({ type: 'NEXT' });
      //   });
      // });
      api.sub.onBetV2Response((ctx) => {
        if (ctx) {
          stateMachine.send({ type: 'BET_COMPLETE', data: ctx });
        }
      });
      api.sub.onContinue(() => {
        stateMachine.send({ type: 'NEXT' });
      });
      api.sub.onSpin((ctx) => {
        if (ctx?.state === 'stop') {
          stateMachine.send({ type: 'NEXT' });
        }
      });

      subscribesDone = true;
    }
    if (state.matches('idle') || state.matches('idleBonus')) {
      canvasManager?.pauseAnimation();
    }
    if (state.matches('preview')) {
      if (
        typeof state.value !== 'string' &&
        'preview' in state.value &&
        state.value.preview === 'end'
      ) {
        canvasManager?.pauseAnimation();
      }
    }
    if (state.matches('preview')) {
      if (state.context.progress === 0) canvasManager?.matrixEffect();
    }
  });

  stateMachine.start();
};
