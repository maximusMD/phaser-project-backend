const { MongoClient } = require('mongodb');

const uri =
	'mongodb+srv://yasar:AbsHKKK04FGr8Sp2@wavy-project-gang.bomehnb.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'dungeon_crawler';

async function connectToDB() {
	try {
		const client = new MongoClient(uri);

		await client.connect();
		console.log('Connected to the database');

		const db = client.db(dbName);

		return { client, db };
	} catch (err) {
		console.error('Error occurred while connecting to the database', err);
	}
}

async function closeDBConnection(client) {
	try {
		await client.close();
		console.log('Connection to the database is closed');
	} catch (err) {
		console.error('Error occurred while closing the database connection', err);
	}
}

module.exports = { connectToDB, closeDBConnection };



// const { connectToDB, closeDBConnection } = require('../connection.js');
// const { generateSaltedPassword, comparePasswords } = require('../utils/hash_utils.js');

// exports.getPlayerModel = async (username, password) => {
// 	const usernameeesss = username;
// 	console.log(username, password, 'model');
// 	const { client, db } = await connectToDB();
// 	const data = await db.collection('users').find({ user: user.username }).toArray();
//     console.log(data[0], 'model username');

// 	if (!data[0].user.username) return { code: 404, message: 'Invalid username' };
// 	console.log(data[0].user.password);
// 	const checkPassword = await comparePasswords(data[0].user.password, password);
// 	closeDBConnection(client);
// 	if (checkPassword) {
// 		return { user: data };
// 	} else {
// 		return { code: 404, message: 'Invalid password' };
// 	}
// };

// // export async function patchPlayerModel() {
// //     console.log("in model patchplayer")

// // }
// // export async function postPlayerModel(body) {
// //     if (body.hasOwnProperty("username") && body.hasOwnProperty("password")) {
// //         const saltedPassword = await generateSaltedPassword(body.password);
// //         const newUserObj = { ...body }
// //         newUserObj.password = saltedPassword;
// //         newUserObj.experience = 0;
// //         newUserObj.other_default_props = [];

// //         await mongoClient.connect();
// //         const db = mongoClient.db('game_practise');
// //         const collection = db.collection('players');
// //         await collection.insertOne(newUserObj)

// //         return { New_User: newUserObj }

// //     } else {
// //         throw ({ code: 400 })
// //     }
// // }

// exports.postPlayerModel = async (body) => {
// 	if (body.hasOwnProperty('username') && body.hasOwnProperty('password')) {
// 		const saltedPassword = await generateSaltedPassword(body.password);
// 		const user = { ...body };
// 		user.password = saltedPassword;
// 		const { client, db } = await connectToDB();
// 		await db.collection('users').insertOne({ user });
// 		closeDBConnection(client);
// 		return { user };
// 	} else {
// 		return { status: 400, message: 'Bad request' };
// 	}
// };
