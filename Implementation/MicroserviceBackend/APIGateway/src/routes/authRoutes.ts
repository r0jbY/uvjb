import express from 'express';
import forwardRequest from '../utils/forwardRequest'; // (we will create this file in step 3)
import { verifyJwt } from '../middleware/jwtMiddleware';
const router = express.Router();

// Auth routes
router.post('/auth/login', (req, res) => {
    forwardRequest(req, res, 'http://localhost:3001/auth/login');
});

router.post('/auth/logout', (req, res) => {
    forwardRequest(req, res, 'http://localhost:3001/auth/logout');
});

router.post('/auth/register', verifyJwt, (req, res) => {
    forwardRequest(req, res, 'http://localhost:3001/auth/register');
});

router.get('/auth/whoAmI', verifyJwt, (req, res) => {
    forwardRequest(req, res, 'http://localhost:3001/auth/whoAmI');
});

export default router;