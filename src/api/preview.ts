import { gameProducer } from './broadcast';

export const start = () => {
  gameProducer.emit('preview', '1.0.0', { type: 'start' });
};

export const progress = (progress: number) => {
  gameProducer.emit('preview', '1.0.0', { type: 'progress', value: progress });
};

export const end = () => {
  gameProducer.emit('preview', '1.0.0', { type: 'end' });
};
