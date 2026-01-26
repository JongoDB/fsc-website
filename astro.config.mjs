// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://fightingsmartcyber.com',
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'file'
  }
});
