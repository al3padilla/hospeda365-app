const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const { initializeApp, deleteApp } = require('firebase/app');
const { getAuth, connectAuthEmulator } = require('firebase/auth');
const { getFirestore, connectFirestoreEmulator, doc, getDoc, updateDoc, terminate } = require('firebase/firestore');
const { initializeTestEnvironment } = require('@firebase/rules-unit-testing');

function load(path, deps = {}) {
  const code = ts.transpileModule(readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const exports = {};
  vm.compileFunction(code, ['exports', 'require'], { filename: path })(exports, (name) => deps[name] || require(name));
  return exports;
}

test('new UI provider authenticates with real Firebase tokens, saves phone, restores and enforces roles', async () => {
  assert.ok(process.env.FIREBASE_AUTH_EMULATOR_HOST);
  assert.ok(process.env.FIRESTORE_EMULATOR_HOST);
  const app = initializeApp({ apiKey: 'fake-api-key', projectId: 'demo-hospeda365' }, 'adapter-integration');
  const auth = getAuth(app);
  const db = getFirestore(app);
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
  const env = await initializeTestEnvironment({ projectId: 'demo-hospeda365', firestore: { host: '127.0.0.1', port: 8080 } });
  const firebase = { getFirebase: () => ({ auth, db }) };
  const validation = load('utils/authValidation.ts');
  const ui = load('validacion/auth.ts', { '../utils/authValidation': validation });
  const core = load('services/auth.ts', { './firebase': firebase, '../utils/authValidation': validation });
  const types = load('servicios/tiposAuth.ts');
  const { authFirebase: api } = load('servicios/authFirebase.ts', {
    '../services/auth': core, '../services/firebase': firebase, '../utils/authValidation': validation,
    '../validacion/auth': ui, './tiposAuth': types,
  });
  const values = { nombre: 'María', apellido: 'Pérez', telefono: '+503 7123 4567', email: `adapter-${Date.now()}@example.com`, password: 'Descanso2026!', confirmPassword: 'Descanso2026!' };
  try {
    assert.equal(await api.restaurarSesion(), null);
    await assert.rejects(api.registrar({ ...values, telefono: 'invalid' }));
    assert.equal(auth.currentUser, null);
    const session = await api.registrar(values);
    const uid = session.usuario.id;
    assert.equal(session.token, await auth.currentUser.getIdToken());
    assert.equal(session.usuario.telefono, values.telefono);
    assert.equal(session.usuario.nombre, values.nombre);
    assert.equal((await getDoc(doc(db, 'users', uid))).data().password, undefined);
    await assert.rejects(api.actualizarPerfil(uid, { rol: 'admin' }));
    const updated = await api.actualizarPerfil(uid, { nombre: 'Ana María', telefono: '7123 4567' });
    assert.equal(updated.nombre, 'Ana María');
    assert.equal((await api.restaurarSesion()).usuario.nombre, 'Ana María');
    await api.logout();
    assert.equal(await api.restaurarSesion(), null);
    await assert.rejects(api.login({ email: values.email, password: 'WrongPassword123' }));
    assert.equal(auth.currentUser, null);
    assert.equal((await api.login(values)).usuario.id, uid);
    await env.withSecurityRulesDisabled(async (context) => {
      await updateDoc(doc(context.firestore(), 'users', uid), { activo: false });
    });
    await assert.rejects(api.restaurarSesion());
    assert.equal(auth.currentUser, null);
    await env.withSecurityRulesDisabled(async (context) => {
      await updateDoc(doc(context.firestore(), 'users', uid), { activo: true, rol: 'admin' });
    });
    await assert.rejects(api.login(values), (error) => error.codigo === 'acceso_solo_huespedes');
    assert.equal(auth.currentUser, null);
  } finally {
    await env.cleanup();
    await terminate(db);
    await deleteApp(app);
  }
});
