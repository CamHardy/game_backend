import Surreal from "surrealdb.js";

import { config } from 'dotenv';
config();

const {
    DB_URL,
    DB_USER,
    DB_PASS,
    DB_NAME
} = process.env;

const db = new Surreal(DB_URL);

export async function initDb() {
    try {
        console.log("Initializing database...");
        if (!DB_USER || !DB_PASS) {
            throw new Error("Database username or password not set")
        }

        // await db.connect(DB_URL)
        //     .then(() => {
        //         console.log("Successfully connected to database");
        //     })
        //     .catch((err) => {
        //         console.log("Error connecting to database", err);
        //     });

        // await db.wait();

        await db.signin({
                user: DB_USER,
                pass: DB_PASS
            })
            .then((res) => {
                console.log("Successfully signed in to database", res?res:'');
            })
            .catch((err) => {
                console.log("Error signing in to database", err);
            });

        await db.use({ ns: DB_NAME, db: DB_NAME });
    } catch (err) {
        console.log("oh yuck", err);
    }
}

export default db;