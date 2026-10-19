import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {VitePWA} from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          id: '/',
          name: 'Eterno Retorno — Biblioteca Clássica',
          short_name: 'EternoRetorno',
          description: 'Acervo histórico digital e leitor imersivo da literatura clássica brasileira.',
          theme_color: '#F1F3F5',
          background_color: '#F1F3F5',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/icon.svg',
              sizes: 'any',
              type: 'image/svg+xml',
              purpose: 'any',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,jpg,jpeg,webp,epub}'],
          maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
      {
        name: 'google-translate-proxy',
        configureServer(server) {
          server.middlewares.use('/api/translate', async (req, res) => {
            if (req.method === 'POST') {
              let body = '';
              req.on('data', (chunk) => {
                body += chunk;
              });
              req.on('end', async () => {
                try {
                  const { text, texts, targetLang = 'pt', sourceLang = 'auto' } = JSON.parse(body || '{}');

                  // Função auxiliar para traduzir uma string individual
                  const translateSingle = async (str: string) => {
                    const trimmed = (str || '').trim();
                    if (!trimmed) return { translatedText: str, detectedLang: sourceLang };
                    const encoded = encodeURIComponent(trimmed);
                    let translatedText = '';
                    let detectedLang = sourceLang;

                    // 1. Google Translate Chrome endpoint
                    try {
                      const c5Url = `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=${sourceLang}&tl=${targetLang}&q=${encoded}`;
                      const c5Res = await fetch(c5Url, {
                        headers: {
                          'User-Agent':
                            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                        },
                      });
                      if (c5Res.ok) {
                        const data = await c5Res.json();
                        if (Array.isArray(data) && data[0]) {
                          translatedText = data[0][0] || '';
                          detectedLang = data[0][1] || sourceLang;
                        }
                      }
                    } catch {}

                    // 2. Fallback gtx
                    if (!translatedText) {
                      try {
                        const gtxUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encoded}`;
                        const gtxRes = await fetch(gtxUrl, {
                          headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                          },
                        });
                        if (gtxRes.ok) {
                          const data = await gtxRes.json();
                          translatedText = (data[0] || [])
                            .map((item: any) => item[0])
                            .filter(Boolean)
                            .join('');
                          detectedLang = data[2] || sourceLang;
                        }
                      } catch {}
                    }

                    return {
                      translatedText: translatedText || trimmed,
                      detectedLang: detectedLang || sourceLang,
                    };
                  };

                  // Suporte a lote (batch de múltiplos parágrafos)
                  if (Array.isArray(texts)) {
                    const results = await Promise.all(
                      texts.map((p) => translateSingle(typeof p === 'string' ? p : ''))
                    );
                    res.setHeader('Content-Type', 'application/json');
                    res.end(
                      JSON.stringify({
                        translations: results.map((r) => r.translatedText),
                        targetLang,
                        engine: 'google-translate',
                      })
                    );
                    return;
                  }

                  if (!text || typeof text !== 'string') {
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ error: 'Text or texts parameter is required' }));
                    return;
                  }

                  const singleResult = await translateSingle(text);

                  res.setHeader('Content-Type', 'application/json');
                  res.end(
                    JSON.stringify({
                      translatedText: singleResult.translatedText,
                      detectedLang: singleResult.detectedLang,
                      targetLang,
                      engine: 'google-translate',
                    })
                  );
                } catch (err: any) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: err.message || 'Translation failed' }));
                }
              });
            } else {
              res.statusCode = 405;
              res.end('Method Not Allowed');
            }
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve('.'),
      },
    },
    build: {
      chunkSizeWarningLimit: 800,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('jspdf') || id.includes('html2canvas') || id.includes('dompurify')) {
                return 'vendor-pdf';
              }
              if (id.includes('jszip')) {
                return 'vendor-epub';
              }
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }
              if (id.includes('motion')) {
                return 'vendor-motion';
              }
              if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
                return 'vendor-react';
              }
            }
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
