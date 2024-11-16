import { initDb } from './postgres.js';
import { DataTypes } from 'sequelize';

const db = await initDb();
const Player = db.models.Player;
const Quest = db.models.Quest;
const Dungeon = db.models.Dungeon;

// build a demo dataset

await db.sync({ force: true});

try {
  // create quests
  const q1 = await Quest.create({
    name: "Sleepy Joe's Cabin",
    location: {
      type: 'Point',
      coordinates: [-77.03463355, 38.89644365]
    }
  });

  const q2 = await Quest.create({
    name: 'Big Libby',
    location: {
      type: 'Point',
      coordinates: [-74.044502, 40.689247]
    }
  });

  const q3 = await Quest.create({
    name: 'Midwest Stargate',
    location: {
      type: 'Point',
      coordinates: [-90.184776, 38.624691]
    }
  });

  // create dungeons
  const d1 = await Dungeon.create({
    name: 'The Chamber of Secrets'
  });

  const d2 = await Dungeon.create({
    name: 'Anor Londo'
  });

  // create users
  const p1 = await Player.create({ name: 'Tj Kream' });
  await p1.addQuest(q1);
  await p1.addQuest(q2);
  await p1.addDungeon(d1);

  console.log('Dataset created successfully.');
} catch (error) {
  console.error('Failed to create dataset: ', error);
  process.exit(1);
}

await db.close().then(() => {
  console.log('Connection closed.');
  process.exit();
});
