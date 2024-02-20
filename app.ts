import dotenv from "dotenv";
import Server from "./models/server";
import path from "path";
export const pathProyect = __dirname;
export const dirPublic = path.join(__dirname, "public","static");

dotenv.config();

const server = new Server();

//server.listen();
server.start();
