const express = require('express');
const cors = require('cors');
const app = express();

const { postPlayerController, getPlayerController } = require('./controllers/controllers.js');

app.use(cors());
app.use(express.json());

// app.get('/api/users/:username', getPlayerController);
// app.patch('/users/:username', patchPlayer);
app.post('/api/users', postPlayerController);
// app.get('/api/users/:username', getPlayerController);

app.use((err, req, res, next) => {
	if (err.code === 404) {
		res.status(404).send({ Error: err.message ?? 'Not found' });
	} else {
		next(err);
	}
});

app.use((err, req, res, next) => {
	if (err.code === 400) {
		res.status(400).send({ Error: err.message ?? 'Bad request' });
	} else {
		next(err);
	}
});

app.use((err, req, res, next) => {
	res.status(500).send({ Error: 'Internal error' });
});

module.exports = app;
