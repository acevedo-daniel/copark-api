# **📘 Documento Técnico – CoPark (Backend + Mobile)**

## **1. Descripción General**

CoPark es una plataforma móvil que conecta conductores con propietarios de estacionamientos privados o cocheras individuales.
Permite publicar espacios, reservar, y gestionar disponibilidad en tiempo real.

El sistema está compuesto por:

- **App móvil:** React Native + Expo
- **Backend serverless:** Node.js + Express sobre Firebase Functions
- **Base de datos:** Firestore (persistencia) + Realtime DB (estado dinámico)
- **Autenticación:** Firebase Auth + Firebase Admin SDK

---

## **2. Objetivo del Proyecto**

Construir una API segura, modular y escalable para soporte de reservas de estacionamiento, utilizando una arquitectura **en 3 capas** y prácticas profesionales:

- Separación clara **modules → services → repositories**
- Middlewares para **auth, validación y errores**
- Integración nativa con Firebase Services

---

## **3. Stack Tecnológico**

### **Backend**

- Node.js
- Express.js
- Firebase Functions
- Firebase Admin SDK
- Firestore + Realtime Database
- Zod (validación)
- express-rate-limit
- dotenv
- CORS

### **Frontend**

- React Native + Expo
- Firebase Auth
- Expo Location Services
- react-native-maps

### **Herramientas**

- Git + GitHub
- Postman / Thunder Client
- VSCode
- ESLint + Prettier
- `.env` management

---

## **4. Arquitectura**

### **Estilo**

- Arquitectura horizontal en 3 capas
- Serverless (Functions)
- Clean handlers + error middleware

```
Request → Modules (routes/controllers) → Services → Repositories → Firebase
```

### **Estructura del proyecto**

```
copark-api/
└─ functions/
   ├─ modules/           # Controladores + rutas
   │   ├─ parkings.js
   │   ├─ users.js
   │   └─ bookings.js
   │
   ├─ src/
   │   ├─ services/
   │   │   ├─ parkings/
   │   │   │   ├─ createParking.service.js
   │   │   │   ├─ updateParking.service.js
   │   │   │   ├─ deleteParking.service.js
   │   │   │   ├─ listParking.service.js
   │   │   │   └─ parkings.service.js
   │   │   └─ …
   │   ├─ repositories/
   │   │   ├─ parkings.repository.js
   │   │   ├─ users.repository.js
   │   │   └─ bookings.repository.js
   │   └─ utils/
   │       ├─ firebase.js
   │       ├─ auth.middleware.js
   │       ├─ error.middleware.js
   │       ├─ validation.js
   │       └─ httpstatuscode.js
   │
   ├─ index.js           # Express mount + export
   ├─ .env.example
   └─ package.json
```

## **5. Modelado de Datos**

### **Usuarios**

```ts
User {
  uid: string
  fullName: string
  email: string
  role: "OWNER" | "DRIVER"
  phone: string
  createdAt: timestamp
}
```

### **Parking**

```ts
Parking {
  id: string
  ownerId: string
  title: string
  address: string
  lat: number
  lng: number
  pricePerHour: number
  totalSpaces: number
  availableSpaces: number
  createdAt: timestamp
}
```

### **Reserva**

```ts
Booking {
  id: string
  parkingId: string
  driverId: string
  startTime: timestamp
  endTime: timestamp | null
  totalPrice: number | null
  status: "active" | "completed" | "cancelled"
}
```

## **6. Middlewares**

| Middleware    | Objetivo                         |
| ------------- | -------------------------------- |
| Auth          | Validar token Firebase           |
| Validation    | Validar cuerpos de request (Zod) |
| Rate limit    | Evitar abuso de rutas            |
| Error Handler | Respuestas unificadas            |

---

## **7. Flujo de Reserva**

```
Driver selecciona parking
→ API valida disponibilidad
→ Crea booking
→ Decrementa availableSpaces
→ After end: calcula costo, libera espacio
```

## **8. MVP (V1)**

### ✅ Incluye

- Login / roles
- Publicación de cocheras
- Geolocalización / mapa
- Reserva básica
- Precios por hora
- Simulación de pago

### ❌ No incluye (V1)

- Selección de lugar tipo “cine”
- Pagos reales
- Reviews / chat
- IoT sensores

---

## **9. Seguridad**

- JWT Firebase verificado en backend
- No datos sensibles en client
- `.env` segregado, variables rotadas
- Rate-limit
- Sanitización input

---
