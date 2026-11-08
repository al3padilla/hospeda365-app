# Acceso con Google y Firebase

## Qué causaba el error

La captura muestra HTTP 400 `redirect_uri_mismatch`: Google recibió una URL de retorno que no coincide exactamente con las autorizadas para el cliente OAuth. El formulario anterior usaba un único cliente web incrustado con Expo AuthSession, sin separar navegador y móvil. La captura no permite conocer la URL exacta enviada ni confirmar la configuración de la consola.

Ahora web usa `signInWithPopup` de Firebase y Android/iOS obtienen un ID token mediante Google Sign-In nativo y lo intercambian con Firebase. Ambos pasan por `authFirebase` y `AuthContext`: bloqueo de operaciones simultáneas, errores visibles, perfil privado por UID, validación de cuenta activa y rol huésped. Correo/contraseña y la persistencia existente se mantienen. Cancelar Google vuelve al formulario sin mostrar un error.

## Variables locales

Por acuerdo del equipo, `.env` se incluye en Git para compartir la configuración pública de Firebase, los clientes OAuth y los identificadores de la app. `.env.example` queda como plantilla. Las variantes `.env.local` y `.env.*.local` siguen excluidas para ajustes de cada equipo. No agregues secretos OAuth, cuentas de servicio ni claves privadas al archivo compartido.

Mantén estos valores de Firebase Console > Configuración del proyecto > General > Tus apps > aplicación web > Config:

- `EXPO_PUBLIC_FIREBASE_API_KEY`
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
- `EXPO_PUBLIC_FIREBASE_APP_ID`
- `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`

Para móvil agrega:

```dotenv
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=CLIENTE_DE_TIPO_WEB.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=CLIENTE_DE_TIPO_IOS.apps.googleusercontent.com
GOOGLE_ANDROID_PACKAGE=com.hospeda365.app
GOOGLE_IOS_BUNDLE_IDENTIFIER=com.hospeda365.app
```

Obtén los clientes en Google Cloud > APIs y servicios > Credenciales, en el mismo proyecto de Firebase (`hospeda365-ee59d`). El cliente web es el destinatario del ID token de Android y iOS; no pongas un cliente Android en esa variable. El cliente que estaba incrustado en el código no se reutiliza sin verificar su tipo y proyecto en la consola.

El cliente iOS solo es obligatorio para iOS. Los identificadores de paquete son valores iniciales: si ya hay apps registradas o publicadas, copia exactamente sus identificadores antes de compilar. `app.config.js` los usa y deriva el esquema URL de iOS del cliente iOS. El esquema provisional sin credenciales permite trabajar en Android/web, pero NO habilita Google en iOS.

Estos son identificadores de cliente públicos. Nunca agregues secretos OAuth, JSON de cuentas de servicio ni claves privadas al cliente. Con Firebase JS y los identificadores explícitos de esta integración no se requieren `google-services.json` ni `GoogleService-Info.plist`.

## Consolas: configuración que requiere acceso del propietario

### Firebase Authentication y Firestore

1. Activa los proveedores **Google** y **Correo electrónico/contraseña** en Authentication > Sign-in method. En Google selecciona el correo de asistencia y guarda.
2. En Authentication > Settings > Authorized domains, agrega `localhost` para desarrollo web y el dominio real al publicar. No incluyas protocolo ni puerto. No asumas que localhost ya está autorizado.
3. Confirma que Firestore existe y que están publicadas las reglas del repositorio. No se modifican ni despliegan reglas en esta corrección.
4. Conserva la política de contraseñas y demás configuración documentada en [firebase.md](firebase.md).

### Web: corregir la URL de retorno

En Google Cloud > APIs y servicios > Credenciales abre el cliente **Web** asociado al proveedor Google de Firebase:

- URI de redireccionamiento autorizada: `https://hospeda365-ee59d.firebaseapp.com/__/auth/handler` (si cambias `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`, usa ese dominio).
- Origen JavaScript de desarrollo: `http://localhost:8081`. Si cambias el puerto, registra el origen exacto. Agrega también el origen HTTPS real al publicar.
- Guarda y espera la propagación. Revisa que el cliente web configurado en el proveedor de Firebase sea el correcto.
- Si la pantalla de consentimiento está en pruebas, agrega los correos de quienes van a probar en la audiencia/usuarios de prueba.

La devolución web la administra Firebase. No registres `exp://...` ni `hospeda365://...` como callback del cliente web. Ya no se utiliza el callback automático de AuthSession.

### Android

1. Registra o revisa la app Android del proyecto Firebase con el paquete definido en `GOOGLE_ANDROID_PACKAGE`.
2. Agrega SHA-1 y SHA-256 del certificado que firma la compilación de prueba. Con Android Studio/Gradle puedes obtenerlos con `cd android` y `.\gradlew.bat signingReport`. La carpeta android se genera al compilar.
3. Comprueba en Google Cloud que existe un cliente OAuth de tipo Android con ese paquete y SHA-1. Usa el mismo proyecto que el cliente Web.
4. Para una compilación firmada con otra clave (EAS, producción o Google Play App Signing), registra también sus huellas correspondientes. Un certificado distinto puede producir `DEVELOPER_ERROR`.
5. Usa un dispositivo/emulador con Google Play Services.

### iOS

