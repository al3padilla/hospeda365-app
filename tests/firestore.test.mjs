import { before, after, test } from 'node:test';
import { readFileSync } from 'node:fs';
import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { collection, deleteDoc, doc, getDoc, getDocs, query, where, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';

let env;
before(async () => {
  env = await initializeTestEnvironment({
    projectId: 'demo-hospeda365',
    firestore: { host: '127.0.0.1', port: 8080, rules: readFileSync('firestore.rules', 'utf8') },
  });
});
after(async () => { await env?.cleanup(); });
const dbFor = (uid = 'alice') => env.authenticatedContext(uid, { email: `${uid}@example.com` }).firestore();
const profile = (uid = 'alice') => ({ uid, nombre: 'María', apellido: 'Pérez', email: `${uid}@example.com`, rol: 'huesped', activo: true, createdAt: serverTimestamp() });

test('owner can create and read their profile; guest cannot list profiles', async () => {
  const db = dbFor();
  await assertSucceeds(setDoc(doc(db, 'users/alice'), profile()));
  await assertSucceeds(getDoc(doc(db, 'users/alice')));
  await assertFails(getDocs(collection(db, 'users')));
});
test('anonymous users and other owners cannot read or write a profile', async () => {
  const anonymous = env.unauthenticatedContext().firestore();
  await assertFails(getDoc(doc(anonymous, 'users/alice')));
  await assertFails(setDoc(doc(anonymous, 'users/anon'), profile('anon')));
  await assertFails(getDoc(doc(dbFor('bob'), 'users/alice')));
  await assertFails(setDoc(doc(dbFor('bob'), 'users/alice'), profile()));
});
test('cannot promote a user, change immutable fields, or delete a profile', async () => {
  const db = dbFor();
  await assertFails(updateDoc(doc(db, 'users/alice'), { rol: 'admin' }));
  await assertFails(updateDoc(doc(db, 'users/alice'), { activo: false }));
  await assertFails(updateDoc(doc(db, 'users/alice'), { email: 'other@example.com' }));
  await assertFails(deleteDoc(doc(db, 'users/alice')));
});
test('server rejects forged roles, extra fields, wrong UID/email, unsafe names and timestamps', async () => {
  const invalid = [
    { rol: 'admin' }, { activo: false }, { password: 'NeverStoreThis123!' }, { uid: 'someone-else' },
    { email: 'someone@example.com' }, { nombre: '<script>test</script>' },
    { nombre: 'A'.repeat(101) }, { nombre: 'Ana\nPerez' }, { nombre: 'Ab' }, { apellido: '<script>x</script>' }, { createdAt: new Date(0) },
    { telefono: '<script>x</script>' }, { telefono: 71234567 }, { telefono: '7'.repeat(100) },
  ];
  for (const [index, changes] of invalid.entries()) {
    const uid = `invalid-${index}`;
    await assertFails(setDoc(doc(dbFor(uid), 'users', uid), { ...profile(uid), ...changes }));
  }
});
test('guests cannot list all reservations, forge owners, or write metrics', async () => {
  const db = dbFor();
  await assertFails(getDocs(collection(db, 'reservations')));
  await assertFails(setDoc(doc(db, 'reservations/one'), { userId: 'alice' }));
  await assertFails(setDoc(doc(db, 'metrics/one'), { total: 100 }));
});

test('web registration remains compatible with its five required fields', async () => {
  const { uid, createdAt, ...webProfile } = profile('web-user');
  await assertSucceeds(setDoc(doc(dbFor('web-user'), 'users/web-user'), webProfile));
});

test('guests may edit names but cannot inject fields or reactivate accounts', async () => {
  await assertSucceeds(updateDoc(doc(dbFor(), 'users/alice'), { nombre: 'Ana María' }));
  await assertFails(updateDoc(doc(dbFor(), 'users/alice'), { nombre: '<script>x</script>' }));
  await assertFails(updateDoc(doc(dbFor(), 'users/alice'), { isAdmin: true }));
  await assertSucceeds(updateDoc(doc(dbFor(), 'users/alice'), { telefono: '+503 7123 4567' }));
  await assertFails(updateDoc(doc(dbFor(), 'users/alice'), { telefono: '<script>x</script>' }));
  await env.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), 'users/inactive'), { ...profile('inactive'), activo: false });
    await setDoc(doc(context.firestore(), 'users/admin'), { ...profile('admin'), rol: 'admin' });
    await setDoc(doc(context.firestore(), 'users/reception'), { ...profile('reception'), rol: 'recepcionista' });
  });
  await assertFails(updateDoc(doc(dbFor('inactive'), 'users/inactive'), { activo: true }));
  await assertFails(updateDoc(doc(dbFor('inactive'), 'users/inactive'), { nombre: 'Otro Nombre' }));
});

test('authorized web staff retain profile management and room permissions', async () => {
  await assertSucceeds(getDocs(collection(dbFor('admin'), 'users')));
  await assertSucceeds(getDocs(collection(dbFor('reception'), 'users')));
  await assertSucceeds(updateDoc(doc(dbFor('admin'), 'users/inactive'), { activo: true }));
  const room = { numero: '101', tipo: 'estandar', precioNoche: 75, capacidad: 2, estado: 'disponible' };
  await assertSucceeds(setDoc(doc(dbFor('admin'), 'rooms/room-one'), room));
  await assertSucceeds(updateDoc(doc(dbFor('reception'), 'rooms/room-one'), { estado: 'limpieza' }));
  await assertFails(updateDoc(doc(dbFor('reception'), 'rooms/room-one'), { precioNoche: 1 }));
  await assertFails(setDoc(doc(dbFor(), 'rooms/room-guest'), room));
});

test('reservation and payment ownership rules remain usable for guests', async () => {
  const db = dbFor();
  const reservation = { usuarioId: 'alice', estado: 'pendiente', estadoPago: 'sin_comprobante', fechaEntrada: new Date('2030-01-01'), fechaSalida: new Date('2030-01-02'), numeroHuespedes: 1, total: 75 };
  await assertSucceeds(setDoc(doc(db, 'reservations/own'), reservation));
  await assertSucceeds(getDocs(query(collection(db, 'reservations'), where('usuarioId', '==', 'alice'))));
  await assertFails(getDoc(doc(dbFor('bob'), 'reservations/own')));
  await assertFails(setDoc(doc(db, 'reservations/forged'), { ...reservation, usuarioId: 'bob' }));
  await assertSucceeds(setDoc(doc(db, 'payments/own'), { usuarioId: 'alice', estado: 'en_revision', monto: 75 }));
  await assertFails(updateDoc(doc(db, 'payments/own'), { estado: 'aprobado' }));
  await assertSucceeds(updateDoc(doc(dbFor('reception'), 'payments/own'), { estado: 'aprobado' }));
});
