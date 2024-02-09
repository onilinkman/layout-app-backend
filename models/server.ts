import express, { Application } from "express";
import next from "next";
import userRoutes from "../routes/usuario";
import cors from "cors";
import mysqlDB from "./mysql";
import { ConnectDB, CreateTables } from "./database";
import { createTableMysql } from "./querys/mysql/createTables";
import routeMueble from "../routes/mueble";
import fileUpload from "express-fileupload"

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
		this.app.use(express.static("public/static"));
		this.app.use(fileUpload())
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
