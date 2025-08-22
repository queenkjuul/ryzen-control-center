import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import path from 'path'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '/@': path.resolve(__dirname, './src'),
        '/@res': path.resolve(__dirname, './resources'),
        '/@config': path.resolve(__dirname, './src/config'),
        '/@types': path.resolve(__dirname, './src/types'),
        '/@test': path.resolve(__dirname, './src/test')
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '/@': path.resolve(__dirname, './src'),
        '/@res': path.resolve(__dirname, './resources'),
        '/@config': path.resolve(__dirname, './src/config'),
        '/@types': path.resolve(__dirname, './src/types'),
        '/@test': path.resolve(__dirname, './src/test')
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        '/@renderer': path.resolve(__dirname, './src/renderer/src'),
        '/@components': path.resolve(__dirname, './src/renderer/src/components'),
        '/@lib': path.resolve(__dirname, './src/renderer/src/lib'),
        '/@assets': path.resolve(__dirname, './src/renderer/assets'),
        '/@types': path.resolve(__dirname, './src/types'),
        '/@test': path.resolve(__dirname, './src/test')
      }
    },
    plugins: [react(), tailwindcss()]
  }
})
