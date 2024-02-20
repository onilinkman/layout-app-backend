import { Router } from "express";
import {
	GetAllMuebleAndImage,
	GetColorC,
	PostColor,
	PostMueble,
	PostMuebleHasColor,
	PutMuebleModel3D,
} from "../controllers/muebleC";

const routeMueble = Router();

routeMueble.post("/", PostMueble);
routeMueble.post("/addColor", PostColor);
routeMueble.post("/addMuebleColor", PostMuebleHasColor);
routeMueble.put("/put3D", PutMuebleModel3D);
routeMueble.get("/", GetColorC);
routeMueble.post("/getAllMuebleAndImage",GetAllMuebleAndImage)

export default routeMueble;
