const app = require('../app.js');
const request = require('supertest');

describe('/api/users', () => {
	test('POST:201 post a new user and send it back to the client', () => {
		const user = {
			username: 'user123',
			password: 'pass123',
		};
		return request(app)
			.post('/api/users')
			.send(user)
			.expect(201)
			.then(({ body }) => {
				expect(body.user).toMatchObject({
					username: 'user123',
					password: 'pass123',
				});
			});
	});
});
