import { MongoClient } from "mongodb";

export async function connectToCluster() {
    let mongoClient;
    const uri = 'mongodb+srv://rymeisterm:GG1ghPmkjCz7WMPJ@mongo-practise.fle2j2q.mongodb.net/?retryWrites=true&w=majority';
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