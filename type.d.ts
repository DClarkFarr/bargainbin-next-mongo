import { MongoClient } from "mongodb";

declare module NodeJS {
    interface Global {
        mongoClientPromise: Promise<MongoClient>;
    }
}

declare global {
    var mongoClientPromise: Promise<MongoClient>;
}
