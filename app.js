const express = require('express');
const cors = require('cors');
const app = express();

const { postPlayerController, loginPlayerController } = require('./controllers/controllers.js');
const {
	handleCustomErrors,
	handle500Errors,
	handleWrongPathErrors,
	handlePSQLError,
} = require('./controllers/errors.controlles.js');

app.use(cors());
app.use(express.json());

// app.patch('/users/:username', patchPlayer);
app.post('/api/users', postPlayerController);
app.post('/api/users/login', loginPlayerController);

app.all('/*', handleWrongPathErrors);
app.use(handlePSQLError);
app.use(handleCustomErrors);
app.use(handle500Errors);

module.exports = app;
