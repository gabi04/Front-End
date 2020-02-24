const text = "Hola Mundo";
const fruits = ["manzana", "melon", "banana"];

test("Debe contener un texto", () => {
	expect(text).toMatch(/Mundo/);
});

test("¿Tenemos una banana?", () => {
	expect(fruits).toContain("banana");
});

test("¿Es mayor que?", () => {
	expect(10).toBeGreaterThan(9);
});

test("Verdadero", () => {
	expect(true).toBeTruthy();
});

const reverseString = (str, cb) => {
	cb(
		str
			.split("")
			.reverse()
			.join("")
	);
};

test("Probar un callback", () => {
	reverseString("Hola", str => {
		expect(str).toBe("aloH");
	});
});

const reverseString2 = str => {
	return new Promise((resolve, reject) => {
		if (!str) {
			reject(Error("Error"));
		}
		resolve(
			str
				.split("")
				.reverse()
				.join("")
		);
	});
};

test("Probar un promesa", () => {
	return reverseString2("Hola").then(str => {
		expect(str).toBe("aloH");
	});
});

test("Probar async/await", async () => {
	const str = await reverseString2("hola");
	expect(str).toBe("aloh");
});

/* 
afterEach(() => console.log("Despues de cada prueba"));
afterAll(() => console.log("Despues de todas las pruebas"));

beforeEach(() => console.log("Antes de cada prueba"));
beforeAll(() => console.log("Antes de todas las pruebas"));
*/
