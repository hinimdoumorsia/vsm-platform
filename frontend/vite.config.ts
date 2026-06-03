// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/ws': {
        target: 'ws://localhost:8080',
        ws: true,
        changeOrigin: true,
      },
    },
  },
  build: {
    target: 'esnext',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor':  ['react', 'react-dom', 'react-router-dom'],
          'flow-vendor':   ['reactflow'],
          'three-vendor':  ['three', '@react-three/fiber', '@react-three/drei'],
          'chart-vendor':  ['recharts'],
          'state-vendor':  ['zustand', 'immer'],
        },
      },
    },
  },
});

// ---- tsconfig.json ----
// {
//   "compilerOptions": {
//     "target": "ES2022",
//     "useDefineForClassFields": true,
//     "lib": ["ES2022", "DOM", "DOM.Iterable"],
//     "module": "ESNext",
//     "skipLibCheck": true,
//     "moduleResolution": "bundler",
//     "allowImportingTsExtensions": true,
//     "resolveJsonModule": true,
//     "isolatedModules": true,
//     "noEmit": true,
//     "jsx": "react-jsx",
//     "strict": true,
//     "noUnusedLocals": true,
//     "noUnusedParameters": true,
//     "noFallthroughCasesInSwitch": true,
//     "baseUrl": ".",
//     "paths": {
//       "@/*": ["./src/*"]
//     }
//   },
//   "include": ["src"],
//   "references": [{ "path": "./tsconfig.node.json" }]
// }