const { TestScheduler } = require("jest");

const text = "Hola mundo";
const fruits = ['manzana', 'melon', 'banana'];

test("String 'text' hace match con patron 'mundo'", ()=>{
  expect(text).toMatch(/mundo/);
});

test("Arreglo 'fruits' contiene valor 'banana'", () => {
  expect(fruits).toContain('banana');
});

test("10 es mayor que 9", () => {
  expect(10).toBeGreaterThan(9);
});

test("Verdadero es verdadero", () => {
  expect(true).toBeTruthy();
});

const reverseString = (str, callback) => {
  callback(str.split("").reverse().join(""))
};

test("Probar un Callback", () => {
  reverseString('Hola', (str) => {
    expect(str).toBe('aloH');
  });
});

const reverseString2 = str => {
  return new Promise((resolve, reject) => {
    if (!str) {
      reject(Error("Error"));
    }
    resolve(str.split("").reverse().join(""));
  });
};

test("Probar una promesa", () => {
  return reverseString2("hola")
    .then(string => {
      expect(string).toBe("aloh");
    });
});

test("Probar async/await", async () => {
  const string = await reverseString2("hola");
  expect(string).toBe("aloh")
})

/*
afterEach( () => console.log('Despues de cada prueba') );

afterAll( () => console.log('Despues de todas las pruebas') );

beforeEach( () => console.log('antes de cada prueba') );

beforeAll( () => console.log('antes de todas las pruebas') );
*/
