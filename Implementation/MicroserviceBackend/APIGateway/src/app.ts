import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware'
import * as dotenv from "dotenv";
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import axios from 'axios';

dotenv.config();

const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // or use '*' to allow all (less secure)
    credentials: true, // allow cookies if needed
}));

app.use(express.json());



app.use(authRoutes);
app.use(userRoutes);
  
  // Basic welcome route
  app.get('/', (req, res) => {
    res.send('Welcome to the API Gateway!');
  });

export default app;