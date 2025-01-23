import { Sequelize, DataTypes } from 'sequelize';
import 'dotenv/config';

const {
  DB_NAME,
  DB_USER,
  DB_PASS
} = process.env;

const db = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: '168.235.103.55',
  port: '5432',
  dialect: 'postgres'
});

// define models
const Player = db.define('Player', {
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  model_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  experience_points: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  health_points: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  damage_points: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  energy_points: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  currency: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  inventory: {
    type: DataTypes.JSONB,
    allowNull: true
  }, 
  active_quest_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Quests',
      key: 'id',
    },
    allowNull: true
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
  },
  is_temporary: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  expiry_time: {
    type: DataTypes.DATE,
    allowNull: true
  },
  seed: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

try {
  await db.authenticate();
  console.log('Database connection successful.');
} catch (error) {
  console.error('Connection to database failed: ', error);
}

export async function initDb() {
  // define associations
  // many Players can have the same active quest
  Player.belongsTo(Quest, { 
    as: 'active_quest', 
    foreignKey: 'active_quest_id',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  });
  Quest.hasMany(Player, { 
    as: 'players', 
    foreignKey: 'active_quest_id',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  });

  // Players and Dungeons (many-to-many relationship)
  Player.belongsToMany(Dungeon, { 
    as: 'dungeon_tokens',
    through: 'player_dungeons',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
  Dungeon.belongsToMany(Player, {
    as: 'players', 
    through: 'player_dungeons',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  console.log('Initialized database successfully.');
  return db;
}

export { db, Player, Quest, Dungeon };
