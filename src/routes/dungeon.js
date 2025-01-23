// dungeon.js
import Express from 'express';
import { db, Dungeon } from '../utils/postgres.js';

const dungeon = Express.Router();

dungeon.get('/', async (req, res) => {
  try {
    res.send(await Dungeon.findAll());
  } catch (error) {
    console.error('Failed to get dungeons: ', error);
    res.sendStatus(500);
  }
});

dungeon.get('/:id', async (req, res) => {
    //TODO: if query returns [], return 404 instead of empty array
    try {
      res.send(await Dungeon.findOne({
        where: {
          id: req.params.id
        }
      }));
    } catch (error) {
      console.error('Failed to get dungeon: ', error);
      res.sendStatus(500);
    }
});

dungeon.delete('/:id', async (req, res) => {
  try {
    if (await Dungeon.destroy({
      where: {
        id: req.params.id
      }
    })) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error('Failed to delete dungeon: ', error);
    res.sendStatus(500);
  }
});

dungeon.post('/create', async (req, res) => {
  try {
    res.send(await Dungeon.create(req.body));
  } catch (error) {
    console.error('Failed to create dungeon: ', error);
    res.sendStatus(500);
  }
});

dungeon.post('/update', async (req, res) => {
  try {
    if (await Dungeon.update(req.body, {
      where: {
        id: req.body.id
      }
    })) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error('Failed to update dungeon: ', error);
    res.sendStatus(500);
  }
});

export default dungeon;
