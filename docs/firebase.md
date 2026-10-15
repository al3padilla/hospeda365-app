# Firebase: autenticación y perfiles de Hospeda365

La aplicación móvil usa Firebase Authentication para correo/contraseña y Cloud Firestore para perfiles privados. Se conserva el diseño del mockup móvil. El SDK JavaScript de Firebase funciona con Expo Go; registrar una app **web** en la consola solo proporciona la configuración del SDK y no convierte este proyecto en un sitio web.

Tras integrar las nuevas pantallas de `main`, login, registro y perfil usan sus componentes visuales y un único proveedor `contexto/AuthContext.tsx`. `servicios/index.ts` selecciona `authFirebase`, que adapta Firebase al contrato de sesión de esas pantallas. `authMock` queda como material de desarrollo sin usarse en la app. Los datos de habitaciones y reservas del avance de `main` siguen siendo simulados: esta integración conecta la autenticación y los perfiles.

## Configuración del proyecto real

1. Abre el proyecto `hospeda365-ee59d` en Firebase Console.
2. En **Configuración del proyecto → General → Tus apps**, selecciona la aplicación **</>** y la opción **Config**. Si no existe, registra una app sin activar Hosting.
3. Copia `.env.example` a `.env` y completa `apiKey`, `authDomain`, `projectId` y `appId` en sus variables correspondientes. Estos identificadores son públicos y Expo los incluye en la app. No uses cuentas de servicio, claves privadas ni Firebase Admin SDK en el cliente.
4. En **Authentication → Sign-in method**, activa **Correo electrónico/contraseña**. No se usa acceso anónimo.
5. En la política de contraseñas de Authentication configura modo **Require**, mínimo **12**, máximo **128**, y exige mayúscula, minúscula y número, para hacer cumplir en el servidor los requisitos del registro.
6. Comprueba que esté activada la **protección contra enumeración de correos** en Authentication. La app muestra errores de login genéricos, pero esta protección también debe existir en el servicio.
7. Crea **Cloud Firestore**, base de datos `(default)`, en modo producción, si todavía no existe.
8. Revisa y publica el contenido completo de `firestore.rules` en Firestore. Este archivo integra las reglas compartidas por el usuario para `users`, `rooms`, `reservations`, `payments` y `metrics`. La copia original se conserva en `docs/firestore-original.rules`. Si alguien modificó las reglas de la consola después de compartirlas, compara esos cambios antes de publicar. No agregues un permiso global como `allow read, write: if true`, porque anularía las restricciones.
9. Reinicia Expo para cargar `.env`: `npm.cmd start -- --clear`.

El código no publica reglas ni cambia servicios de Firebase automáticamente. Tener `.env` completo no basta si el proveedor, la base de datos o las reglas aún no están configurados.

### Estado de la conexión verificada

La configuración suministrada de `hospeda365-ee59d` está guardada en `.env`, excluido de Git. Firebase Authentication responde a la consulta de configuración pública y rechazó con `INVALID_LOGIN_CREDENTIALS` un único intento de login con una dirección aleatoria del dominio reservado `.invalid`; no se creó ninguna cuenta real. Firestore rechaza la lectura anónima del documento inexistente usado como comprobación; esto no sustituye la revisión de todas las reglas.

La consulta al servicio de política de contraseñas devolvió mínimo 6 y máximo 4096. Falta ajustar en la consola el mínimo a 12, el máximo a 128 y los requisitos de mayúscula, minúscula y número para igualar el registro. No hay una sesión administrativa de Firebase CLI en este equipo; las reglas y la política del proyecto real no se publicaron desde esta tarea.

## Flujo y datos

- Registro: valida nombres y apellidos separados → crea cuenta en Authentication → actualiza nombre completo → crea `users/{uid}` en Firestore → abre las pantallas protegidas.
- Login: autentica con Firebase → comprueba que el perfil propio tenga `activo: true` → crea uno si faltó por un fallo previo → abre las pantallas protegidas. Una cuenta desactivada se desconecta.
- Restauración: espera a Firebase y comprueba el estado activo del perfil antes de mostrar rutas privadas. Si no puede comprobarlo, cierra sesión. Esta comprobación requiere conexión. En móvil se usa la persistencia de sesión de Firebase con AsyncStorage; no se guardan manualmente contraseñas. Los tokens persistentes están sujetos a la seguridad del almacenamiento del dispositivo; no es almacenamiento cifrado de credenciales diseñado por esta app.
- Perfil: muestra nombre y correo del usuario autenticado y permite cerrar sesión. Al salir, se retiran las rutas protegidas del historial.
- Si la cuenta se creó y falló el perfil, se informa el resultado parcial y se cierra sesión; el usuario debe intentar login para completar el perfil. No se borra una cuenta automáticamente.

El documento móvil `users/{uid}` contiene `uid`, `nombre`, `apellido`, `email` en minúsculas, `rol: 'huesped'`, `activo: true`, `createdAt` generado por el servidor y el `telefono` solicitado por el nuevo registro. Usa el esquema de la web. Las reglas también aceptan el registro web con sus cinco campos obligatorios, sin exigirle los metadatos móviles `uid` y `createdAt`. No se guardan contraseña, confirmación ni tokens. Los perfiles existentes no se sobrescriben al iniciar sesión. Cuando falta un perfil antiguo se conserva el nombre completo de Authentication en `nombre` y se deja `apellido` vacío, sin adivinar cómo separar nombres culturales compuestos.

