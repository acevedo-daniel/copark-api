# Guía de Presentación: CoPark API

Esta guía está diseñada para destacar no solo el código, sino el **valor** del producto.

## 💡 Consejos de Oro para la Presentación
1.  **Cuenta una Historia:** No digas "este es el endpoint de usuarios". Di "Pepe necesita verificar que su perfil esté listo para alquilar".
2.  **Pantalla Dividida:** Muestra tu terminal a un lado y el código/diagrama al otro.
3.  **Confianza:** Si algo falla, di "Interesante, el sistema de seguridad detectó una anomalía" (y revisa los logs con calma).

---

## 1. Introducción: El Problema (1 min)
*   **Gancho:** "¿Sabían que un conductor promedio pasa 20 minutos buscando estacionamiento?"
*   **Personajes:**
    *   **Juan:** Tiene una cochera vacía en el centro. Pierde plata.
    *   **Pepe:** Llega tarde al trabajo y no encuentra lugar.
*   **Solución:** "CoPark une a Juan y Pepe. Una API serverless rápida y segura."

## 2. Arquitectura: ¿Cómo funciona? (2 min)
*   "No usamos servidores tradicionales. Usamos **Firebase Cloud Functions**."
*   "Arquitectura de 3 Capas para orden y limpieza:"
    1.  **Controller:** "El recepcionista. Recibe el pedido."
    2.  **Service:** "El cerebro. Calcula precios y valida reglas."
    3.  **Repository:** "El archivista. Guarda en la base de datos."

## 3. La Demo: "Un día en CoPark" (5 min)
*(Sigue la [demo_guide.md](file:///C:/Users/mrdan/.gemini/antigravity/brain/59b99b08-9a0c-4034-a8b2-c6961be374d7/demo_guide.md) paso a paso)*

1.  **Inicio:** "Sembramos la base de datos."
2.  **Juan (Dueño):** "Juan ve su cochera y decide subir el precio porque es hora pico." (`PATCH /parkings`)
3.  **Pepe (Conductor):** "Pepe busca, encuentra la cochera de Juan y reserva." (`POST /bookings`)
4.  **Feedback:** "Pepe deja una reseña de 5 estrellas." (`POST /reviews`)
5.  **Magia (Trigger):** "Miren esto: sin que nadie toque nada, el sistema actualizó el promedio de la cochera de Juan."

## 4. Cierre (1 min)
*   "En resumen: Hemos creado un sistema escalable, seguro y modular."
*   "**Próximos pasos (v2):** Pagos con Stripe y Geolocalización."
*   "Gracias. ¿Preguntas?"

---

## ❓ Preguntas Frecuentes (Cheat Sheet)
*   **P: ¿Qué pasa si dos reservan a la vez?**
    *   R: "Firebase maneja transacciones atómicas, y nuestra lógica valida disponibilidad antes de escribir."
*   **P: ¿Por qué no SQL?**
    *   R: "Para este MVP, la velocidad de desarrollo y la integración nativa de Firebase Realtime Database eran ideales."
