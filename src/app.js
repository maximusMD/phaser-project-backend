import express from 'express';
import { getPlayer, patchPlayer, postPlayer } from './mongo_functions.js';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.get("/users/:username", getPlayer)
app.patch("/users/:username", patchPlayer)
app.post("/users/", postPlayer)

app.use((err, req, res, next) => {
    console.log(err);
    res.status(404).send({err})
})

export default app; 