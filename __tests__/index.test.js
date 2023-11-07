const app = require('../app.js');
const request = require('supertest');
const { connectToDB, closeDBConnection } = require('../connection.js');

let client, db;

beforeAll(async () => {
	const connection = await connectToDB();
	client = connection.client;
	db = connection.db;
	await db.collection('users').drop();
});

afterAll(async () => {
	await closeDBConnection(client);
});

describe('/api/users', () => {
	test('POST:201 post a new user and send it back to the client', async () => {
		const user = {
			avatar: 'user.jpg',
			username: 'user123',
			password: 'pass123',
			highScore: 123,
			other_default_props: ['weapon1, weapon2'],
		};
		const response = await request(app).post('/api/users').send(user);
		expect(response.status).toBe(201);
		expect(response.body.user.avatar).toBe('user.jpg');
		expect(response.body.user.username).toBe('user123');
		expect(response.body.user.highScore).toBe(123);
		expect(response.body.user.other_default_props).toEqual(['weapon1, weapon2']);
	});

	test('GET:400 sends an appropriate status and error message if user already exists', async () => {
		const user = {
			username: 'user123',
			password: 'pass123',
		};
		const response = await request(app).post('/api/users').send(user);
		expect(response.body.status).toBe(400);
		expect(response.body.message).toBe('Bad request');
	});

	test('GET:200 when checking user details in login form', async () => {
		const user = {
			username: 'user123',
			password: 'pass123',
		};
		const response = await request(app).post('/api/users/login').send(user);
		expect(response.status).toBe(200);
		expect(response.body.user[0].user).toMatchObject({
			username: expect.any(String),
			password: expect.any(String),
		});
	});
});
