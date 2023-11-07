const {
  postPlayerModel,
  loginPlayerModel,
  patchPlayerModel,
} = require("../models/models");

exports.loginPlayerController = async (req, res, next) => {
  try {
    const result = await loginPlayerModel(req.body);
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};

exports.pathHighscoreController = async (req, res, next) => {
  try {
    const result = await patchPlayerModel(req);
    res.status(200).send({ message: "user updated" });
  } catch (err) {
    next(err);
  }
};

exports.postPlayerController = async (req, res, next) => {
  try {
    const result = await postPlayerModel(req.body);
    res.status(201).send(result);
  } catch (err) {
    next(err);
  }
};
