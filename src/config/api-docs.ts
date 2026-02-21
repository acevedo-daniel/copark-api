import type { Express } from 'express';
import helmet from 'helmet';
import { apiReference } from '@scalar/express-api-reference';

const docsHelmet = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
      scriptSrcElem: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        'https://cdn.jsdelivr.net',
        'https://fonts.googleapis.com',
      ],
      fontSrc: ["'self'", 'https://cdn.jsdelivr.net', 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
    },
  },
});

export const docsBasePath = '/api-docs';
export const docsUiPath = `${docsBasePath}/docs`;
export const docsSpecPath = `${docsBasePath}/openapi.json`;

export function mountApiDocs(app: Express, openApiSpec: object): void {
  app.use(
    docsUiPath,
    docsHelmet,
    apiReference({
      content: openApiSpec as Record<string, unknown>,
      theme: 'purple',
      darkMode: true,
    }),
  );

  app.get(docsSpecPath, docsHelmet, (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.json(openApiSpec);
  });

  app.get('/docs', (_req, res) => {
    res.redirect(308, docsUiPath);
  });

  app.get('/openapi.json', (_req, res) => {
    res.redirect(308, docsSpecPath);
  });
}
