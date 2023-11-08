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
      return { code: 404, message: "Bad login" };
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
exports.fetchUser = async (req) => {
  const { client, db } = await connectToDB();
  const collection = db.collection("users");
  const data = await collection
    .find({ "user.username": req.params.username })
    .toArray();
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
  const collection = db.collection("users");
  const data = await collection
    .find(
      {},
      {
        projection: {
          "user.username": 1,
          "user.highScore": 1,
          "user.avatar": 1,
        },
      }
    )
    .sort({ "user.highScore": -1 })
    .limit(10)
    .toArray();
  closeDBConnection(client);
  return data;
};
