import express, { Application } from "express";
import next from "next";
import userRoutes from "../routes/usuario";
import cors from "cors";

class Server {
	private app: Application;
	private port: string;
	private apiPaths = {
		usuarios: "/api/usuarios",
	};

	constructor() {
		this.app = express();
		this.port = process.env.PORT || "8000";

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
	}

	routes() {
		this.app.use(this.apiPaths.usuarios, userRoutes);
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
