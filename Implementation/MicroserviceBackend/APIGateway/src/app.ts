import express from 'express';
import {createProxyMiddleware} from 'http-proxy-middleware'
import * as dotenv from "dotenv";
import cors from 'cors';
import router from './routes/userRoutes';

dotenv.config();

const app = express();


app.use(cors({
    origin: 'http://localhost:5173', // or use '*' to allow all (less secure)
    credentials: true, // allow cookies if needed
  }));

app.use(router)

app.use('/auth/login', createProxyMiddleware({
    target: 'http://localhost:3001/auth/login',
    changeOrigin: true,
}));

app.use('/auth/logout', createProxyMiddleware({
    target: 'http://localhost:3001/auth/logout',
    changeOrigin: true,
}));


app.use('/users/getAll', createProxyMiddleware({
    target: 'http://localhost:3002/users/getAll', 
    changeOrigin: true,
}));

app.use('/users/search', createProxyMiddleware({
    target: 'http://localhost:3002/users/search', 
    changeOrigin: true,
}));

app.use('/auth/register', createProxyMiddleware({
    target: 'http://localhost:3001/auth/register', 
    changeOrigin: true,
}));
  
app.use('/auth/whoAmI', createProxyMiddleware({
    target: 'http://localhost:3001/auth/whoAmI', 
    changeOrigin: true,
}));

app.get('/', (req, res) => {
    res.send('Welcome to the API Gateway!');
});

export default app;