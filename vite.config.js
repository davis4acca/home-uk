import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // To use the `css` prop, instruct @vitejs/plugin-react to use Emotion's `jsx` function
      // instead of the default jsx-runtime when compiling JSX
      jsxImportSource: '@emotion/react',
      // Instruct @vitejs/plugin-react to use a custom babel config
      babel: {
        plugins: ['@emotion/babel-plugin']
      },
    })
  ]
});
