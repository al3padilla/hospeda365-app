const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function load(path, dependencies = {}, env = {}) {
  const code = ts.transpileModule(readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const exports = {};
  vm.runInNewContext(code, { exports, process: { env }, require(name) {
    assert.ok(name in dependencies, 'Unexpected dependency: ' + name);
    return dependencies[name];
  } }, { filename: path });
  return exports;
}

function setup({ native = false, cancelled = false, active = true, exists = false,
  failWrite = false, popupError, ownership = null, platform = 'android', token = 'google-id-token',
  env = { EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID: 'web.apps.googleusercontent.com',
    EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID: 'ios.apps.googleusercontent.com' }, role = 'huesped' } = {}) {
  const calls = [];
  const user = { uid: 'google-user', email: 'Guest@example.com', displayName: 'Li',
    metadata: {}, getIdTokenResult: async () => ({ token: 'firebase-token', expirationTime: '2030-01-01' }) };
  const auth = { currentUser: null };
  const signIn = async () => { auth.currentUser = user; return { user }; };
  class GoogleAuthProvider {
    setCustomParameters(params) { calls.push(['params', params.prompt]); }
    static credential(value) { calls.push(['credential', value]); return 'credential'; }
  }
  const sdk = {
    GoogleAuthProvider,
    signInWithPopup: async () => {
      calls.push(['popup']);
      if (popupError) throw { code: popupError };
      if (cancelled) throw { code: 'auth/popup-closed-by-user' };
      return signIn();
    },
    signInWithCredential: async (_, credential) => { calls.push(['firebase', credential]); return signIn(); },
    signOut: async () => { auth.currentUser = null; calls.push(['signOut']); },
  };
  class Timestamp {}
  const firestore = {
    Timestamp, doc: (_, collection, uid) => ({ collection, uid }),
    getDoc: async () => ({ exists: () => exists, data: () => ({ activo: active, rol: role, nombre: 'Huésped' }) }),
    setDoc: async (ref, data) => {
      calls.push(['profile', ref, data]);
      if (failWrite) throw { code: 'permission-denied' };
      exists = true;
    },
    serverTimestamp: () => 'SERVER_TIMESTAMP',
  };
  const firebase = { getFirebase: () => ({ auth, db: {} }) };
  const validation = load('utils/authValidation.ts');
  const core = load('services/auth.ts', { './firebase': firebase,
    '../utils/authValidation': validation, 'firebase/auth': sdk, 'firebase/firestore': firestore });
  const GoogleSignin = {
    configure: (options) => calls.push(['configure', options]),
    hasPlayServices: async () => calls.push(['playServices']),
    hasPreviousSignIn: () => true,
    signOut: async () => calls.push(['googleSignOut']),
    signIn: async () => cancelled ? { type: 'cancelled' } : { type: 'success', data: { idToken: token } },
  };
  const google = load(native ? 'services/googleAuth.native.ts' : 'services/googleAuth.ts', {
    './firebase': firebase, './auth': core, 'firebase/auth': sdk,
    'expo-constants': { __esModule: true, default: { appOwnership: ownership } }, 'react-native': { Platform: { OS: platform } },
    '@react-native-google-signin/google-signin': {
      GoogleSignin, isSuccessResponse: (response) => response.type === 'success',
      statusCodes: { SIGN_IN_CANCELLED: 'SIGN_IN_CANCELLED' },
    },
  }, env);
  const types = load('servicios/tiposAuth.ts');
  const adapter = load('servicios/authFirebase.ts', {
    '../services/googleAuth': google, '../services/auth': core, '../services/firebase': firebase,
    '../utils/authValidation': validation, '../validacion/auth': {}, './tiposAuth': types,
    'firebase/auth': sdk, 'firebase/firestore': firestore,
  }).authFirebase;
  return { google, adapter, calls, auth, user, core };
}

test('web Google uses Firebase popup and creates an owner guest profile without storing tokens', async () => {
  const { adapter, calls, user } = setup();
  const session = await adapter.loginGoogle();
  assert.equal(session.usuario.id, user.uid);
  assert.equal(session.token, 'firebase-token');
  assert.equal(calls[0][0], 'params');
  assert.equal(calls[1][0], 'popup');
  const [, ref, data] = calls.find(([name]) => name === 'profile');
  assert.equal(ref.uid, user.uid);
  assert.equal(data.email, 'guest@example.com');
  assert.equal(data.rol, 'huesped');
  assert.equal(data.nombre, 'Huésped'); // Google display names may be short or contain emoji.
  assert.equal(data.apellido, '');
  assert.equal(data.createdAt, 'SERVER_TIMESTAMP');
  assert.equal(JSON.stringify(data).includes('token'), false);
});

test('existing Google profile is preserved and inactive or staff accounts are signed out', async () => {
  const existing = setup({ exists: true });
  await existing.adapter.loginGoogle();
  assert.equal(existing.calls.some(([name]) => name === 'profile'), false);
  for (const options of [{ exists: true, active: false }, { exists: true, role: 'admin' }]) {
    const instance = setup(options);
    await assert.rejects(instance.adapter.loginGoogle());
    assert.equal(instance.auth.currentUser, null);
  }
});

test('profile failure leaves no authenticated session and is shown as a controlled error', async () => {
  const { adapter, auth } = setup({ failWrite: true });
  await assert.rejects(adapter.loginGoogle(), (error) => error.codigo === 'error_desconocido');
  assert.equal(auth.currentUser, null);
});

test('web and native cancellation return null without authenticating', async () => {
  for (const native of [false, true]) {
    const { adapter, auth, calls } = setup({ native, cancelled: true });
    assert.equal(await adapter.loginGoogle(), null);
    assert.equal(auth.currentUser, null);
    assert.equal(calls.some(([name]) => name === 'profile'), false);
  }
});

test('native signs into Firebase using Google ID token with the configured web audience', async () => {
  const { adapter, calls } = setup({ native: true });
  assert.equal((await adapter.loginGoogle()).token, 'firebase-token');
  const config = calls.find(([name]) => name === 'configure')[1];
  assert.equal(config.webClientId, 'web.apps.googleusercontent.com');
  assert.equal(config.offlineAccess, false);
  assert.ok(calls.some(([name]) => name === 'playServices'));
  assert.ok(calls.some(([name, value]) => name === 'credential' && value === 'google-id-token'));
});

test('Expo Go, missing configuration and missing tokens fail before Firebase authentication', async () => {
  for (const options of [{ ownership: 'expo' }, { env: {} }, { platform: 'ios', env: {
    EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID: 'web.apps.googleusercontent.com' } }, { token: null }]) {
    const { adapter, calls, auth } = setup({ native: true, ...options });
    await assert.rejects(adapter.loginGoogle());
    assert.equal(auth.currentUser, null);
    assert.equal(calls.some(([name]) => name === 'firebase'), false);
  }
});

test('blocked popups and unauthorized domains expose actionable messages without backend details', async () => {
  for (const popupError of ['auth/popup-blocked', 'auth/unauthorized-domain',
    'auth/account-exists-with-different-credential']) {
    const { adapter } = setup({ popupError });
    await assert.rejects(adapter.loginGoogle(), (error) => {
      assert.equal(error.message.includes(popupError), false);
      return error.message.length > 30;
    });
  }
});

function contextHarness(service) {
  const reducer = load('contexto/authReducer.ts');
  const types = load('servicios/tiposAuth.ts');
  const effects = [];
  const actions = [];
  let state = reducer.estadoInicial;
  let listener;
  const react = {
    createContext: () => ({ Provider: 'AuthProvider' }),
    useCallback: (callback) => callback,
    useContext: () => null,
    useEffect: (effect) => effects.push(effect),
    useMemo: (factory) => factory(),
    useReducer: () => [state, (action) => { actions.push(action); state = reducer.authReducer(state, action); }],
    useRef: (current) => ({ current }),
  };
  const { AuthProvider } = load('contexto/AuthContext.tsx', {
    react, 'react/jsx-runtime': { jsx: (_, props) => props },
    '../servicios': { ...types, servicioAuth: {
      observarCambiosSesion: (callback) => { listener = callback; return () => {}; },
      ...service,
    } },
    './authReducer': reducer,
  });
  const value = AuthProvider({ children: null }).value;
  effects.forEach((effect) => effect());
  return { value, actions, state: () => state, notify: () => listener() };
}

test('Google operation blocks duplicate login and prevents session restoration racing profile creation', async () => {
  let resolve;
  let googleCalls = 0;
  let emailCalls = 0;
  let restoreCalls = 0;
  const pending = new Promise((done) => { resolve = done; });
  const session = { usuario: { id: 'google-user', nombre: 'Ana', apellido: '' },
    token: 'firebase-token', expiraEn: '2030-01-01' };
  const context = contextHarness({
    loginGoogle: () => { googleCalls++; return pending; },
    login: () => { emailCalls++; throw new Error('Must be locked'); },
    restaurarSesion: () => { restoreCalls++; return null; },
  });
  const result = context.value.loginGoogle();
  assert.equal(await context.value.loginGoogle(), false);
  assert.equal(await context.value.login({ email: 'guest@example.com', password: 'password' }), false);
  context.notify();
  await Promise.resolve();
  assert.equal(restoreCalls, 0);
  assert.equal(googleCalls, 1);
  assert.equal(emailCalls, 0);
  resolve(session);
  assert.equal(await result, true);
  assert.equal(context.state().token, 'firebase-token');
  assert.equal(context.state().usuario.id, 'google-user');
});

test('Google cancellation resets context loading and releases the operation lock', async () => {
  const context = contextHarness({ loginGoogle: async () => null });
  assert.equal(await context.value.loginGoogle(), false);
  assert.equal(context.state().estado, 'no_autenticado');
  assert.equal(context.state().error, null);
  assert.equal(await context.value.loginGoogle(), false);
  assert.equal(context.actions.filter((action) => action.type === 'OPERACION_INICIADA').length, 2);
});
