import dotenv from "dotenv";
import Server from "./models/server";
dotenv.config();

const server = new Server();

//server.listen();
server.start();

export const pathProyect = __dirname;
