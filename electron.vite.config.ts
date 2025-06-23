import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import path from 'path'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '/@': path.resolve(__dirname, './src'),
        '/@res': path.resolve(__dirname, './resources')
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '/@': path.resolve(__dirname, './src'),
        '/@res': path.resolve(__dirname, './resources')
      }
    }
  },
  renderer: {
    plugins: [svelte()]
  }
})
