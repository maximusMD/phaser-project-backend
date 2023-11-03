import { MongoClient } from "mongodb";

const uri = 'mongodb+srv://rymeisterm:GG1ghPmkjCz7WMPJ@mongo-practise.fle2j2q.mongodb.net/?retryWrites=true&w=majority';

export const mongoClient = new MongoClient(uri);
