import express from "express";
import * as dotenv from "dotenv"; // Explicitly use named import
import swaggerUi from "swagger-ui-express";
import healtRouter from "./routes/health"
import swaggerDocument from "./config/swagger-output.json"; // 
import cookieParser from 'cookie-parser';
import errorHandler from "./middleware/errorHandler";
import meetingRoutes from './routes/MeetingRoute';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/" , healtRouter);
app.use('/meetings', meetingRoutes);

app.use("/api-docs", swaggerUi.serve ,  swaggerUi.setup(swaggerDocument));
app.use(errorHandler);

export default app;