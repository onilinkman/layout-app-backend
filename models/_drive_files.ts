import { Request } from "express";
import { pathProyect } from "../app";

import path from "path";
import fs from "fs";
import fileUpload from "express-fileupload";

const formatImg = ["png", "jpg", "jpeg", "gif"];

export const saveFile = (req: Request, dir: string) => {
	let file = req.files;
	if (file) {
		let img: any = file.img;
		console.log(img.name, pathProyect);
	}
};

export const saveColorImg: (req: Request) => Promise<boolean> = async (
	req: Request
) => {
	let file = req.files;
	let ret = false;
	if (file && !Array.isArray(file.img)) {
		let img: fileUpload.UploadedFile = file.img;
		let name = img.name;
		let ext = name.split(".");
		let type: string = ext[ext.length - 1];
		if (formatImg.includes(type)) {
			createDir("uploads", "colors");
			let dir: string = path.join(pathProyect, "uploads", "colors", name);
			await img
				.mv(dir)
				.then(() => {
					ret = true;
				})
				.catch((err: any) => {
					ret = false;
				});
		}
	}
	return ret;
};

export const saveImgMueble: (
	req: Request,
	id_mueble: number
) => Promise<msgImage> = async (req: Request, id_mueble: number) => {
	let file = req.files;
	let ret: msgImage = {
		isSave: false,
		mensaje: "hubo un error al guardar imagen",
	};
	if (file && !Array.isArray(file.img)) {
		let img: fileUpload.UploadedFile = file.img;
		let name = img.name;
		let ext = name.split(".");
		let type: string = ext[ext.length - 1];
		if (formatImg.includes(type)) {
			let dir: string = createDir("uploads", id_mueble + "");
			await img
				.mv(path.join(dir, name))
				.then((value) => {
					ret.isSave = true;
					ret.mensaje = path.join(dir, name);
				})
				.catch((err) => {
					ret.isSave = false;
					ret.mensaje = "hubo un error al guardar la imagen";
				});
		} else {
			ret.isSave = false;
			ret.mensaje = "Tipo de archivo no aceptado";
		}
	}
	return ret;
};

export const saveModel3d: (
	req: Request,
	id_mueble: number
) => Promise<msgImage> = async (req: Request, id_mueble: number) => {
	let file = req.files;
	let ret: msgImage = {
		isSave: false,
		mensaje: "Hubo un error al guardar el modelo",
	};
	if (file && !Array.isArray(file.model)) {
		let model: fileUpload.UploadedFile = file.model;
		let name = model.name;
		let ext = name.split(".");
		let type: string = ext[ext.length - 1];
		if (type == "glb") {
			let dir: string = createDir("uploads", id_mueble + "");
			await model
				.mv(path.join(dir, name))
				.then((value) => {
					ret.isSave = true;
					ret.mensaje = path.join(dir, name);
				})
				.catch((err) => {
					ret.isSave = false;
					ret.mensaje = "Hubo un error al guardar el modelo 3d";
				});
		} else {
			ret.isSave = false;
			ret.mensaje = "Tipo de archivo no aceptado";
		}
	}
	return ret;
};

export const createDir: (...p: string[]) => string = (...p: string[]) => {
	let dir: string = path.join(pathProyect, ...p);
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}
	return dir;
};

export interface msgImage {
	mensaje: string;
	isSave: boolean;
	errnor?: number;
}
