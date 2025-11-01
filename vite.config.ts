import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@domain': path.resolve(__dirname, './src/domain'),
      '@infrastructure': path.resolve(__dirname, './src/infrastructure'),
      '@presentation': path.resolve(__dirname, './src/presentation'),
      '@store': path.resolve(__dirname, './src/store'),
      '@app': path.resolve(__dirname, './src/app'),
      react: path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react/') && !id.includes('react-dom') && !id.includes('react-router')) {
              return 'react-core';
            }
            if (id.includes('react-dom/')) {
              return 'react-dom';
            }
            if (id.includes('@reduxjs/toolkit')) {
              return 'redux-toolkit';
            }
            if (id.includes('react-redux')) {
              return 'react-redux';
            }
            if (id.includes('@tanstack/react-query')) {
              return 'react-query';
            }
            if (id.includes('react-router-dom')) {
              return 'react-router-dom';
            }
            if (id.includes('styled-components')) {
              return 'styled-components';
            }
            if (id.includes('axios')) {
              return 'http-client';
            }
            return 'vendor-misc';
          }

          if (id.includes('/pages/')) {
            const pageName = id.match(/\/pages\/([^/]+)/)?.[1];
            return pageName ? `page-${pageName.toLowerCase()}` : 'pages';
          }

          if (id.includes('/domain/')) {
            return 'domain';
          }
          if (id.includes('/infrastructure/')) {
            return 'infrastructure';
          }
          if (id.includes('/store/')) {
            return 'store';
          }
          if (id.includes('/shared/')) {
            return 'shared';
          }

          return 'main';
        },
      },
    },
    chunkSizeWarningLimit: 500,
    reportCompressedSize: true,
    minify: 'terser'
  },
  esbuild: {
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  define: {
    'process.env': {},
  },
})