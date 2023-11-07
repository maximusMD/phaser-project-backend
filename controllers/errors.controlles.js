exports.handleCustomErrors = (err, req, res, next) => {
	if (err.status) {
		res.status(err.status).send({ message: err.message });
	} else {
		next(err);
	}
};

exports.handleWrongPathErrors = (req, res, next) => {
	res.status(404).send({ message: 'Wrong Path!' });
};

exports.handle500Errors = (err, req, res, next) => {
	res.status(500).send({ message: 'Internal Server Error' });
};

exports.handlePSQLError = (err, req, res, next) => {
	if (err.code === '22P02') {
		res.status(400).send({ message: 'Bad Request' });
	}
	next(err);
};
