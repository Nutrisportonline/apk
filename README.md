# NutriSport Android 1.2 — sincronizado con la web

Esta versión conserva la misma interfaz y el mismo Firebase de NutriSport, pero corrige el flujo de Google para Android y ajusta la interfaz móvil para que no aparezcan pantallas PRO inesperadas ni elementos sobrepuestos.

## Qué cambia en Android

- **Google nativo:** en Android el botón usa Firebase Authentication nativo + Credential Manager. Ya no usa `signInWithPopup()` dentro de la WebView, por lo que el flujo no debe dejar al usuario atrapado en Chrome. El resultado nativo se entrega al Firebase JS de la app para que Firestore siga usando la misma sesión.
- **Cuenta de Google del dispositivo:** se utiliza el selector/cuentas de Google disponibles en Android.
- **PRO:** se mantiene la identificación PRO por UID/correo y se fuerza la reconciliación del perfil después del inicio de sesión. La cabecera ahora muestra `v1.3 PRO` cuando corresponde.
- **Coach PRO:** ya no aparece como una pantalla grande que se abre sola. Se muestra un resumen y el contenido completo se abre únicamente al tocar **Ver Coach PRO completo**.
- **UX móvil:** se añadió espacio para la barra inferior y las áreas seguras del teléfono, se evita el desplazamiento horizontal y se controlan mejor los elementos fijos para reducir solapamientos.
- **Icono:** el workflow copia iconos Android por densidad y usa un icono adaptativo para evitar que el launcher termine mostrando el icono blanco genérico de Capacitor.

## Configuración necesaria de Google para Android

Que el dominio web esté autorizado en Firebase **no es suficiente para el inicio de sesión nativo de Android**. Firebase/Google también necesitan conocer la aplicación Android y el certificado que la firma. La documentación oficial requiere registrar la huella SHA-1 del certificado para Google Sign-In; para builds distribuidos también debe registrarse el certificado de firma correspondiente.

Este repositorio usa para las builds **debug de GitHub** una clave de prueba fija, únicamente para pruebas. Registra estos fingerprints en el proyecto Firebase/Google del mismo proyecto que usa NutriSport:

- Paquete: `com.nutrisport.app`
- SHA-1: `46:81:19:F0:DA:CA:2C:51:23:FB:75:04:21:6C:E8:4F:00:83:79:C7`
- SHA-256: `F2:39:F8:DA:D5:58:6A:BC:77:47:F8:AA:05:D7:D2:3D:13:F6:31:C3:BF:F9:39:49:D1:73:7E:D9:A7:81:41:BC`

Además:

1. En Firebase Console agrega una **app Android** con paquete `com.nutrisport.app`.
2. Añade las huellas anteriores.
3. En Authentication, verifica que **Google** esté habilitado.
4. Descarga el `google-services.json` actualizado para esa app Android.
5. Este ZIP ya incluye el `google-services.json` validado para `com.nutrisport.app` y la huella SHA-1 registrada. Si Firebase genera uno nuevo, reemplaza el archivo por el nuevo.
6. Vuelve a ejecutar el workflow **NutriSport Android APK**.

Firebase indica que el `google-services.json` actualizado contiene la información OAuth necesaria para Google Sign-In en Android.

> La clave incluida en este repositorio es solo para builds debug de prueba. No debe reutilizarse para publicar en Google Play. Para producción hay que usar una clave de firma propia y registrar su SHA-1/SHA-256.

## GitHub Actions

1. Sube el contenido del ZIP a la raíz del repositorio.
2. Coloca `google-services.json` en la raíz.
3. Abre **Actions → NutriSport Android APK → Run workflow**.
4. Descarga `NutriSport-debug-apk` al finalizar.

El workflow genera el proyecto Android desde Capacitor, instala el plugin nativo de Firebase Authentication, configura Credential Manager, usa el `google-services.json` incluido, copia el icono y firma la build debug con la clave de prueba estable para que la huella registrada no cambie entre ejecuciones.

## Sincronización

La app sigue usando:

- Firebase Authentication
- Google / correo y contraseña
- Firestore
- los mismos UID
- los mismos perfiles y datos de la web
- la misma lógica PRO

No se crea una segunda base de datos ni una cuenta Android separada.


## v1.3 UX hardening
- Coach PRO colapsado por defecto para no bloquear la pantalla.
- Inicio de sesión Google nativo en Android; la web conserva popup de Google.
- Mejoras de accesibilidad, safe-area, toque y mensajes no invasivos.
- Eliminado el confirm obligatorio al entrar como invitado; ahora se muestra una nota informativa.
- Reautenticación Google nativa en Android para acciones sensibles.
