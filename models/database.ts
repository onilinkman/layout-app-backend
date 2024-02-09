import { Connection, Query } from "mysql2";

export interface databaseModel {
	constructor: any;
	createConnection: () => Connection;
	Connect: () => void;
	Ping: () => void;
	GetDB: () => Connection | undefined;
}

export interface CreateTables {
	executeMethods: () => void;
	methods: {
		createMueble: () => Promise<unknown>;
		createColor: () => Promise<unknown>;
		createMuebleHasColor: () => Promise<unknown>;
	};
}

var DB: Connection | undefined;

export const ConnectDB = (structureDB: databaseModel) => {
	return new Promise((resolve, reject) => {
		structureDB.Ping();
		DB = structureDB.GetDB();
		if (DB) {
			resolve("Ready for use DB");
		} else {
			reject("Error to connect DB");
		}
	});
};

export function GetDB(): Connection | undefined {
	return DB;
}
