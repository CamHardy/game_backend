import { Sequelize, DataTypes } from 'sequelize';
import 'dotenv/config';

const {
  DB_NAME,
  DB_USER,
  DB_PASS
} = process.env;

const db = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: 'localhost',
  dialect: 'postgres'
});

try {
  await db.authenticate();
  console.log('Database connection successful.');
} catch (error) {
  console.error('Connection to database failed: ', error);
}

export async function initDb() {
  // define models
  const Player = db.define('Player', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  const Quest = db.define('Quest', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    location: {
      type: DataTypes.GEOGRAPHY('POINT'),
      allowNull: false
    }
  });

  const Dungeon = db.define('Dungeon', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  // define associations
  Player.belongsToMany(Quest, { through: 'player_quest' });
  Quest.belongsToMany(Player, { through: 'player_quest' });

  Player.belongsToMany(Dungeon, { through: 'player_dungeon' });
  Dungeon.belongsToMany(Player, { through: 'player_dungeon' });

  console.log('Initialized database successfully.');
  return db;
}

export default db;
