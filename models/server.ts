import express, { Application, Request, Response } from "express";
import next from "next";
import userRoutes from "../routes/usuario";
import cors from "cors";
import mysqlDB from "./mysql";
import { ConnectDB, CreateTables } from "./database";
import { createTableMysql } from "./querys/mysql/createTables";
import routeMueble from "../routes/mueble";
import fileUpload from "express-fileupload";
import { dirPublic, pathProyect } from "../app";

import path from "path";
import fs from "fs";

class Server {
	private app: Application;
	private port: string;
	private apiPaths = {
		usuarios: "/api/usuarios",
		mueble: "/api/v1/mueble",
	};

	constructor() {
		this.app = express();
		this.port = process.env.PORT || "8000";

		this.connectDB();

		this.middlewares();
		//Defined routes
		this.routes();

		//config nextjs app
		this.setupNext();
	}

	middlewares() {
		// CORS

		this.app.use(cors());

		//Lectura del body
		this.app.use(express.json());

		//Carpeta publica
		this.app.use(express.static(dirPublic));
		this.app.use(fileUpload());
	}

	connectDB() {
		const createTable = (ct: CreateTables) => {
			ct.executeMethods();
		};
		switch (process.env.USEDB) {
			case "MySQL":
				ConnectDB(new mysqlDB()).then((res) => {
					console.log(res);
					createTable(createTableMysql);
				});
				break;
			case "SQLite":
				console.log("usando sqlite");
				break;
			default:
				break;
		}
	}

	routes() {
		this.app.use(this.apiPaths.usuarios, userRoutes);
		this.app.use(this.apiPaths.mueble, routeMueble);
		this.app.get("/uploads/color", (req: Request, res: Response) => {
			let body = req.query?.path_muestra;
			if (typeof body == "string") {
				let path_muestra: string = body ?? "";
				let p = path.join(
					pathProyect,
					"uploads",
					"colors",
					path_muestra
				);
				if (fs.existsSync(p)) {
					res.sendFile(p);
				} else {
					res.sendStatus(404);
				}
			} else {
				res.send({
					message: "query no aceptable",
				}).status(413);
			}
		});
		this.app.get("/uploads/3d", (req: Request, res: Response) => {
			let id_mueble = req.query?.id;
			let name = req.query?.name;
			if (id_mueble && name) {
				let p = path.join(
					pathProyect,
					"uploads",
					id_mueble + "",
					name + ""
				);
				if (fs.existsSync(p)) {
					res.sendFile(p);
				} else {
					res.sendStatus(404);
				}
			} else {
				res.sendStatus(406);
			}
		});
	}

	private setupNext() {
		const dev = process.env.NODE_ENV !== "production";
		const nextApp = next({ dev });
		const handle = nextApp.getRequestHandler();

		nextApp.prepare().then(() => {
			this.app.get("*", (req, res) => {
				return handle(req, res);
			});

			this.listen();
		});
	}

	listen() {
		this.app.listen(this.port, () => {
			console.log("Server run in port! ", this.port);
		});
	}

	start() {
		this.setupNext();
	}
}

export default Server;
