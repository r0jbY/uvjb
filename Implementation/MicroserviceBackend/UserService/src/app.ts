import express from "express";
import * as dotenv from "dotenv"; // Explicitly use named import
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./config/swagger-output.json"; // Import generated JSON
import cookieParser from 'cookie-parser';
import router from './routes/UserRoute'

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(router);

app.use("/api-docs", swaggerUi.serve ,  swaggerUi.setup(swaggerDocument));

export default app;