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
//import db from '../utils/surrealdb.js';
import db from '../utils/postgres.js';

const quest = Express.Router();

quest.get('/', async (req, res) => {
    // look up all quests and return object
    //res.send({quests: await db.select('quest')});
    //res.send({"quests": [
    //    {"id": 1, "name": "Sleepy Joe's Cabin", "latitude": "38.89644365", "longitude": "-77.03463355"},
    //    {"id": 2, "name": "Big Libby", "latitude": "40.689247", "longitude": "-74.044502"},
    //    {"id": 3, "name": "Midwest Stargate", "latitude": "38.624691", "longitude": "-90.184776"}
    //]});
    res.send(await db.models.Quest.findAll());
});

quest.get('/:id', async (req, res) => {
    // look up quest by ID and return object
    //res.send(await db.select(`quest:${req.params.id}`));
    //res.send({"id": 1, "name": "Sleepy Joe's Cabin", "latitude": "38.89644365", "longitude": "-77.03463355"});
    res.send(await db.models.Quest.findAll({
      where: {
        id: req.params.id
      }
    }));
});

quest.post('/create', async (req, res) => {
    //res.send(await db.create(`quest:${req.body.id}`, {
    //    name: req.body.name,
    //    latitude: req.body.latitude,
    //    longitude: req.body.longitude
    //}));
    let q = req.body;
    res.send(await db.models.Quest.create({
      name: q.name,
      location: {
        type: 'Point',
        coordinates: [q.longitude, q.latitude]
      }
    }));
});

quest.delete('/:id', async (req, res) => {
    if (await db.models.Quest.destroy({
      where: {
        id: req.params.id
      }
    })) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
});

export default quest;
