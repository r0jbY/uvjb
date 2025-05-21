import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

console.log("✅ Vite config loaded");

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  preview: {
    host: true,
    port: 5173,
    allowedHosts: ['frontend']
  }
})
