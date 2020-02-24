const cities = [
	"Ciudad de México",
	"Bogotá",
	"Lima",
	"Buenos Aires",
	"Guadalajara"
];
const randomString = () => {
	const string = cities[Math.floor(Math.random() * cities.length)];
	return string;
};

module.exports = randomString;
