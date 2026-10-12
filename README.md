# O-PLUS Admin · app de Android para administradores

1. Crea un repositorio nuevo en GitHub (por ejemplo `oplus-admin`) y sube TODO el contenido de esta carpeta (incluida `.github/workflows/build-apk.yml`).
2. Pestaña **Actions**: la compilación arranca sola (5-10 min). Cuando salga la palomita verde, descarga **OPLUS-Admin-apk** y descomprime: dentro está `app-debug.apk`.
3. Pasa el APK al celular de cada admin e instálalo.

Cada admin entra con su correo y contraseña de Firebase. Quién puede modificar qué lo deciden las reglas de Firestore,
no la app: tener el APK no da permisos. El modo mantenimiento solo aparece para el dueño.
