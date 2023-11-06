const app = require('../app.js');
const request = require('supertest');

describe('/api/users', () => {
	test('POST:201 post a new user and send it back to the client', async () => {
		const user = {
			avatar: 'user.jpg',
			username: 'user123',
			password: 'pass123',
			highScore: 123,
			other_default_props: ['weapon1, weapon2'],
		};
		const { body } = await request(app).post('/api/users').send(user).expect(201);
		expect(body.user.avatar).toBe('user.jpg');
		expect(body.user.username).toBe('user123');
		expect(body.user.highScore).toBe(123);
		expect(body.user.other_default_props).toEqual(['weapon1, weapon2']);
	});

	// test.only('GET:200 get a user details to login', async () => {
	// 	const { body } = await request(app).get(`/api/users/user1234`).expect(200);
	// 	console.log(body, 'test');
	// });
});
