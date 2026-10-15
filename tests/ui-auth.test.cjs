const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function load(path, deps = {}) {
  const code = ts.transpileModule(fs.readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const exports = {};
  vm.compileFunction(code, ['exports', 'require'], { filename: path })(exports, (name) => {
    assert.ok(name in deps, `Unexpected dependency ${name}`);
    return deps[name];
  });
  return exports;
}
const core = load('utils/authValidation.ts');
const ui = load('validacion/auth.ts', { '../utils/authValidation': core });
const reducer = load('contexto/authReducer.ts');
const values = { nombre: 'María', apellido: 'Pérez', telefono: '+503 7123 4567', email: 'maria@example.com', password: 'Descanso2026!', confirmPassword: 'Descanso2026!' };

test('new UI registration uses the same strong validation as Firebase service', () => {
  assert.equal(Object.keys(ui.validarRegistro(values)).length, 0);
  assert.ok(ui.validarRegistro({ ...values, password: 'Prueba123', confirmPassword: 'Prueba123' }).password);
  assert.ok(ui.validarRegistro({ ...values, nombre: '<script>x</script>' }).nombre);
  assert.ok(ui.validarRegistro({ ...values, apellido: 'Pérez\nAdmin' }).apellido);
  assert.ok(ui.validarRegistro({ ...values, telefono: "' OR 1=1--" }).telefono);
  assert.ok(ui.validarRegistro({ ...values, confirmPassword: 'Other1234567' }).confirmPassword);
});
test('login supports older Firebase passwords and rejects oversized or malformed input', () => {
  assert.equal(Object.keys(ui.validarLogin({ email: values.email, password: 'old123' })).length, 0);
  assert.ok(ui.validarLogin({ email: 'x'.repeat(255) + '@example.com', password: 'old123' }).email);
  assert.ok(ui.validarLogin({ email: values.email, password: 'a'.repeat(129) }).password);
});
test('session stays authenticated during logout/profile work and failed operations', () => {
  const session = { usuario: { nombre: 'María', apellido: 'Pérez' }, token: 'test-token', expiraEn: '2030-01-01' };
  const signedIn = reducer.authReducer(reducer.estadoInicial, { type: 'AUTENTICACION_EXITOSA', payload: session });
  const working = reducer.authReducer(signedIn, { type: 'OPERACION_INICIADA' });
  assert.equal(reducer.estaAutenticado(working), true);
  const failure = reducer.authReducer(working, { type: 'OPERACION_FALLIDA', payload: { codigo: 'error_red', mensaje: 'Error' } });
  assert.equal(reducer.estaAutenticado(failure), true);
  const signedOut = reducer.authReducer(failure, { type: 'SESION_CERRADA' });
  assert.equal(reducer.estaAutenticado(signedOut), false);
  assert.equal(signedOut.token, null);
});
