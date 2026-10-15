const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function load(path, dependencies = {}) {
  const code = ts.transpileModule(readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const context = { exports: {}, require: (name) => {
    assert.ok(name in dependencies, `Unexpected dependency: ${name}`);
    return dependencies[name];
  } };
  vm.runInNewContext(code, context, { filename: path });
  return context.exports;
}
const validation = load('utils/authValidation.ts');
const valid = { name: 'María José', surname: 'Pérez', email: ' huesped@example.com ', password: 'Descanso2026!', confirmation: 'Descanso2026!' };

test('accepts accented names, normalizes spaces, and trims email', () => {
  assert.equal(Object.keys(validation.validateAuth(valid, true)).length, 0);
  assert.equal(validation.normalizeName('  Mari\u0301a   José  '), 'María José');
  assert.equal(Object.keys(validation.validateAuth({ ...valid, name: 'Ana-María O’Neill' }, true)).length, 0);
});
test('rejects empty fields, malformed email, script names, controls, and oversized input', () => {
  assert.equal(Object.keys(validation.validateAuth({name:'', surname:'', email:'', password:'', confirmation:''}, true)).length, 5);
  for (const email of ['a@b', "' OR 1=1 --", 'a@-example.com', 'a@exam\nple.com', 'a'.repeat(255) + '@example.com'])
    assert.ok(validation.validateAuth({ ...valid, email }, true).email);
  for (const name of ['<script>alert(1)</script>', '1234', 'Ana\nPerez', 'A'.repeat(101)])
    assert.ok(validation.validateAuth({ ...valid, name }, true).name);
  for (const surname of ['', '<script>x</script>', '1234', 'A'.repeat(101)])
    assert.ok(validation.validateAuth({ ...valid, surname }, true).surname);
  for (const password of [' '.repeat(20), 'a'.repeat(129), 'Test\u0000Password123'])
    assert.ok(validation.validateAuth({ ...valid, password }, true).password);
});
test('requires registration strength and matching confirmation, but permits existing login passwords', () => {
  assert.ok(validation.validateAuth({ ...valid, password: 'Prueba123' }, true).password);
  assert.ok(validation.validateAuth({ ...valid, confirmation: 'Different123!' }, true).confirmation);
  assert.equal(Object.keys(validation.validateAuth({ ...valid, name:'', password:'old123', confirmation:'' }, false)).length, 0);
  // Punctuation is valid password data, never interpreted as query syntax.
  const password = "Safe' OR 1=1--2026";
  assert.equal(Object.keys(validation.validateAuth({ ...valid, password, confirmation: password }, true)).length, 0);
});

function service({ exists = false, failWrite = false, failLogin = false, active = true } = {}) {
  const calls = [];
  const user = { uid: 'user-123', email: 'huesped@example.com', displayName: 'María José' };
  const auth = { currentUser: null };
  const login = async (_, email, password) => {
    calls.push(['auth', email, password]);
    if (failLogin) throw { code: 'auth/invalid-credential' };
    auth.currentUser = user;
    return { user };
  };
  const api = load('services/auth.ts', {
    './firebase': { getFirebase: () => ({ auth, db: {} }) },
    '../utils/authValidation': validation,
    'firebase/auth': {
      createUserWithEmailAndPassword: login, signInWithEmailAndPassword: login,
      updateProfile: async (_, data) => { calls.push(['updateProfile', data]); },
      signOut: async () => { auth.currentUser = null; calls.push(['signOut']); },
    },
    'firebase/firestore': {
      doc: (_, collection, uid) => ({ collection, uid }),
      getDoc: async () => ({ exists: () => exists, data: () => ({ activo: active }) }),
      serverTimestamp: () => 'SERVER_TIMESTAMP',
      setDoc: async (ref, data) => {
        calls.push(['setDoc', ref, data]);
        if (failWrite) throw { code: 'permission-denied' };
      },
    },
  });
  return { api, calls, auth };
}
test('registers through Auth and stores only an owner profile with a fixed guest role', async () => {
  const { api, calls } = service();
  await api.authenticate(valid, true);
  assert.equal(calls[0][1], 'huesped@example.com');
  const [, ref, data] = calls.find(([action]) => action === 'setDoc');
  assert.equal(ref.uid, 'user-123');
  assert.equal(data.rol, 'huesped');
  assert.equal(data.activo, true);
  assert.equal(data.nombre, valid.name);
  assert.equal(data.apellido, valid.surname);
  assert.deepEqual(Object.keys(data).sort(), ['activo', 'apellido', 'createdAt', 'email', 'nombre', 'rol', 'uid']);
  assert.equal(JSON.stringify(data).includes(valid.password), false);
});
test('login leaves an existing profile unchanged and repairs a missing profile', async () => {
  const existing = service({ exists: true });
  await existing.api.authenticate(valid, false);
  assert.equal(existing.calls.some(([action]) => action === 'setDoc'), false);
  const missing = service();
  await missing.api.authenticate(valid, false);
  assert.equal(missing.calls.some(([action]) => action === 'setDoc'), true);
});
test('rejects invalid input before network requests', async () => {
  const { api, calls } = service();
  await assert.rejects(api.authenticate({ ...valid, email: 'invalid' }, true));
  assert.equal(calls.length, 0);
});
test('partial registration failure signs out and explains that the account already exists', async () => {
  const { api, calls, auth } = service({ failWrite: true });
  await assert.rejects(api.authenticate(valid, true), /app\/profile-incomplete/);
  assert.equal(auth.currentUser, null);
  assert.equal(calls.at(-1)[0], 'signOut');
});
test('does not reveal whether a login email exists or expose raw backend errors', () => {
  const { api } = service();
  const message = api.authErrorMessage({ code: 'auth/invalid-credential' });
  for (const code of ['auth/user-not-found', 'auth/wrong-password', 'auth/user-disabled'])
    assert.equal(api.authErrorMessage({ code }), message);
  assert.equal(api.authErrorMessage({ message: 'secret backend data' }).includes('secret'), false);
});

test('inactive profiles cannot sign in or restore a persisted session', async () => {
  const { api, auth } = service({ exists: true, active: false });
  await assert.rejects(api.authenticate(valid, false), /app\/account-inactive/);
  assert.equal(auth.currentUser, null);
  await assert.rejects(api.restoreSession({ uid: 'user-123', displayName: 'María José' }), /app\/account-inactive/);
  assert.equal(auth.currentUser, null);
});
