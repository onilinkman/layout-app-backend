import { Request, Response } from "express";
import {
	ApiResponse,
	Color,
	Mueble,
	MuebleHasColor,
	QuerysMueble,
} from "../models/querys/structures";
import { MuebleMysql } from "../models/querys/mysql/mueble";
import {
	createDir,
	saveColorImg,
	saveImgMueble,
	saveModel3d,
} from "../models/_drive_files";
import { pathProyect } from "../app";

import path from "path";

const qm: QuerysMueble =
	(process.env.USEDB ?? "SQLite") == "MySQL"
		? new MuebleMysql()
		: new MuebleMysql();

export function PostMueble(req: Request, res: Response) {
	const body = req.body;
	const mueble: Mueble = {
		nombre: body?.nombre ?? "",
		description: body?.description ?? "",
		medidas: body?.medidas,
		precio: parseFloat(body.precio ?? 0.0),
	};
	qm.InsertMueble(mueble, (err, result) => {
		if (err) {
			let r: ApiResponse = {
				mensaje:
					"error al insertar en la base de datos: " + err.message,
				status: 409,
			};
			res.send(r).status(r.status);
		} else {
			let r: ApiResponse = {
				mensaje: "Se Agrego correctamente",
				status: 200,
				body: {
					id_mueble: result.insertId,
				},
			};
			createDir("uploads", result.insertId + "");
			res.send(r).status(r.status);
		}
	});
}

export function PostColor(req: Request, res: Response) {
	const body = req.body;
	let file = req.files;
	let img: any = file?.img;
	let name = img.name;
	const color: Color = {
		nombre: body.nombre ?? "",
		path_muestra: img
			? path.join(name) //tenia que ser asi: path.join(pathProyect, "uploads", "colors", name)
			: "",
	};
	qm.InsertColor(color, async (err) => {
		if (err) {
			let r: ApiResponse = {
				mensaje:
					"Error al instar en la base de datos el color: " +
					err.message,
				status: 409,
			};
			res.send(r).status(r.status);
		} else {
			createDir("uploads", "colors");
			await saveColorImg(req)
				.then((value) => {
					if (value) {
						let r: ApiResponse = {
							mensaje: "Se subio correctamente",
							status: 200,
						};
						res.send(r).status(r.status);
					} else {
						let r: ApiResponse = {
							mensaje: "Error al guardar el archivo",
							status: 409,
						};
						res.send(r).status(r.status);
					}
				})
				.catch((e) => {
					let r: ApiResponse = {
						mensaje: "Error al guardar el archivo",
						status: 409,
					};
					res.send(r).status(r.status);
				});
		}
	});
}

export function PostMuebleHasColor(req: Request, res: Response) {
	const body = req.body;
	const mhc: MuebleHasColor = {
		id_color: parseInt(body.id_color ?? 0),
		id_mueble: parseInt(body.id_mueble ?? 0),
		path_img: "",
	};
	let r: ApiResponse = {
		status: 409,
		mensaje: "",
	};
	saveImgMueble(req, mhc.id_mueble)
		.then((value) => {
			if (value.isSave) {
				mhc.path_img = value.mensaje;
				qm.InsertImageMueble(mhc, (err) => {
					if (err) {
						r.status = 409;
						r.mensaje =
							"Error al guardar en la base de datos: " +
							err.message;

						res.send(r).status(r.status);
					} else {
						r.status = 200;
						r.mensaje = "Se guardo correctamente";
						res.send(r).status(r.status);
					}
				});
			} else {
				r.status = 409;
				r.mensaje = value.mensaje;
				res.send(r).status(r.status);
			}
		})
		.catch((err) => {
			r.status = 409;
			r.mensaje =
				"Hubo un error al guardar en saveImgMueble: " + err.message;
			console.log(err.message, r);
			res.send(r).status(r.status);
		});
}

export function PutMuebleModel3D(req: Request, res: Response) {
	const body = req.body;
	let r: ApiResponse = {
		status: 404,
		mensaje: "Error al adicionar el modelo 3D",
	};
	saveModel3d(req, parseInt(body.id_mueble))
		.then((value) => {
			if (value.isSave) {
				qm.UpdateMuebleModel3D(
					parseInt(body.id_mueble),
					value.mensaje,
					(err) => {
						if (err) {
							res.send(r).status(r.status);
						} else {
							res.sendStatus(200);
						}
					}
				);
			} else {
				r.mensaje = value.mensaje;
				res.send(r).status(r.status);
			}
		})
		.catch((err) => {
			r.mensaje = "Error al guardar el modelo";
			res.send(r).status(r.status);
		});
}

export function GetColorC(req: Request, res: Response) {
	let r: ApiResponse = {
		status: 404,
		mensaje: "Error al obtener colores",
	};
	qm.GetColor((err, result) => {
		if (!err) {
			r.status = 200;
			r.mensaje = "datos obtenidos correctamente";
			r.body = result;
		}
		res.send(r).status(r.status);
	});
}
