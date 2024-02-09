import {
	Connection,
	FieldPacket,
	ProcedureCallPacket,
	QueryError,
	ResultSetHeader,
	RowDataPacket,
} from "mysql2";
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
}
