# NutriSport Android — sincronizado con la web

Este repositorio convierte la versión web de NutriSport en una aplicación Android mediante Capacitor.

## Qué se sincroniza

La app usa el mismo Firebase que la web actual:

- Firebase Authentication
- Google / correo y contraseña
- Firestore
- mismos UID de usuario
- mismos perfiles y datos guardados en la nube
- misma lógica PRO por UID/correo configurada en la aplicación web

Esto significa que la APK NO crea una segunda cuenta ni una segunda base de datos.

## Crear el repositorio en GitHub

1. Crea un repositorio nuevo, por ejemplo `nutrisport-android`.
2. Sube el contenido de este ZIP a la raíz del repositorio.
3. En GitHub entra en **Actions**.
4. Ejecuta **NutriSport Android APK** con **Run workflow**.
5. Cuando termine, entra en la ejecución y descarga el artefacto `NutriSport-debug-apk`.

También se compila automáticamente al hacer push a `main` o `master`.

## Compilación local

Requisitos:

- Node.js 22+
- Java 21
- Android SDK

Comandos:

```bash
npm install
npx cap add android
npx cap sync android
cd android
./gradlew assembleDebug
```

El APK queda en:

`android/app/build/outputs/apk/debug/app-debug.apk`

## Google Login en Android

La aplicación conserva el Firebase web actual y el inicio de sesión web. Para una experiencia Google nativa de Android (sin popup web), registra el paquete Android `com.nutrisport.app` en el proyecto Firebase y agrega las huellas SHA-1/SHA-256 del certificado de la aplicación. Después se puede integrar el proveedor nativo de Firebase Authentication para Android.

Para la primera compilación de GitHub Actions no hace falta guardar una contraseña ni una clave privada en el repositorio: se genera un APK debug para pruebas.

## Producción / Uptodown

Para publicar una versión de producción conviene usar una clave de firma privada almacenada como GitHub Secret y generar un APK/AAB release firmado. Nunca subas el `.jks` al repositorio.

## Importante

Esta aplicación comparte backend con la web. Los cambios de datos se reflejan entre dispositivos porque Firebase es la fuente de sincronización. La interfaz Android es el contenedor/app móvil; no es una página pública abierta mediante una URL.
