import mysql, { Connection } from "mysql2";
import { databaseModel } from "./database";

export default class mysqlDB implements databaseModel {
	db: Connection | undefined;

	constructor() {
		this.Connect();
	}

	createConnection(): Connection {
		return mysql.createConnection({
			host: process.env.HOSTDB ?? "192.168.0.120",
			port: process.env.PORTDB ? parseInt(process.env.PORTDB, 10) : 3306,
			password: process.env.PASSWORDDB ?? "pelota12",
			user: process.env.USERDB ?? "root",
			database: process.env.DATABASEDB ?? "decormueble",
		});
	}

	Connect(): void {
		this.db = this.createConnection();
		this.db.connect((err) => {
			if (err) {
				console.error("Error to connect database:", err.message);
			} else {
				console.log("MySQL connect is successful");
			}
		});
	}

	Ping(): void {
		this.db?.ping((err) => {
			if (err) {
				console.log("Error to make ping:", err.message);
				process.exit(1);
			} else {
				console.log("Ping successful");
			}
		});
	}

	GetDB(): Connection | undefined {
		return this.db;
	}
}
