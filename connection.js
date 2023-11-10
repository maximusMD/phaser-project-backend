require("dotenv").config({ path: `${__dirname}/.env.${process.env.NODE_ENV}` });
const { MongoClient } = require("mongodb");

const getMongoURI = () => {
  switch (process.env.NODE_ENV) {
    case "production":
      return process.env.MONGO_URI_PROD || "";
    case "test":
      return process.env.MONGO_URI_TEST || "";
    default:
      return process.env.MONGO_URI_DEV || "";
  }
};

const getDBName = () => {
  switch (process.env.NODE_ENV) {
    case "production":
      return process.env.DB_NAME_PROD || "";
    case "test":
      return process.env.DB_NAME_TEST || "";
    default:
      return process.env.DB_NAME_DEV || "";
  }
};

async function connectToDB() {
  const uri = getMongoURI();
  const dbName = getDBName();
  try {
    if (!uri || !dbName) {
      throw new Error("URI or DB name is not defined");
    }

    const client = new MongoClient(uri);
    await client.connect();
    console.log("Connected to the database");

    const db = client.db(dbName);

    return { client, db };
  } catch (err) {
    console.error("Error occurred while connecting to the database", err);
  }
}

async function closeDBConnection(client) {
  try {
    await client.close();
    console.log("Connection to the database is closed");
  } catch (err) {
    console.error("Error occurred while closing the database connection", err);
  }
}

module.exports = { connectToDB, closeDBConnection };
