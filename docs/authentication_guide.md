# Guía de Autenticación con JWT (Stack Moderno: Argon2 + jose)

Esta guía te enseñará a implementar un sistema de autenticación seguro desde cero usando **JWT** (con la librería `jose`) y **Argon2** (el estándar dorado actual para hashing de contraseñas).

## ¿Por qué este stack?
- **Argon2**: Ganador de la *Password Hashing Competition*. Es resistente a ataques por GPU/ASIC a diferencia de bcrypt.
- **jose**: Librería moderna, ligera, sin dependencias y compatible con cualquier entorno JS (Node, Edge, Deno).

---

## Paso 1: Instalar Dependencias
```bash
npm install argon2 jose
```

## Paso 2: Actualizar la Base de Datos
Tu modelo [User](file:///d:/Users/Daniel/01_Projects/copark/copark-api/src/repositories/vehicles.repository.js#14-19) necesita un campo para guardar la contraseña.

**Editar [prisma/schema.prisma](file:///d:/Users/Daniel/01_Projects/copark/copark-api/prisma/schema.prisma):**
```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String   // <--- NUEVO CAMPO
  // ... resto de campos
}
```
Luego aplica el cambio: `npx prisma db push`.

## Paso 3: Tip: Clase Helper para Auth
Para mantener el código limpio, crearemos un helper para manejar la criptografía.

**Archivo: `src/utils/auth.utils.js` (Nuevo)**
```javascript
import * as argon2 from "argon2";
import { SignJWT, jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "secreto_super_seguro");

export const hashPassword = async (password) => {
  return await argon2.hash(password);
};

export const verifyPassword = async (hash, password) => {
  return await argon2.verify(hash, password);
};

export const generateToken = async (payload) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(SECRET);
};

export const verifyToken = async (token) => {
  const { payload } = await jwtVerify(token, SECRET);
  return payload;
};
```

## Paso 4: Servicio de Autenticación (`AuthService`)
Ahora usamos nuestro helper.

**Archivo: `src/services/auth.service.js`**
```javascript
import { prisma } from "../config/prisma.js";
import { hashPassword, verifyPassword, generateToken } from "../utils/auth.utils.js";

const register = async (data) => {
  // 1. Verificar si ya existe
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new Error("El email ya está uso");

  // 2. Encriptar contraseña (Argon2)
  const hashedPassword = await hashPassword(data.password);

  // 3. Crear usuario
  return await prisma.user.create({
    data: { ...data, password: hashedPassword },
  });
};

const login = async (email, password) => {
  // 1. Buscar usuario
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Credenciales inválidas");

  // 2. Comparar contraseñas (Argon2)
  const isValid = await verifyPassword(user.password, password);
  if (!isValid) throw new Error("Credenciales inválidas");

  // 3. Generar Token (jose)
  const token = await generateToken({ id: user.id, email: user.email });

  // Retornar usuario (sin password) y token
  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};

export default { register, login };
```

## Paso 5: Controlador (`AuthController`)
*Sin cambios respecto a la versión anterior.*

**Archivo: `src/controllers/auth.controller.js`**
```javascript
import authService from "../services/auth.service.js";

const register = async (req, res) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await authService.login(email, password);
    res.json(data);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

export default { register, login };
```

## Paso 6: El Guardían (Middleware)
Actualizado para usar `jose`.

**Archivo: [src/middlewares/auth.middleware.js](file:///d:/Users/Daniel/01_Projects/copark/copark-api/src/middlewares/auth.middleware.js)**
```javascript
import { verifyToken } from "../utils/auth.utils.js";

const authorize = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Validar token con jose
    const payload = await verifyToken(token);
    req.user = payload; 
    next(); 
  } catch (error) {
    return res.status(403).json({ error: "Invalid token" });
  }
};

export default authorize;
```
