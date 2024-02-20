import { Connection } from "mysql2";
import { GetDB } from "../../database";
import {
	CallbackQuery,
	Color,
	Mueble,
	MuebleHasColor,
	QuerysMueble,
} from "../structures";

export class MuebleMysql implements QuerysMueble {
	InsertMueble(mueble: Mueble, callback: CallbackQuery): void {
		let db: Connection | undefined = GetDB();
		let query: string = `INSERT INTO mueble(nombre,description,precio,medidas) VALUES (?,?,?,?);`;
		db?.execute(
			query,
			[mueble.nombre, mueble.description, mueble.precio, mueble.medidas],
			(err, result, fields) => {
				callback(err, result, fields);
			}
		);
	}

	InsertColor(color: Color, callback: CallbackQuery) {
		let db: Connection | undefined = GetDB();
		let query: string = `INSERT INTO color(nombre,path_muestra) VALUES (?,?);`;
		db?.execute(
			query,
			[color.nombre, color.path_muestra],
			(err, result, fields) => {
				callback(err, result, fields);
			}
		);
	}

	InsertImageMueble(mhc: MuebleHasColor, callback: CallbackQuery) {
		let db: Connection | undefined = GetDB();
		let query: string = `INSERT INTO mueble_has_color(id_mueble,id_color,path_img) VALUES (?,?,?);`;
		db?.execute(
			query,
			[mhc.id_mueble, mhc.id_color, mhc.path_img],
			(err, result, fields) => {
				callback(err, result, fields);
			}
		);
	}

	UpdateMuebleModel3D(
		id_mueble: number,
		path_3d: string,
		callback: CallbackQuery
	) {
		let db: Connection | undefined = GetDB();
		let query: string = `UPDATE mueble SET path_3d=? WHERE id_mueble=?;`;
		db?.execute(query, [path_3d, id_mueble], (err, result, fields) => {
			callback(err, result, fields);
		});
	}

	GetColor(callback: CallbackQuery) {
		let db: Connection | undefined = GetDB();
		let query: string = `SELECT id_color,nombre,path_muestra FROM color;`;
		db?.execute(query, (err, result, fields) => {
			callback(err, result, fields);
		});
	}

	GetAllMuebleAndImgByIdMueble(id_color: number, callback: CallbackQuery) {
		let db: Connection | undefined = GetDB();
		let query: string = `SELECT m.id_mueble, m.nombre, m.description,m.medidas,
		m.precio,m.path_3d, mhc.path_img
		FROM mueble m
		LEFT JOIN mueble_has_color mhc ON m.id_mueble=mhc.id_mueble
		WHERE m.estado=1 AND (mhc.id_color=? OR ? = 0);`;
		db?.execute(query, [id_color, id_color], (err, result, fields) => {
			callback(err, result, fields);
		});
	}
}
