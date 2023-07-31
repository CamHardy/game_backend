// dungeon.js

// dungeon name
// seed
// total times completed

// future:
// dungeon level?
// environment type?
// etc?

// API endpoints
// fetch dungeon by ID (return name, seed and total completed)
// create dungeon (restrict use to admins
// copmlete dungeon (add one to dungeon total times completed, add dungeon id to player dungeons completed)

import Express from 'express';
import db from '../utils/surrealdb.js';

const dungeon = Express.Router();

dungeon.get('/', async (req, res) => {
    // look up all dungeons and return object
    res.send(await db.select('dungeon'));
});

dungeon.get('/:id', async (req, res) => {
    // look up dungeon by ID and return object
    res.send(await db.select(`dungeon:${req.params.id}`));
});

dungeon.post('/create', async (req, res) => {
    res.send(await db.create(`dungeon:${req.body.name}`, {
        name: req.body.name
    }));
});

export default dungeon;