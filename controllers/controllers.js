const { postPlayerModel, loginPlayerModel } = require('../models/models');

exports.loginPlayerController = async (req, res, next) => {
	try {
		const result = await loginPlayerModel(req.body);
		res.status(200).send(result);
	} catch (err) {
		next(err);
	}
};

// export async function patchPlayer(req, res, next) {
//     try {
//         await patchPlayerModel();
//         res.status(200).send({ Message: "in patch player controller" })
//     } catch (err) {
//         next(err);
//     }
// }

exports.postPlayerController = async (req, res, next) => {
	try {
		const result = await postPlayerModel(req.body);
		res.status(201).send(result);
	} catch (err) {
		next(err);
	}
};
