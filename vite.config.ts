import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import pkg from './package.json' with { type: 'json' };

export default defineConfig({
  // package.json è l'unica fonte della versione (VERSIONE.MAJOR.MINOR)
  define: { __APP_VERSION__: JSON.stringify(pkg.version) },
  // percorsi relativi: la stessa build funziona su GitHub Pages (sottocartella /<repo>/), Netlify e Vercel
  base: './',
  plugins: [react(), tailwindcss()],
});
