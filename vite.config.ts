import { defineConfig } from 'vite';

import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: false,
    lib: {
      name: 'game',
      entry: {
        game: path.resolve(__dirname, 'src/index.ts'),
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    copyPublicDir: false,
  },
});
