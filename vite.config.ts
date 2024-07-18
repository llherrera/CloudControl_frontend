import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'
import EnvironmentPlugin from "vite-plugin-environment"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [legacy(), react(), EnvironmentPlugin('all')],
  css: {
    postcss: {
      plugins: [autoprefixer({}), tailwindcss()]
    }
  },
  resolve: {
    alias: {
      // for TypeScript path alias import like : @/x/y/z
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        secure: false,
        rewrite: path => path.replace(/^\/api/, '')
      },
      '/geoportal-deparments': {
        target: 'https://geoportal.dane.gov.co/laboratorio/serviciosjson/gdivipola/servicios/departamentos.php',
        secure: false,
        rewrite: path => path.replace(/^\/geoportal-deparments/, ''),
        changeOrigin: true
      },
      '/geoportal-municipality': {
        target: 'https://geoportal.dane.gov.co/laboratorio/serviciosjson/gdivipola/servicios/municipios.php',
        secure: false,
        rewrite: path => path.replace(/^\/geoportal-municipality/, ''),
        changeOrigin: true
      },
      '/geoportal-ficha': {
        target: 'https://geoportal.dane.gov.co/laboratorio/serviciosjson/gdivipola/servicios/ficha.php',
        secure: false,
        rewrite: path => path.replace(/^\/geoportal-ficha/, ''),
        changeOrigin: true
      },
      '/geocoder': {
        target: 'https://nominatim.openstreetmap.org/search',
        secure: false,
        rewrite: path => path.replace(/^\/geocoder/, ''),
        changeOrigin: true
      },
      '/reverse-geocoding': {
        target: 'https://api.opencagedata.com/geocode/v1/json',
        secure: false,
        rewrite: path => path.replace(/^\/reverse-geocoding/, ''),
        changeOrigin: true
      }
    }
  },
  assetsInclude: ['assets/**/*'],
})
