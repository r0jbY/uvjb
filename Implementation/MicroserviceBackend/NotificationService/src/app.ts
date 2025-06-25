import express from "express";
import * as dotenv from "dotenv"; // Explicitly use named import
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./config/swagger-output.json"; // Import generated JSON
import cookieParser from 'cookie-parser';
import notificationRoutes from './routes/NotificationRoute'
import healthRoutes from './routes/health'
import errorHandler from "./middleware/errorHandler";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/', healthRoutes);
app.use("/notifications", notificationRoutes);

app.use("/api-docs", swaggerUi.serve ,  swaggerUi.setup(swaggerDocument));
app.use(errorHandler);

export default app;