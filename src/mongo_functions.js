import { config } from "dotenv";
import { MongoClient } from "mongodb";
import { generateSaltedPassword, comparePasswords } from "./hash_utils.js";

// config();
// console.log(process.env.DB_URI);

var uri = 'mongodb+srv://rymeisterm:GG1ghPmkjCz7WMPJ@mongo-practise.fle2j2q.mongodb.net/?retryWrites=true&w=majority';

export async function connectToCluster() {
    let mongoClient;
    try {
        mongoClient = new MongoClient(uri);
        console.log('Connecting to MongoDB Atlas cluster...');
        await mongoClient.connect();
        console.log('Successfully connected to MongoDB Atlas!');
        return mongoClient;
    } catch (error) {
        console.error('Connection to MongoDB Atlas failed!', error);
        process.exit();
    }
}

export async function getCollection() {
    let mongoClient;
    try {
        mongoClient = await connectToCluster();
        const db = mongoClient.db('game_practise')
        return db.collection('players');
    } catch (err) {
        console.log(err);
    }
}

export async function postPlayer(req, res, next) {
    try {
        if (req.body.hasOwnProperty("username") && req.body.hasOwnProperty("password")) {
            const saltedPassword = await generateSaltedPassword(req.body.password);
            const newObj = { ...req.body }
            newObj.password = saltedPassword;
            newObj.experience = 0;
            newObj.other_default_props = [];
            await connectToCluster();
            const collection = await getCollection();
            await collection.insertOne(newObj)
            res.status(201).send({User: newObj})
        } else {
            throw (400);
        }
        // await collection.insertOne(playerTest);
    } catch (err) {
        res.status(400).send({ Error: "Bad request" })
    }
}

export async function getPlayer(req, res, next) {
    try {
        await connectToCluster();
        const collection = await getCollection();
        const data = await collection.find({ username: req.params.username }).toArray();
        const checkPassword = await comparePasswords(req.body.password, data[0].password)
        if (checkPassword) {
            res.status(200).send({User: data});
        } else {
            throw(400);
        }
    } catch (err) {
        res.status(400).send({ Error: "Bad login" })
    }
}

export async function patchPlayer(req, res, next) {
    res.status(200).send({ Message: "patching" + req.params.username })
}