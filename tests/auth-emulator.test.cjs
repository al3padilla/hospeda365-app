const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const { initializeApp, deleteApp } = require('firebase/app');
const { getAuth, connectAuthEmulator, signOut } = require('firebase/auth');
const { getFirestore, connectFirestoreEmulator, doc, getDoc, terminate } = require('firebase/firestore');

function load(path, overrides = {}) {
  const code = ts.transpileModule(readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  // Execute in the SDK's realm: Firestore checks plain-object prototypes.
  const exports = {};
  vm.compileFunction(code, ['exports', 'require'], { filename: path })(exports, (name) => overrides[name] || require(name));
  return exports;
}

test('real SDK: register, persist private profile, sign out, reject bad login, and sign in again', async () => {
  assert.ok(process.env.FIREBASE_AUTH_EMULATOR_HOST, 'Run this test through emulators:exec');
  assert.ok(process.env.FIRESTORE_EMULATOR_HOST, 'Run this test through emulators:exec');
  // Hardcoded demo project and explicit localhost endpoints prevent production writes.
  const app = initializeApp({ apiKey: 'fake-api-key', projectId: 'demo-hospeda365' }, 'auth-integration');
  const auth = getAuth(app);
  const db = getFirestore(app);
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
  const api = load('services/auth.ts', {
    './firebase': { getFirebase: () => ({ auth, db }) },
    '../utils/authValidation': load('utils/authValidation.ts'),
  });
  const values = { name: 'María', surname: 'Pérez', email: `integration-${Date.now()}@example.com`, password: 'Descanso2026!', confirmation: 'Descanso2026!' };
  try {
    const registered = await api.authenticate(values, true);
    const uid = registered.uid;
    assert.equal(registered.displayName, `${values.name} ${values.surname}`);
    const profile = (await getDoc(doc(db, 'users', uid))).data();
    assert.equal(profile.nombre, values.name);
    assert.equal(profile.apellido, values.surname);
    assert.equal(profile.rol, 'huesped');
    assert.equal(profile.activo, true);
    assert.equal(profile.password, undefined);
    await signOut(auth);
    assert.equal(auth.currentUser, null);
    await assert.rejects(api.authenticate({ ...values, password: 'WrongPassword2026' }, false));
    assert.equal(auth.currentUser, null);
    const loggedIn = await api.authenticate(values, false);
    assert.equal(loggedIn.uid, uid);
    assert.equal((await api.restoreSession(loggedIn)).uid, uid);
    assert.equal((await getDoc(doc(db, 'users', uid))).data().createdAt.toMillis(), profile.createdAt.toMillis());
    await signOut(auth);
  } finally {
    await terminate(db);
    await deleteApp(app);
  }
});
