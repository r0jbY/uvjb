import express, { Request, Response } from "express";
import * as dotenv from "dotenv"; // Explicitly use named import

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(`Hello Service running on http://localhost:${PORT}`);
});
