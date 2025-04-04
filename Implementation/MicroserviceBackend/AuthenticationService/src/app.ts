import express from "express";
import * as dotenv from "dotenv"; // Explicitly use named import
import swaggerUi from "swagger-ui-express";
import router from "./routes/authenticationRouter";
import swaggerDocument from "./config/swagger-output.json"; // Import generated JSON
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/auth" ,router);
app.use("/api-docs", swaggerUi.serve ,  swaggerUi.setup(swaggerDocument));

export default app;