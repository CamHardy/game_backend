import express from 'express';
import https from 'https';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import volleyball from 'volleyball';
import cors from 'cors';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import 'dotenv/config';

//import { initDb } from './src/utils/surrealdb.js';
import { initDb } from './src/utils/postgres.js';

// middleware
import { jwtCheckUser } from './src/middleware/jwtCheck.js';

// routes
import player from './src/routes/player.js';
import quest from './src/routes/quest.js';
import dungeon from './src/routes/dungeon.js';

initDb();

const app = express();
const port = process.env.PORT;

// https.createServer(app).listen(port, () => {
//     console.log(`Listening on port ${port}`);
// });

app.use(volleyball);    // nice req/res logging
app.use(cors());        // ew yuck nobody likes cors
app.use(helmet());      // always wear your helmet
app.use(express.json());

//app.use(jwtCheckUser);  // keep out the unwashed masses

app.get('/', (req, res) => {
    console.log('heyo mayo');
    res.send('welcome bud u made it');
});

app.use('/player', player);
app.use('/quest', quest);
app.use('/dungeon', dungeon);

const options = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'game_backend API',
            version: '0.1.0',
            description: 'This is a simple CRUD API application',
            license: {
                name: 'UNLICENSED'
            },
            contact: {
                name: 'Cam Hardy',
                email: 'camfhardy@gmail.com'
            }
        },
        servers: [
            {
                url: `http://localhost:${port}`
            }
        ]
    },
    apis: ['./routes/*.js']
};

const specs = swaggerJsdoc(options);
app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(specs)
);

app.use(notFound);
app.use(errorHandler);

const server = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

// process.on('SIGINT', shutdown);

// utils
function notFound(req, res, next) {
    res.status(404);
    next(new Error(`Not found - ${req.originalUrl}`));
}

function errorHandler(err, _, res, next) {
    if (res.headersSent) {
        return next(err);
    }

    res.status(res.statusCode || 500);
    res.json({
        name: err.name,
        message: err.message,
        stack: err.stack    //TODO: probably should remove this before production
    });
}
