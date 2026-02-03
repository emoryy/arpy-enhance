import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

export default defineConfig({
  plugins: [
    monkey({
      entry: 'src/main.js',
      userscript: {
        name: 'ArpyEnhance',
        namespace: 'hu.emoryy',
        version: pkg.version,
        description: 'enhances Arpy',
        author: 'Emoryy',
        match: [
          'http://arpy.dbx.hu/timelog*',
          'https://arpy.dbx.hu/timelog*'
        ],
        require: [
          'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js'
        ],
        grant: 'unsafeWindow',
        icon: 'https://icons.duckduckgo.com/ip2/dbx.hu.ico',
        downloadURL: 'https://github.com/emoryy/arpy-enhance/raw/master/ArpyEnhance.user.js'
      },
      build: {
        fileName: 'ArpyEnhance.user.js' // goes directly into root via symlink
      }
    }),
  ],
  build: {
    outDir: 'dist',       // actually points to root via symlink
    emptyOutDir: false,   // never delete root
    assetsInlineLimit: 10000, // inline assets under 10KB as base64
    rollupOptions: {
      external: ['moment', 'monaco', 'jQuery', '$']
    }
  }
});
