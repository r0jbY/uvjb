import express from 'express';
import * as dotenv from "dotenv";
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import clientRoutes from './routes/clientRoutes'
import networkRoutes from './routes/networkRoutes'
import meetingRoutes from './routes/meetingRoutes'
import notificationRoutes from './routes/notificationRoutes'
import cookieParser from 'cookie-parser';
import errorHandler from './middleware/errorHandler';
import healthRoute from './routes/health';

dotenv.config();

const app = express();
app.use(cookieParser());
const allowedOrigins = [
  'http://localhost:5173',        // local dev
  'http://127.0.0.1:5173',        // alt local dev
  'http://frontend:5173',
  "https://uurtjevoorjebuurtje.com",
  "https://www.uurtjevoorjebuurtje.com"         
];

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});


app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());

app.use(healthRoute);

app.use('/auth',     authRoutes);
app.use('/users',    userRoutes);
app.use('/clients',  clientRoutes);
app.use('/network',  networkRoutes);
app.use('/meetings', meetingRoutes);
app.use('/notifications', notificationRoutes);


  // Basic welcome route
  app.get('/', (req, res) => {
    res.send('Welcome to the API Gateway!');
  });

app.use(errorHandler);

export default app;