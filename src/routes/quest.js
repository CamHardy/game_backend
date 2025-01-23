// quest.js
import Express from 'express';
import { db, Quest } from '../utils/postgres.js';

const quest = Express.Router();

quest.get('/', async (req, res) => {
  try {
    res.send(await Quest.findAll());
  } catch (error) {
    console.error('Failed to get quests: ', error);
    res.sendStatus(500);
  }
});

quest.get('/:id', async (req, res) => {
  //TODO: if query returns [], return 404 instead of empty array
  try {
    res.send(await Quest.findOne({
      where: {
        id: req.params.id
      }
    }));
  } catch (error) {
    console.error('Failed to get quest: ', error);
    res.sendStatus(500);
  }
});

quest.delete('/:id', async (req, res) => {
  try {
    if (await Quest.destroy({
      where: {
        id: req.params.id
      }
    })) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error('Failed to delete quest: ', error);
    res.sendStatus(500);
  }
});

quest.post('/create', async (req, res) => {
  try {
    let q = req.body;
    res.send(await Quest.create({
      name: q.name,
      location: {
        type: 'Point',
        coordinates: [q.longitude, q.latitude] // YES, longitude first
      }
    }));
  } catch (error) {
    console.error('Failed to create quest: ', error);
    res.sendStatus(500);
  }
});

quest.post('/update', async (req, res) => {
  try {
    let q = req.body;
    if (await Quest.update({
      name: q.name,
      location: {
        type: 'Point',
        coordinates: [q.longitude, q.latitude] // YES, longitude first
      }
    }, {
      where: {
        id: q.id
      }
    })) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error('Failed to update quest: ', error);
    res.sendStatus(500);
  }
}); 

export default quest;
