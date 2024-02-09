import { Router } from "express";
import {
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

export default routeMueble;
