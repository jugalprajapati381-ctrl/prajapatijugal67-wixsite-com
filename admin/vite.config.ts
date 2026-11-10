import { defineConfig, type PreviewServer, type ViteDevServer } from 'vite';
import react from '@vitejs/plugin-react';

function redirectAdminRoot(server: ViteDevServer | PreviewServer) {
  server.middlewares.use((request, response, next) => {
    if (request.url?.split('?')[0] === '/admin') {
      response.statusCode = 308;
      response.setHeader('Location', '/admin/');
      response.end();
      return;
    }
    next();
  });
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'redirect-admin-root',
      configureServer: redirectAdminRoot,
      configurePreviewServer: redirectAdminRoot,
    },
  ],
  base: '/admin/',
});