La app móvil no consulta listados de usuarios. Las reglas conservan el acceso de lectura del personal activo para el CRUD web. Los huéspedes pueden actualizar únicamente `nombre`, `apellido` y `telefono` con formato válido; un administrador activo conserva el permiso de gestión de perfiles. No pueden borrarse usuarios desde el cliente. Los roles privilegiados nunca se aceptan al registrar una cuenta nueva. Se conserva la restricción de `main`: la app móvil permite huéspedes y el personal utiliza la web; una cuenta administrativa autenticada por Firebase se desconecta antes de abrir la app.

## Validación y seguridad

- Nombres: 3–100 caracteres. Apellidos: obligatorios en el registro móvil, máximo 100. Ambos usan normalización Unicode NFC, letras, espacios, apóstrofos y guiones; se rechazan etiquetas, números y controles.
- Teléfono: obligatorio en el nuevo registro, formato de El Salvador (8 dígitos iniciados en 2, 6 o 7, con prefijo 503 opcional), máximo 20 caracteres. Las reglas validan el teléfono cuando está presente y permiten perfiles antiguos sin él. Si publicaste una versión anterior de las reglas de esta rama, vuelve a publicar `firestore.rules` antes de probar este registro con teléfono.
- Correo: obligatorio, máximo 254 caracteres y formato de dirección válido. Se recortan únicamente sus espacios exteriores.
- Contraseña de registro: 12–128 caracteres, mayúscula, minúscula y número. Confirmación idéntica. No se recorta ni modifica la contraseña.
- Login: permite contraseñas antiguas que no cumplan la nueva política de registro; Firebase verifica la credencial. Se rechazan entradas vacías, excesivas o con controles.
- Las validaciones se repiten en el servicio, además de la UI. El envío usa un bloqueo para evitar solicitudes simultáneas por doble toque.
- Las reglas verifican propietario, UID y fecha si se envían, correo del token, nombres, campos permitidos y rol de creación. Bloquean que un huésped liste usuarios, lea perfiles ajenos, cambie roles o estados activos, agregue campos arbitrarios o borre perfiles. El personal activo conserva las lecturas que utiliza la web. Las reglas de los demás módulos se mantienen como fueron compartidas; integrarlas no equivale a una auditoría completa de reservas, pagos o cálculo de totales.
- Se muestran mensajes controlados; no se imprimen contraseñas ni se exponen mensajes técnicos del backend.

Firestore es NoSQL y el login usa llamadas estructuradas del SDK, no consultas SQL concatenadas. Por eso no se añade una lista de palabras como `SELECT` o `DROP`: una contraseña puede contener signos o esas palabras sin que se ejecuten como código. Las rutas de perfiles se construyen con el UID emitido por Firebase, nunca con nombres o correos escritos por el usuario. React Native representa el nombre como texto.

**Scraping y bots:** validar campos no detiene clientes automatizados. Las reglas impiden que un huésped extraiga perfiles ajenos o listados de usuarios; para reducir abuso del servicio hay que revisar cuotas, alertas de uso, protección de enumeración y App Check. El SDK nativo con Play Integrity en Android o App Attest/DeviceCheck en iOS requiere una compilación de desarrollo/producción y configuración adicional; este proyecto con Expo Go **no incluye App Check activo ni una garantía contra scraping**. No actives su cumplimiento obligatorio antes de integrar y probar la atestación, porque bloquearía esta app. Los datos accesibles a un usuario autorizado siempre pueden ser copiados por ese usuario.

La auditoría de npm también detectó avisos en dependencias del árbol Expo/Firebase. Se actualizó `shell-quote` para resolver el aviso crítico de inyección de comandos; quedan avisos altos y moderados que deben revisarse antes de producción. Las validaciones de los formularios no corrigen vulnerabilidades de dependencias. No se aplica `npm audit fix --force`, cuyas propuestas incluyen cambios incompatibles con Expo 57.

## Pruebas

```sh
npm.cmd run typecheck
npm.cmd test
npm.cmd run test:firebase
```

`test:firebase` necesita Java 21 y descarga los emuladores de Firebase en la primera ejecución. Usa exclusivamente el proyecto ficticio `demo-hospeda365`, con Auth en `127.0.0.1:9099` y Firestore en `127.0.0.1:8080`. No usa ni modifica cuentas reales.

Las pruebas cubren formatos, longitudes, contraseñas, ausencia de credenciales en perfiles, errores controlados, recuperación de perfiles incompletos, registro/login mediante el SDK contra emuladores, acceso propio, bloqueo de anónimos, listado, perfiles ajenos y escalación de privilegios.

Las pruebas adicionales de integración verifican el adaptador de las pantallas nuevas, tokens emitidos por Firebase, persistencia del teléfono, edición de perfil, restauración de sesión, desconexión de cuentas inactivas y rechazo de cuentas del personal. Los tokens del SDK se renuevan automáticamente y el contexto escucha sus cambios; no se usan los tokens ficticios de `authMock`.

En un teléfono: crea una cuenta con un correo propio, revisa Authentication y `users/{uid}`, cierra sesión, intenta una contraseña incorrecta, vuelve a iniciar sesión y reinicia la app para comprobar la persistencia. No se crearon usuarios ni se probaron credenciales contra el proyecto real sin su configuración.

## Fuentes técnicas

- [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/)
- [Firebase en Expo](https://docs.expo.dev/guides/using-firebase/)
- [Firebase: acceso con contraseña y protección de enumeración](https://firebase.google.com/docs/auth/web/password-auth)
- [Firebase: condiciones de las reglas de Firestore](https://firebase.google.com/docs/firestore/security/rules-conditions)
- [Firebase App Check](https://firebase.google.com/docs/app-check)
