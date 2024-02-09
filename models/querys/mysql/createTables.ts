import { CreateTables, GetDB } from "../../database";

export const createTableMysql: CreateTables = {
	executeMethods: ExecuteMethods,
	methods: {
		createMueble: createTableMueble,
		createColor: createTableColor,
		createMuebleHasColor: createTableMuebleHasColor,
	},
};

function createTableMueble() {
	return new Promise((resolve, reject) => {
		let db = GetDB();
		if (db) {
			db.query(
				`CREATE TABLE IF NOT EXISTS mueble(
				id_mueble 		INTEGER PRIMARY KEY AUTO_INCREMENT,
			  nombre 				VARCHAR(60),
			  description		VARCHAR(500),
			  precio				DOUBLE(16,2),
			  medidas				VARCHAR(100),
			  path_3d 			VARCHAR(300),
			  estado				BOOLEAN DEFAULT true
			);`,
				(err) => {
					if (err) {
						reject("Error to create table Mueble: " + err.message);
					} else {
						resolve("Table Mueble is successful");
					}
				}
			);
		}
	});
}

function createTableColor() {
	return new Promise((resolve, reject) => {
		let db = GetDB();
		if (db) {
			db.query(
				`CREATE TABLE IF NOT EXISTS color(
					id_color INTEGER PRIMARY KEY AUTO_INCREMENT,
				  nombre VARCHAR(60) UNIQUE,
				  path_muestra VARCHAR(300)
				);`,
				(err) => {
					if (err) {
						reject("Error to create table Color: " + err.message);
					} else {
						resolve("Table Color is successful");
					}
				}
			);
		}
	});
}

function createTableMuebleHasColor() {
	return new Promise((resolve, reject) => {
		let db = GetDB();
		if (db) {
			db.query(
				`CREATE TABLE IF NOT EXISTS mueble_has_color(
					id_mueble INTEGER NOT NULL,
				  id_color INTEGER NOT NULL,
				  path_img VARCHAR(300),
					FOREIGN KEY (id_mueble) REFERENCES mueble(id_mueble),
				  FOREIGN KEY (id_color) REFERENCES color(id_color)
				);`,
				(err) => {
					if (err) {
						reject(
							"Error to create table mueble_has_color: " +
								err.message
						);
					} else {
						resolve("Table mueble_has_color is successful");
					}
				}
			);
		}
	});
}

export function ExecuteMethods() {
	const ctm = createTableMysql;
	ctm.methods
		.createMueble()
		.then((res) => {
			console.log(res);
			return ctm.methods.createColor();
		})
		.then((res) => {
			console.log(res);
			return ctm.methods.createMuebleHasColor();
		})
		.then((res) => {
			console.log(res);
		})
		.catch((err) => {
			console.error(err);
		});
}
