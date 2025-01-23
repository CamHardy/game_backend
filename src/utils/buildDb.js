import { initDb } from './postgres.js';
import exampleDataset from './exampleDataset.json' with {type: "json"};

const db = await initDb();
const Player = db.models.Player;
const Quest = db.models.Quest;
const Dungeon = db.models.Dungeon;

// build a demo dataset

await db.sync({ force: true});

try {
  // create quests
  for (const quest of exampleDataset.quests) {
    await Quest.create(quest);
  }

  // create dungeons
  for (const dungeon of exampleDataset.dungeons) {
    await Dungeon.create(dungeon);
  }

  // create users
  for (const player of exampleDataset.players) {
    const { active_quest_id, dungeon_tokens, ...playerData } = player;
    const p = await Player.create(playerData);
    
    // create associations
    if (active_quest_id) {
      let q = await Quest.findByPk(active_quest_id);
      await p.setActive_quest(q);
    }
    for (const dungeon of dungeon_tokens) {
      let d = await Dungeon.findByPk(dungeon.id);
      await p.addDungeon_token(d);
    }
  }

  console.log('Dataset created successfully.');
} catch (error) {
  console.error('Failed to create dataset: ', error);
  process.exit(1);
}

await db.close().then(() => {
  console.log('Connection closed.');
  process.exit();
});
