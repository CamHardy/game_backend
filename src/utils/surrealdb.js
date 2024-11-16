//import { Surreal } from "surrealdb.js";

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

//        try {
//            await db.connect(DB_URL, {
//                namespace: DB_NAME,
//                database: DB_NAME,
//                auth: {
//                    namespace: DB_NAME,
//                    database: DB_NAME,
//                    username: DB_USER,
//                    password: DB_PASS
//                }
//            });
//        } catch (err) {
//            console.log("Error connecting to database", err);
//        }
//        console.log("Successfully connected to database");

        // await db.wait();

        await db.signin({
                username: DB_USER,
                password: DB_PASS,
                namespace: DB_NAME,
                database: DB_NAME
            })
            .then((res) => {
                console.log("Successfully signed in to database");
            })
            .catch((err) => {
                console.log("Error signing in to database", err);
            });

        await db.use({ namespace: DB_NAME, database: DB_NAME });
    } catch (err) {
        console.log("oh yuck", err);
    }
}

export default db;
