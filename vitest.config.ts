import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '/@': resolve('src/'),
      '/@renderer': resolve('src/renderer/src'),
      '/@res': resolve(__dirname, './resources'),
      '/@types': resolve(__dirname, './src/types'),
      '/@test': resolve(__dirname, './src/test')
    }
  },
  plugins: [react()]
})
