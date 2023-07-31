// quest.js

// quest name
// GPS data (location I assume)
// total times completed
// foreign key dungeon id

// API endpoints
// fetch quest (currently return all, eventually implement geofiltering to only retrieve quests within x distance)
// create quest (restrict use to admins)
// complete quest (add one to quest total times completed, add quest id to player quests completed)

import Express from 'express';
import db from '../utils/surrealdb.js';

const quest = Express.Router();

quest.get('/', async (req, res) => {
    // look up all quests and return object
    res.send(await db.select('quest'));
});

quest.get('/:id', async (req, res) => {
    // look up quest by ID and return object
    res.send(await db.select(`quest:${req.params.id}`));
});

quest.post('/create', async (req, res) => {
    res.send(await db.create(`quest:${req.body.name}`, {
        name: req.body.name
    }));
});

export default quest;