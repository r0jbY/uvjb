import express, { Request, Response } from "express";
import * as dotenv from "dotenv"; // Explicitly use named import
import swaggerUi from "swagger-ui-express";
import router from "./routes/authenticationRouter";
import swaggerDocument from "./utils/swagger-output.json"; // Import generated JSON

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use("/auth" ,router);

app.use("/api-docs", swaggerUi.serve ,  swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}`);
});
