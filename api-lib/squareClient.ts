import { Client, Environment, ApiError } from "square";

const client = new Client({
    accessToken: process.env.SQUARE_ACCESS_TOKEN,
    environment: process.env.SQUARE_ENV as Environment,
});

export default client;
