import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://erichung.dev',
  output: 'static',
  integrations: [
    react(),
    sitemap({
      serialize(item) {
        // Match the canonical links: strip the trailing slash from every path
        // except the site root.
        const url = new URL(item.url);
        if (url.pathname !== '/') {
          url.pathname = url.pathname.replace(/\/+$/, '');
        }
        item.url = url.href;
        return item;
      },
    }),
  ],
});
