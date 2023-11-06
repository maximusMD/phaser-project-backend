const { connectToDB, closeDBConnection } = require('../connection.js');
const { generateSaltedPassword, comparePasswords } = require('../utils/hash_utils.js');

// exports.getPlayerModel = async (req) => {
// 	console.log(req.params.username);
// 	if (!req.body.hasOwnProperty('password')) return { code: 400 };
// 	const { client, db } = await connectToDB();
// 	const collection = db.collection('users');
// 	const data = await collection.find({ username: req.param.username }).toArray();

// 	if (!data.length) return { code: 404, message: 'Bad login' };

// 	const checkPassword = await comparePasswords(req.body.password, data[0]?.password);

// 	if (checkPassword) {
// 		closeDBConnection(client);
// 		return { User: data };
// 	} else {
// 		return { code: 404, message: 'Bad login' };
// 	}
// };

exports.postPlayerModel = async (body) => {
	if (body.hasOwnProperty('username') && body.hasOwnProperty('password')) {
		const saltedPassword = await generateSaltedPassword(body.password);
		const user = { ...body };
		user.password = saltedPassword;
		const { client, db } = await connectToDB();
		await db.collection('users').insertOne({ user });
		closeDBConnection(client);
		return { user };
	} else {
		return { status: 400, message: 'Bad request' };
	}
};
