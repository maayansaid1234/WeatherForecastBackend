import express from "express";
import weatherForecastRouter from "./routes/weatherForecast.js"
import { config } from "dotenv";
import cors from "cors";
import { errorHandling } from "./middlewares/errorHandling.js";


const app = express();
config();
app.use(cors())
app.use(express.json());
app.use("/api/weatherForecast", weatherForecastRouter);
app.use(errorHandling)

let port = process.env.PORT ;
app.listen(port, () => {
    console.log(`app is listening on port ${port}`)
})
