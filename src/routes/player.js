// player.js

// IDs of quests completed
// IDs of dungeons completed

import Express from 'express';
//import db from '../utils/surrealdb.js';
import db from '../utils/postgres.js';

const player = Express.Router();

//player.get('/:id/quests', (req, res) => {
//    // look up completed quests and return object
//});

//player.get('/:id/dungeons', (req, res) => {
//    // look up completed dungeons and return object
//});

player.get('/', async (req, res) => {
    res.send(await db.models.Player.findAll());
});

player.get('/:id', async (req, res) => {
    // look up dungeon by ID and return object
    //res.send(await db.select(`player:${req.params.id}`));
    res.send(await db.models.Player.findAll({
      where: {
        id: req.params.id
      }
    }));
});

player.post('/create', async (req, res) => {
    //res.send(await db.create(`player:${req.body.id}`, {
    //    name: req.body.name,
    //    quests: [],
    //    dungeons: []
    //}));
    res.send(await db.models.Player.create({
      name: req.body.name
    }));
});

player.delete('/:id', async (req, res) => {
    if (await db.models.Player.destroy({
      where: {
        id: req.params.id
      }
    })) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
});

export default player
