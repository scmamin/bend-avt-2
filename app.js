const http = require('http');
const os = require("os");
const userInfo = os.userInfo();
const uid = userInfo.uid;
const name = userInfo.username;
const hostname = '0.0.0.0';
const port = 3030;
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://127.0.0.1:27017/";
const mongoClient = new MongoClient(url);

let count = 0; // объявляем count глобально

async function run() {
	try {
		await mongoClient.connect();
		const db = mongoClient.db(`test1`);
		const result = await db.command({ ping: 1 });
		console.log("Подключение с сервером успешно установлено");

		const collection = db.collection("users");
		count = await collection.countDocuments();
		console.log(`В коллекции users ${count} документа/ов`);
		console.log(result);
	} catch (err) {
		console.log("Возникла ошибка");
		console.log(err);
	} finally {
		await mongoClient.close();
		console.log("Подключение закрыто");
	}
}

// Запускаем асинхронную функцию
run().catch(console.error);

const server = http.createServer((req, res) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
	res.end(`Hello ${name}, you have ${count} documents`);
});

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});
F