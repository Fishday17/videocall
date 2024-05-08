import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),

  ],
  resolve: {
    alias: {
      '@': '/src',
      "assets": "/assets"
    }
  }
  /*,
  devServer: {
    proxy: {
      '/json': {
        target: 'http://49.234.44.18',
        changeOrigin: true,
        pathRewrite: {
          '^/json': ''
        },
        withCredentials: true
      }
    }
  }*/
})

