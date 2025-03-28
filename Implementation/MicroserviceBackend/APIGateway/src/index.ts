import express from 'express';
import {createProxyMiddleware} from 'http-proxy-middleware'

const app = express();

// Proxy configuration for Service 1

app.use('/auth/login', createProxyMiddleware({
    target: 'http://localhost:3001/auth/login', // AuthService URL
    changeOrigin: true,
}));

app.use('/auth/logout', createProxyMiddleware({
    target: 'http://localhost:3001/auth/logout', // AuthService URL
    changeOrigin: true,
}));

app.use('/auth/register', createProxyMiddleware({
    target: 'http://localhost:3001/auth/register', // AuthService URL
    changeOrigin: true,
}));
  

// Proxy configuration for Service 2

// Optional: A default route for the gateway itself
app.get('/', (req, res) => {
    res.send('Welcome to the API Gateway!');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`API Gateway listening on port ${PORT}`);
});
