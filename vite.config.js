import { defineConfig } from 'vite'
import { builtinModules } from 'module'

import pkg from './package.json'

export default defineConfig({
  build: {
    target: 'esnext',
    lib: {
      formats: ['es'],
      entry: './src/index.ts',
      name: 'index'
    },
    rollupOptions: {
      external: [
        ...builtinModules,
        ...Object
          .keys(pkg.dependencies)
      ]
    }
  }
})
