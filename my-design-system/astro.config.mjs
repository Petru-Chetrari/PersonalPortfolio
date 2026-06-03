// @ts-check
import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';
import vercel from '@astrojs/vercel';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isVercel = !!(process.env.VERCEL || process.env.PUBLIC_VERCEL);

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: isVercel ? vercel() : node({
    mode: 'standalone'
  }),
  integrations: [svelte()],

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@chenglou/pretext': path.resolve(__dirname, 'node_modules/@chenglou/pretext/src/layout.ts')
      }
    },
    ssr: {
      noExternal: ['svelte-chartjs', 'chart.js', '@chenglou/pretext']
    }
  }
});