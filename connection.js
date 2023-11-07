const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://yasar:AbsHKKK04FGr8Sp2@wavy-project-gang.bomehnb.mongodb.net/?retryWrites=true&w=majority";
const dbName = "dungeon_crawler";

async function connectToDB() {
  try {
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
    //console.log('Connection to the database is closed');
  } catch (err) {
    console.error("Error occurred while closing the database connection", err);
  }
}

module.exports = { connectToDB, closeDBConnection };
