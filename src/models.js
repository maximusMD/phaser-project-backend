import { mongoClient } from "./connection.js";
import { generateSaltedPassword, comparePasswords } from "./hash_utils.js";


export async function getPlayerModel(req) {
    await mongoClient.connect();
    const db = mongoClient.db('game_practise');
    const collection = db.collection('players');

    const data = await collection.find({ username: req.params.username }).toArray();
    
    const checkPassword = await comparePasswords(req.body.password, data[0].password)
    if (checkPassword) {
        return ({User: data})
    } else {
        throw ({code: 404});
    }

}

export async function patchPlayerModel() {
    console.log("in model patchplayer")

}
export async function postPlayerModel(body) {
    if (body.hasOwnProperty("username") && body.hasOwnProperty("password")) {
        const saltedPassword = await generateSaltedPassword(body.password);
        const newUserObj = { ...body }
        newUserObj.password = saltedPassword;
        newUserObj.experience = 0;
        newUserObj.other_default_props = [];

        await mongoClient.connect();
        const db = mongoClient.db('game_practise');
        const collection = db.collection('players');
        await collection.insertOne(newUserObj)

        return { New_User: newUserObj }

    } else {
        throw ({ code: 400 })
    }
}