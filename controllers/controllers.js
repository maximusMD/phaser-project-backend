const {
  postPlayerModel,
  loginPlayerModel,
  patchPlayerModel,
  fetchAllUsers,
  fetchUser,
  fetchLeaderboard,
  postLeaderboardEntry,
  patchLeaderboardEntry,
  getSingleLeaderboardEntry,
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

exports.getAllUsersController = async (req, res, next) => {
  try {
    const result = await fetchAllUsers(req.body);
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};

exports.getUserController = async (req, res, next) => {
  const username = req.params.username;
  try {
    const result = await fetchUser(username);
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};
exports.getLeaderboardController = async (req, res, next) => {
  try {
    const result = await fetchLeaderboard(req);
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};

exports.postLeaderboardController = async (req, res, next) => {
  try {
    const result = await postLeaderboardEntry(req);
    res.status(201).send(result);
  } catch (err) {
    next(err);
  }
};
exports.patchLeaderboardController = async (req, res, next) => {
  try {
    const result = await patchLeaderboardEntry(req);
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    next(err);
  }
};
exports.getSinglePlayerLeaderController = async (req, res, next) => {
  try {
    const result = await getSingleLeaderboardEntry(req);
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    next(err);
  }
};
