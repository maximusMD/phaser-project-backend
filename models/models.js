const { connectToDB, closeDBConnection } = require("../connection.js");
const {
  generateSaltedPassword,
  comparePasswords,
} = require("../utils/hash_utils.js");

exports.loginPlayerModel = async (body) => {
  if (body.hasOwnProperty("username") && body.hasOwnProperty("password")) {
    const { client, db } = await connectToDB();
    const collection = db.collection("users");

    const data = await collection
      .find({ "user.username": body.username })
      .toArray();
    if (!data.length) {
      closeDBConnection(client);
      return { code: 404, message: "Bad login" };
    }
    const checkPassword = await comparePasswords(
      body.password,
      data[0].user.password
    );
    if (checkPassword) {
      closeDBConnection(client);
      return { user: data };
    } else {
      return { code: 404, message: "Bad login<<<" };
    }
  }
};

exports.postPlayerModel = async (body) => {
  if (body.hasOwnProperty("username") && body.hasOwnProperty("password")) {
    const { client, db } = await connectToDB();

    const collection = db.collection("users");
    const data = await collection
      .find({ "user.username": body.username })
      .toArray();

    //check if user already exists
    if (data.length > 0 && data[0].user.username === body.username) {
      closeDBConnection(client);
      return { status: 400, message: "Bad request" };
    } else {
      const saltedPassword = await generateSaltedPassword(body.password);
      const user = { ...body };
      user.password = saltedPassword;
      await db.collection("users").insertOne({ user });
      closeDBConnection(client);
      return { user };
    }
  } else {
    closeDBConnection(client);
    return { status: 400, message: "Bad request" };
  }
};

exports.patchPlayerModel = async (req) => {
  const itemToUpdate = req.body;
  const { username } = req.params;
  if (username) {
    const { client, db } = await connectToDB();
    const collection = db.collection("users");
    const userData = await collection
      .find({ "user.username": username })
      .toArray();
    if (userData.length > 0 && userData[0].user.username === username) {
      const updateQuery = {};
      updateQuery[`user.${Object.keys(itemToUpdate)[0]}`] =
        Object.values(itemToUpdate)[0];
      const data = await collection.updateOne(
        { "user.username": username },
        { $set: updateQuery }
      );
      closeDBConnection(client);
      return userData[0].user;
    } else {
      closeDBConnection(client);
      return { status: 404, message: "User not found" };
    }
  } else {
    return { status: 400, message: "Bad request" };
  }
};

exports.fetchAllUsers = async () => {
  const { client, db } = await connectToDB();
  const collection = db.collection("users");
  const data = await collection.find({}).toArray();
  closeDBConnection(client);
  if (data.length === 0) {
    return { code: 404, message: "No users found" };
  }

  return { users: data };
};
exports.fetchUser = async (username) => {
  const { client, db } = await connectToDB();
  const collection = db.collection("users");
  const data = await collection.find({ "user.username": username }).toArray();
  closeDBConnection(client);
  if (data.length === 0) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  } else {
    return data[0];
  }
};

exports.fetchLeaderboard = async () => {
  const { client, db } = await connectToDB();
  const collection = db.collection("leaderboard");
  const data = await collection
    .find(
      {},
      {
        projection: {
          user_id: 1,
          username: 1,
          highScore: 1,
          avatar: 1,
        },
      }
    )
    .sort({ highScore: -1 })
    .limit(10)
    .toArray();
  closeDBConnection(client);
  return data;
};

exports.postLeaderboardEntry = async (req) => {
  const auth = JSON.parse(req.headers.authorization.split("Bearer ")[1]);
  const login = auth.user.username;
  const id = auth._id;

  const user = await this.fetchUser(login);

  if (!(user.user.password === auth.user.password)) {
    return { status: 401, message: "Unauthorized" };
  }

  const leaderboardEntry = {
    user_id: id,
    avatar: "avatar.jpeg",
    username: user.user.username,
    highScore: req.body.highScore,
    date: new Date(),
    totalHighScore: user.user.highScore,
    level: "current level",
  };
  const { client, db } = await connectToDB();
  const collection = db.collection("leaderboard");

  const result = await collection.insertOne(leaderboardEntry);

  closeDBConnection(client);

  return { status: 201, message: "entry created" };
};
exports.patchLeaderboardEntry = async (req) => {
  const auth = JSON.parse(req.headers.authorization.split("Bearer ")[1]);
  const login = auth.user.username;
  const id = auth._id;

  const user = await this.fetchUser(login);

  if (!(user.user.password === auth.user.password)) {
    return { status: 401, message: "Unauthorized" };
  }

  const { client, db } = await connectToDB();
  const collection = db.collection("leaderboard");

  const username = user.user.username;
  const highScore = req.body.highScore;
  const result = await collection.updateOne(
    { username },
    {
      $set: {
        highScore,
        date: new Date(),
        totalHighScore: user.user.highScore,
      },
    }
  );
  closeDBConnection(client);

  return { status: 200, message: "entry updated" };
};
exports.getSingleLeaderboardEntry = async (req) => {
  const { client, db } = await connectToDB();
  const collection = db.collection("leaderboard");
  const data = await collection
    .find(req.params, {
      projection: {
        user_id: 1,
        username: 1,
        highScore: 1,
        avatar: 1,
      },
    })
    .sort({ highScore: -1 })
    .limit(10)
    .toArray();
  closeDBConnection(client);
  console.log(data);
  return data;
};
