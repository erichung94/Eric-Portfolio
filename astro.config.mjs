import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://erichung.dev',
  output: 'static',
  // Emit dancer.html rather than dancer/index.html. With the default directory
  // format the host 301s /dancer to /dancer/, while the canonical tag and the
  // sitemap both declare /dancer, so every entry point pointed at a URL that
  // redirected. The switch pushes /dancer via history too, so a reload took the
  // redirect as well. File format serves /dancer directly and makes the three
  // agree.
  build: { format: 'file' },
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
