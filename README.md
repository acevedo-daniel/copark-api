# CoPark API

<p align="center">
  <img src="https://img.shields.io/badge/demo-saas-111111?style=flat-square" />
  <img src="https://img.shields.io/badge/typescript-strict-111111?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/express-v5-111111?style=flat-square&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/postgresql-prisma-111111?style=flat-square&logo=postgresql&logoColor=white" />
</p>

Backend API de demostracion tecnica para una **SaaS de gestion de parkings**.

Este proyecto representa una implementacion de referencia para mostrar arquitectura, calidad de codigo y buenas practicas de backend en contexto real.

---

## Contexto
- Proyecto orientado a portfolio profesional.
- Diseñado como pieza tecnica para procesos de primer trabajo en desarrollo backend.
- Enfoque en consistencia de arquitectura, validacion estricta y operacion reproducible.

---

## Objetivo funcional
La API cubre el flujo base de una plataforma de gestion de estacionamientos:
- autenticacion de usuarios
- gestion de parkings
- registro de vehiculos
- check-in y check-out de reservas
- perfil de usuario
- reseñas y estadisticas

---

## Stack
- Node.js + TypeScript (strict)
- Express 5
- Prisma + PostgreSQL
- Zod (validacion de contratos)
- OpenAPI 3.1 + Scalar
- Pino (logging estructurado)
- Vitest + Supertest

---

## Arquitectura
- Patron por capas: `controller -> service -> repository`
- Reglas de negocio concentradas en servicios
- Persistencia aislada en repositorios
- Error contract unificado: `{ "error": true, "message": "..." }`

---

## Inicio rapido
1. Instalar dependencias
```bash
pnpm install
```

2. Configurar entorno
```bash
cp .env.example .env
```

3. Levantar base local
```bash
pnpm docker:up
```

4. Preparar base (generate + migrate + seed)
```bash
pnpm db:setup
```

5. Ejecutar API
```bash
pnpm dev
```

---

## Documentacion de API
- UI (Scalar): `/api-docs/docs`
- OpenAPI JSON: `/api-docs/openapi.json`

Deploy (placeholder):
- API URL: `pending link`
- API Docs URL: `pending link`

---

## Calidad y verificacion
```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm quality:ci
pnpm release:readiness
```

Smoke checks:
```bash
pnpm smoke:local
```

```bash
$env:SMOKE_BASE_URL='https://your-deploy-url'
pnpm smoke:remote
```

---

## CI
- Workflow: `.github/workflows/ci.yml`
- Gate principal: `quality-and-readiness`

---

## Docs publicas del repo
Solo se exponen en raiz de `docs/`:
- `docs/ARCHITECTURE.md`
- `docs/CONVENTIONS.md`
- `docs/ROADMAP.md`

Las subcarpetas de `docs/` se consideran locales de trabajo y no se publican.
