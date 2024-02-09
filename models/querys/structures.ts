import { FieldPacket, QueryError } from "mysql2";

export interface Mueble {
	id_mueble?: number;
	nombre?: string;
	description?: string;
	precio?: number;
	medidas?: string;
	estado?: boolean;
	path_3d?: string;
}

export interface Color {
	id_color?: number;
	nombre?: string;
	path_muestra?: string;
}

export interface MuebleHasColor {
	id_mueble: number;
	id_color: number;
	path_img: string;
}

export interface CallbackQuery {
	(error: QueryError | null, result: any, fields: FieldPacket[]): void;
}

export interface QuerysMueble {
	InsertMueble: (mueble: Mueble, callback: CallbackQuery) => void;
	InsertColor: (color: Color, callback: CallbackQuery) => void;
	InsertImageMueble: (mhc: MuebleHasColor, callback: CallbackQuery) => void;
	UpdateMuebleModel3D: (
		id_mueble: number,
		path_3d: string,
		callback: CallbackQuery
	) => void;
}

export interface ApiResponse {
	mensaje: string;
	status: number;
	body?: any;
}

export const executeQueryMueble = () => {
	switch (process.env.USEDB ?? "SQLite") {
		case "MySQL":
			break;
		case "SQLite":
			break;
		default:
			break;
	}
};
