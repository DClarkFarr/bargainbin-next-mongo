import { Client, Environment, ApiError } from "square";

console.log("access token", process.env.SQUARE_ACCESS_TOKEN);
const client = new Client({
    accessToken: process.env.SQUARE_ACCESS_TOKEN,
    environment: process.env.SQUARE_ENV as Environment,
});

export default client;
