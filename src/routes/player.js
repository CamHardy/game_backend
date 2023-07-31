// player.js

// IDs of quests completed
// IDs of dungeons completed

import Express from 'express';
import db from '../utils/surrealdb.js';

const player = Express.Router();

// player.get('/:id/quests', (req, res) => {
//     // look up completed quests and return object
// });

// player.get('/:id/dungeons', (req, res) => {
//     // look up completed dungeons and return object
// });

player.get('/:id', async (req, res) => {
    // look up dungeon by ID and return object
    res.send(await db.select(`player:${req.params.id}`));
});

player.post('/create', async (req, res) => {
    res.send(await db.create(`player:${req.body.name}`, {
        name: req.body.name,
        quests: [],
        dungeons: []
    }));
});

export default player