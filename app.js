const express = require("express");
const cors = require("cors");
const app = express();

const {
  postPlayerController,
  loginPlayerController,
  pathHighscoreController,
  getAllUsersController,
  getUserController,
  getLeaderboardController,
} = require("./controllers/controllers.js");
const {
  handleCustomErrors,
  handle500Errors,
  handleWrongPathErrors,
  handlePSQLError,
} = require("./controllers/errors.controlles.js");

app.use(cors());
app.use(express.json());

app.get("/api/users/", getAllUsersController);
app.post("/api/users", postPlayerController);
app.post("/api/users/login", loginPlayerController);
app.patch("/api/users/:username", pathHighscoreController);
app.get("/api/users/:username", getUserController);
app.get("/api/leaderboard", getLeaderboardController);

app.all("/*", handleWrongPathErrors);
app.use(handlePSQLError);
app.use(handleCustomErrors);
app.use(handle500Errors);

module.exports = app;