1. Registra la app iOS con el bundle identifier exacto.
2. Crea/revisa su cliente OAuth iOS y copia el ID a `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`.
3. Regenera la compilación después de cambiar el ID o el bundle. El plugin registra el esquema invertido requerido para volver desde Google.
4. La compilación local de iOS requiere macOS/Xcode.

## Ejecutar y comprobar

Usa Node **24.12 o superior** (requerido por las dependencias Firebase 13 de este proyecto).

```powershell
npm.cmd ci
npm.cmd run typecheck
npm.cmd test
npm.cmd run web -- --clear --port 8081
```

En móvil **Google no funciona en Expo Go**, porque requiere código nativo. Correo/contraseña sigue disponible allí y Google muestra un mensaje explicativo. Para Android instala Android Studio/SDK y Java compatibles con Expo 57:

```powershell
npx.cmd expo run:android
```

Para iOS, en macOS: `npx expo run:ios`. La configuración local admite estas compilaciones sin EAS. Para Android también quedó preparado EAS, como se explica a continuación.

## APK de prueba con EAS (sin Google Play)

El proyecto está vinculado a [@apolocreed/hospeda365-app](https://expo.dev/accounts/apolocreed/projects/hospeda365-app). `eas.json` contiene un perfil `preview` que genera un APK independiente de Metro y un perfil `development` con `expo-dev-client` para desarrollo. No hay envío automático a tiendas.

Las ocho variables públicas requeridas para Android se cargaron en el entorno **preview** de EAS. `.env` también se comparte en Git por acuerdo del equipo. Si modificas valores, sincroniza los mismos nombres en Expo > Project settings > Environment variables > preview antes de volver a compilar. El perfil development requiere configurar por separado su entorno development.

Para generar otro APK con la cuenta autorizada:

```powershell
npx.cmd eas-cli@latest build --platform android --profile preview
```

El certificado remoto generado para `com.hospeda365.app` tiene estas huellas públicas. Agrégalas en Firebase > Configuración del proyecto > Tus apps > Android > Add fingerprint, una por una:

```text
SHA-1: CF:32:D7:68:66:BB:08:D8:6D:E5:10:DD:2B:97:DC:25:39:97:09:8B
SHA-256: 7C:4E:11:44:73:7A:E2:BA:C5:B7:1C:F1:B5:06:23:AA:E2:66:FB:71:F6:91:67:B5:B6:AE:ED:EE:C5:0F:8D:DC
```

Estas huellas corresponden al certificado remoto de EAS, no al certificado debug de una compilación local. No generes otra clave para cada compilación: conserva el certificado para poder actualizar la app instalada. La consulta `npx.cmd eas-cli@latest credentials --platform android` permite revisar las huellas; no necesitas descargar ni compartir la clave privada.

La primera compilación finalizó correctamente con ID `30855194-17b7-4ba9-b423-5fc31a6c3577`. Puedes [descargar el APK de prueba](https://expo.dev/artifacts/eas/6BFQPGYrNORBxyJ8t7r16OPzLPxJZlN-aic9j1BmhAk.apk) o revisar [la página de compilación](https://expo.dev/accounts/apolocreed/projects/hospeda365-app/builds/30855194-17b7-4ba9-b423-5fc31a6c3577). Instálalo en el teléfono Android; el sistema puede pedir autorización para instalar aplicaciones desde el navegador. El propietario confirmó haber registrado la SHA-1 en Firebase. Confirma el proveedor Google habilitado y espera la propagación de las huellas antes de probar el acceso.

Reinicia Metro con caché limpia tras cambiar .env. Reconstruye el binario si cambias paquetes nativos, identificadores o el cliente iOS.

Prueba con una cuenta propia: cancelar Google; primer ingreso; ingreso con perfil existente; cierre de sesión; reinicio para comprobar persistencia; correo/contraseña; cuenta desactivada; cuenta del personal. En Firebase comprueba Authentication y `users/{uid}`. No deben guardarse contraseñas ni tokens en el perfil, ni sobrescribirse roles o perfiles existentes. Si Google devuelve un nombre incompatible con las reglas del perfil (p. ej. emojis o menos de tres letras), un perfil nuevo usa “Huésped”; el nombre se puede editar después.

Las pruebas automatizadas simulan Google y Firebase para comprobar integración y fallos sin crear cuentas reales. No sustituyen el consentimiento real, la firma Android/iOS ni la configuración de consola. Las pruebas de emuladores requieren Java 21+ y se ejecutan con `npm.cmd run test:firebase`.

## Fuentes

- [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/)
- [Google en Expo](https://docs.expo.dev/guides/google-authentication/)
- [Firebase: Google en web](https://firebase.google.com/docs/auth/web/google-signin)
- [Google Sign-In: configuración Expo](https://react-native-google-signin.github.io/docs/setting-up/expo)
- [Google Sign-In: API nativa](https://react-native-google-signin.github.io/docs/original)

## Verificación de esta corrección

- TypeScript: correcto.
- Pruebas automatizadas: 21 aprobadas.
- Exportación web y bundle Android (Hermes): correctos. No equivale a compilar un APK.
- Emuladores Firebase: no ejecutados; no se encontró Java instalado en este entorno.
- APK Android preview: compilado y firmado correctamente en EAS. Certificado remoto consultado; el propietario confirmó la SHA-1 guardada en Firebase.
- Login OAuth real y persistencia en el teléfono: pendientes de probar en el dispositivo con una cuenta propia.
