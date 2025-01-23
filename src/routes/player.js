// player.js
import Express from 'express';
//import db from '../utils/surrealdb.js';
import { db, Player, Quest, Dungeon } from '../utils/postgres.js';

const player = Express.Router();

player.get('/', async (_, res) => {
  try {
    res.send(await Player.findAll({
      attributes: { exclude: ['active_quest_id'] }
    }));
  } catch (error) {
    console.error('Failed to get players: ', error);
    res.sendStatus(500);
  }
});

player.get('/:id', async (req, res) => {  
  //TODO: if query returns [], return 404 instead of empty array
  try {
    res.send(await Player.findOne({
      where: {
        id: req.params.id
      },
      attributes: { exclude: ['active_quest_id'] },
      include: [{
        model: Quest,
        as: 'active_quest'
      }, {
        model: Dungeon,
        as: 'dungeon_tokens',
        through: { attributes: [] }
      }]
    }));
  } catch (error) {
    console.error('Failed to get player: ', error);
    res.sendStatus(500);
  }
});

player.get('/:id/active-quest', async(req, res) => {
  try {
    res.send(await Quest.findOne({
      include: {
        model: Player,
        as: 'players',
        where: {
          id: req.params.id
        },
        attributes: []
      }
    }));
  } catch (error) {
    console.error('Failed to get active quest: ', error);
    res.sendStatus(500);
  }
});

player.get('/:id/dungeon-tokens', async(req, res) => {
  try {
    res.send(await Dungeon.findAll({
      include: {
        model: Player,
        as: 'players',
        where: {
          id: req.params.id
        },
        attributes: []
      }
    }));
  } catch (error) {
    console.error('Failed to get dungeon tokens: ', error);
    res.sendStatus(500);
  }
});

player.get('/:id/inventory', async(req, res) => {
  try {
    res.send(await Player.findOne({
      where: {
        id: req.params.id
      },
      attributes: ['inventory'],
      raw: true
    }).then(p => p.inventory));
  } catch (error) {
    console.error('Failed to get inventory: ', error);
    res.sendStatus(500);
  }
});

player.delete('/:id', async (req, res) => {
  try {
    if (await Player.destroy({
      where: {
        id: req.params.id
      }
    })) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error('Failed to delete player: ', error);
    res.sendStatus(500);
  }
});

player.post('/create', async (req, res) => {
  try {
    const {
      active_quest_id,
      dungeon_tokens,
      ...player 
    } = req.body; 

    const p = await Player.create(player);

    // create associations
    if (active_quest_id) {
      let q = await Quest.findByPk(active_quest_id);
      await p.setActive_quest(q);
    }
    
    if (dungeon_tokens) {
      await p.setDungeon_tokens(dungeon_tokens.map(d => d.id));
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Failed to create player: ', error);
    res.sendStatus(500);
  }
});

player.post('/update', async (req, res) => {
  try {
    const {
      id,
      active_quest_id,
      dungeon_tokens,
      ...playerData
    } = req.body;

    const p = await Player.findByPk(id);
    if (await p.update(playerData)) {
      if (active_quest_id) {
        let q = await Quest.findByPk(active_quest_id);
        await p.setActive_quest(q);
      }

      if (dungeon_tokens) {
        console.log(dungeon_tokens.map(d => d.id));
        await p.setDungeon_tokens(dungeon_tokens.map(d => d.id));
      }

      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error('Failed to update player: ', error);
    res.sendStatus(500);
  }
});

player.post('/active-quest/update', async(req, res) => {
  try {
    const p = await Player.findByPk(req.body.player_id);
    const q = await Quest.findByPk(req.body.active_quest_id);

    await p.setActive_quest(q);
    res.sendStatus(200);
  } catch (error) {
    console.error('Failed to update active quest: ', error);
    res.sendStatus(500);
  }
});


player.post('/dungeon-tokens/update', async(req, res) => {
  try {
    const p = await Player.findByPk(req.body.player_id);
    const dungeons = req.body.dungeon_tokens.map(d => d.id);

    await p.setDungeon_tokens(dungeons);
    res.sendStatus(200);
  } catch (error) {
    console.error('Failed to update dungeon tokens: ', error);
    res.sendStatus(500);
  }
});

player.post('/inventory/update', async(req, res) => {
  try {
    const p = await Player.findByPk(req.body.player_id);

    await p.update({ inventory: req.body.inventory });
    res.sendStatus(200);
  } catch (error) {
    console.error('Failed to update inventory: ', error);
    res.sendStatus(500);
  }
});

export default player
