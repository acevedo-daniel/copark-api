# Guía de Demostración Extendida (Storytelling)

Esta demo cuenta la historia de **Juan (Dueño)** y **Pepe (Conductor)**.

> **Tip para la presentación:** No solo ejecutes comandos. Narra lo que está pasando. "Ahora Pepe necesita estacionar..."

## 🎬 Escena 0: El Inicio (Seed)
Reseteamos el universo para empezar desde cero.
```bash
curl -X POST http://127.0.0.1:5001/copark-api/us-central1/api/dev/seed
```
**¡IMPORTANTE!** Copia los `parkingId` y `vehicleId` que te devuelve este comando. Los usarás en toda la demo.

---

## 🎬 Escena 1: El Dueño (Juan)
Juan tiene una cochera y quiere mejorar su oferta.

**1. Juan revisa sus cocheras:**
"Juan entra a la app para ver qué tiene publicado."
```bash
curl http://127.0.0.1:5001/copark-api/us-central1/api/parkings/me \
  -H "Authorization: Bearer owner_1"
```

**2. Juan actualiza el precio:**
"Juan ve que hay mucha demanda y decide ajustar el precio."
```bash
curl -X PATCH http://127.0.0.1:5001/copark-api/us-central1/api/parkings/-Of5AV8qf0UOnN_VpTG8\
  -H "Authorization: Bearer owner_1" \
  -H "Content-Type: application/json" \
  -d '{"pricePerHour": 600}'
```

---

## 🎬 Escena 2: El Conductor (Pepe)
Pepe está en el centro y necesita estacionar su Toyota.

**3. Pepe verifica su perfil:**
"Pepe se asegura de tener sus datos al día."
```bash
curl http://127.0.0.1:5001/copark-api/us-central1/api/users/me \
  -H "Authorization: Bearer driver_1"
```

**4. Pepe revisa sus vehículos:**
"Pepe confirma qué auto va a usar y obtiene su ID."
```bash
curl http://127.0.0.1:5001/copark-api/us-central1/api/vehicles \
  -H "Authorization: Bearer driver_1"
```

**5. Pepe busca cochera:**
"Busca opciones disponibles."
```bash
curl http://127.0.0.1:5001/copark-api/us-central1/api/parkings
```

**6. Pepe reserva (El momento de la verdad):**
"Encuentra la cochera de Juan y reserva por 2 horas."
```bash
curl -X POST http://127.0.0.1:5001/copark-api/us-central1/api/bookings \
  -H "Authorization: Bearer driver_1" \
  -H "Content-Type: application/json" \
  -d '{
    "parkingId": "-Of5AV8qf0UOnN_VpTG8", 
    "vehicleId": "-Of5AV8nCvyL5A6ZQlSS", 
    "startTime": "2025-12-01T10:00:00Z",
    "endTime": "2025-12-01T12:00:00Z"
  }'
```
*(El ID del vehículo lo puedes sacar del seed o haciendo GET /vehicles)*

---

## 🎬 Escena 3: La Experiencia
Pepe ya usó la cochera y quiere dejar feedback.

**7. Pepe deja una reseña:**
"Le gustó el servicio y deja 5 estrellas."
```bash
curl -X POST http://127.0.0.1:5001/copark-api/us-central1/api/reviews \
  -H "Authorization: Bearer driver_1" \
  -H "Content-Type: application/json" \
  -d '{
    "parkingId": "-Of5AV8qf0UOnN_VpTG8",
    "rating": 5,
    "comment": "Excelente lugar, muy seguro."
  }'
```

**8. Verificación de Rating (Trigger):**
"Automáticamente, el sistema recalculó el puntaje de la cochera de Juan."
```bash
curl http://127.0.0.1:5001/copark-api/us-central1/api/parkings/-Of5AV8qf0UOnN_VpTG8
```
*Deberías ver `rating: 5`.*

---

## 🎬 Escena 4: Manejo de Errores (Bonus)
Demuestra que el sistema es robusto.

**9. Intento de fraude/error:**
"Pepe intenta reservar la misma cochera en el mismo horario otra vez."
*(Repetir el comando del paso 5)*
*Resultado esperado: Error 400/409.*

---

## 📝 Notas para el Presentador
*   **IDs:** Ten a mano un bloc de notas para copiar y pegar los IDs rápido.
*   **Tokens:** En esta demo usamos `owner_1` y `driver_1` como tokens simulados (si tu middleware lo permite) o los tokens reales si tienes auth activado.
*   **Limpieza:** Si algo sale mal, corre el paso 0 (Seed) y empieza de nuevo.
