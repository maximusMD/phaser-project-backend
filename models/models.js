const { connectToDB, closeDBConnection } = require('../connection.js');
const { generateSaltedPassword, comparePasswords } = require('../utils/hash_utils.js');

exports.loginPlayerModel = async (body) => {
	if (body.hasOwnProperty('username') && body.hasOwnProperty('password')) {
		const { client, db } = await connectToDB();
		const collection = db.collection('users');

		const data = await collection.find({ 'user.username': body.username }).toArray();

		if (!data.length) {
			closeDBConnection(client);
			return { code: 404, message: 'Bad login' };
		}

		const checkPassword = await comparePasswords(body.password, data[0].user.password);

		if (checkPassword) {
			closeDBConnection(client);
			return { user: data };
		} else {
			return { code: 404, message: 'Bad login' };
		}
	}
};

exports.postPlayerModel = async (body) => {
	if (body.hasOwnProperty('username') && body.hasOwnProperty('password')) {
		const { client, db } = await connectToDB();

		const collection = db.collection('users');
		const data = await collection.find({ 'user.username': body.username }).toArray();

		//check if user already exists
		if (data.length > 0 && data[0].user.username === body.username) {
			return { status: 400, message: 'Bad request' };
		} else {
			const saltedPassword = await generateSaltedPassword(body.password);
			const user = { ...body };
			user.password = saltedPassword;

			await db.collection('users').insertOne({ user });
			closeDBConnection(client);
			return { user };
		}
	} else {
		return { status: 400, message: 'Bad request' };
	}
};
