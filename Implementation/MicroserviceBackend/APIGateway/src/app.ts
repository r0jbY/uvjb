import express from 'express';
import {createProxyMiddleware} from 'http-proxy-middleware'

const app = express();

app.use('/auth/login', createProxyMiddleware({
    target: 'http://localhost:3001/auth/login',
    changeOrigin: true,
}));

app.use('/auth/logout', createProxyMiddleware({
    target: 'http://localhost:3001/auth/logout', 
    changeOrigin: true,
}));

app.use('/auth/register', createProxyMiddleware({
    target: 'http://localhost:3001/auth/register', 
    changeOrigin: true,
}));
  


app.get('/', (req, res) => {
    res.send('Welcome to the API Gateway!');
});

export default app;