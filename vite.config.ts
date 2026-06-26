import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // The main app chunk is ~1MB because the entire 500-card curriculum,
    // including inline SVG diagrams, is embedded as data (not code) and loads
    // up front for instant local-first navigation. That is acceptable here, so
    // the limit is set above it; the genuinely heavy libraries are split out
    // below into their own long-cached chunks.
    chunkSizeWarningLimit: 1100,
    rollupOptions: {
      output: {
        manualChunks: {
          charts: ['recharts'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
  },
});
