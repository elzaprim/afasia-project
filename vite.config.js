// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   css: {
//     modules: {
//       localsConvention: "camelCase",
//     }
//   }
// })


import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  json: {
    namedExports: true,
    stringify: false
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
  server: {
    proxy: {
      // Proxy endpoint `/jadwal` ke URL API yang sesungguhnya
      '/api': {
        target: 'https://b2cwspp1-8000.asse.devtunnels.ms/jadwal', // URL server backend Anda
        changeOrigin: true,
        secure: false, // Jika server menggunakan HTTPS dengan sertifikat self-signed
        rewrite: (path) => path.replace(/^\/api/, ''), // Menghapus prefix "/api" jika tidak dibutuhkan
      },
    },
  },
});

