import express  from "express";
import { getForecast} from "../controllers/weatherForecast.js";


const router = express.Router();

router.get("/:city", getForecast);



export default router;