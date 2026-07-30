import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://yiharvest.dev',
  integrations: [mdx()],
  vite: {
    plugins: [tailwind()],
  },
  output: 'static',
});