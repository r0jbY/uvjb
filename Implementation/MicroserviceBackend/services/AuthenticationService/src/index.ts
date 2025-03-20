import express, { Request, Response } from "express";
import * as dotenv from "dotenv"; // Explicitly use named import
import router from "./routes/authenticationRouter";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(router);



app.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}`);
});
