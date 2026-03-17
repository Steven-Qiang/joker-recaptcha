import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { libInjectCss } from 'vite-plugin-lib-inject-css';

export default defineConfig(() => {
  return {
    plugins: [
      vue(),
      dts({ tsconfigPath: './tsconfig.app.json' }),
      libInjectCss(),
    ],
    build: {
      lib: {
        formats: ['cjs', 'es'],
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'FakeRecaptcha',
        fileName: (format) => `fake-recaptcha.${format}.js`,
      },
      rolldownOptions: {
        external: ['vue'],
        output: {
          exports: 'named',
          globals: {
            vue: 'Vue',
          },
        },
      },
    },
  };
});
