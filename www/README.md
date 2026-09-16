# NutriSport 1.1 — Web + Android Sync Ready

## Mejoras
- Google Sign-In conservado.
- La cuenta PRO `luisangelesquerra@gmail.com` / UID `6oRhKb66WdNrc0ZJnD4dpjo3E4i2` se reconoce por UID y correo.
- El estado PRO se guarda también en el objeto raíz de la sesión (`isPremium` / `plan`) para que las tarjetas y funciones PRO se desbloqueen inmediatamente.
- Reconciliación automática del estado PRO entre Firebase y almacenamiento local.
- Coach Personal PRO, menú inteligente, lista de compras, rutina semanal y Smart Coach.
- Catálogo ampliado: 135 alimentos y 45 ejercicios.
- Monetag solo para usuarios no-PRO al entrar al dashboard.
- Indicador de conexión y recuperación de conexión.
- Puente `NutriSportNative` preparado para eventos de Android nativo.
- La información de usuarios sigue vinculada a Firebase Auth + Firestore por UID.

## Sincronización
La web y la futura aplicación Android deben utilizar el mismo proyecto Firebase `nutritrack-v2-ab92f`. De esta forma, una cuenta iniciada en web puede utilizarse en Android y compartir los datos almacenados en Firestore.

## Android nativo
Este paquete es la base web sincronizable. Una APK Android verdaderamente nativa requiere un proyecto Android compilable con Android SDK/Gradle y, para Google Sign-In nativo, registrar el paquete Android y sus huellas SHA-1/SHA-256 en Firebase.
