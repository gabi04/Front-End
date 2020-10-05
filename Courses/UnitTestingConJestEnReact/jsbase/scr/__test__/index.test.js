const randomString = require('../index');

describe('Probar funcionalidades de randomString', () => {
  test("La función randomString al ejecutarse retorna un string", () => {
    expect(typeof (randomString())).toBe('string');
  })
  test("Comprobar que no existe una ciudad", () => {
    expect(randomString()).not.toMatch(/Cordoba/);
  })
})