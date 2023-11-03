import express from 'express';
import { getPlayer, patchPlayer, postPlayer } from './controllers.js';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.get("/users/:username", getPlayer)
app.patch("/users/:username", patchPlayer)
app.post("/users/", postPlayer)

app.use((err, req, res, next) => {
    if (err.code === 404) {
        res.status(404).send({ Error: "Not found" })
    } else {
        next(err);
    }
})

app.use((err, req, res, next) => {
    if (err.code === 400) {
        res.status(400).send({ Error: "Bad request" })
    }
})

app.use((err, req, res, next) => {
    res.status(500).send({Error: "Internal error"})
})

export default app; 