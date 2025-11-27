# CoPark API

**CoPark** es una plataforma serverless para la gestión de alquiler de estacionamientos, diseñada para conectar propietarios de cocheras con conductores de manera eficiente y escalable.

## Descripción

Este proyecto implementa una API RESTful robusta utilizando **Firebase Cloud Functions** y **Express.js**. La arquitectura sigue un patrón de diseño en capas (Controller-Service-Repository) para asegurar la separación de responsabilidades, mantenibilidad y escalabilidad del código.

## Stack Tecnológico

*   **Runtime**: Node.js v22
*   **Framework**: Express.js
*   **Cloud Platform**: Firebase (Functions, Authentication, Realtime Database)
*   **Validación**: Joi
*   **Seguridad**: Helmet, CORS, JWT Auth
*   **Calidad de Código**: ESLint

## Arquitectura

El sistema está construido sobre una arquitectura de tres capas:

1.  **Controllers**: Manejo de peticiones HTTP, validación de entrada y respuestas.
2.  **Services**: Implementación de la lógica de negocio y reglas del dominio.
3.  **Repositories**: Abstracción de la capa de datos (Firebase RTDB).

## Instalación y Uso

### Prerrequisitos

*   Node.js v18 o superior
*   Firebase CLI (`npm install -g firebase-tools`)
*   Java (para Firebase Emulators)

### Configuración Local

1.  Clonar el repositorio.
2.  Instalar dependencias:
    ```bash
    cd functions
    npm install
    ```
3.  Configurar variables de entorno en `.env`.
4.  Iniciar los emuladores:
    ```bash
    npm run serve
    ```

### Despliegue (Producción)

Para subir la API a Firebase Cloud Functions:

```bash
firebase login
firebase deploy --only functions
```
*(Ver `deployment_guide.md` para más detalles)*

## Estado del Proyecto

### Versión 1.0 (Actual)
MVP funcional enfocado en la entrega académica. Incluye:
*   Gestión completa de usuarios, vehículos y cocheras.
*   Flujo de reservas y cancelaciones.
*   Sistema de reseñas y calificaciones.
*   Notificaciones en segundo plano (Triggers).

### Roadmap (v2)
Planificación para evolución a producto de portfolio:
*   Integración de pasarelas de pago.
*   Búsqueda geoespacial.
*   Tests unitarios y de integración.
*   Pipeline de CI/CD.

## Licencia

Este proyecto es de uso académico y demostrativo.
