import { gameProducer } from './broadcast';

export const start = () => {
  gameProducer.emit('preloader', '1.0.0', { type: 'start' });
};

export const progress = (progress: number) => {
  gameProducer.emit('preloader', '1.0.0', {
    type: 'progress',
    value: progress,
  });
};

export const end = () => {
  gameProducer.emit('preloader', '1.0.0', { type: 'end' });
};
