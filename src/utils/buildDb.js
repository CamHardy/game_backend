import db, { initDb } from './surrealdb.js';

await initDb();

// build a demo dataset
await db.delete('player');
await db.delete('quest');
await db.delete('dungeon');

await db.create('quest:gooby', {
    name: 'Gooby'
});

await db.create('quest:wooby', {
    name: 'Wooby'
});

await db.create('dungeon:stoopu', {
    name: 'Stoopu'
});

await db.create('dungeon:doopu', {
    name: 'Doopu'
});

await db.create('player:tjkream', {
    name: 'Tj Kream',
    quests: [
        'wooby'
    ],
    dungeons: [
        'stoopu',
        'doopu'
    ]
}).then(() => console.log('done.'));