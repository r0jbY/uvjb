import express from 'express';
import forwardRequest from '../utils/forwardRequest'; // (we will create this file in step 3)
import { verifyJwt } from '../middleware/jwtMiddleware';
import catchAsync from '../utils/catchAsync';
import errorHandler from '../middleware/errorHandler';
const router = express.Router();

// Auth routes
router.post('/auth/login', catchAsync((req, res, next) => forwardRequest(req, res, next, 'http://localhost:3001/auth/login')));

router.post('/auth/logout', catchAsync((req, res, next) => forwardRequest(req, res, next, 'http://localhost:3001/auth/logout')));

router.post('/auth/register', verifyJwt, catchAsync((req, res, next) => forwardRequest(req, res, next, 'http://localhost:3001/auth/register')));

router.get('/auth/whoAmI', verifyJwt, catchAsync((req, res, next) => forwardRequest(req, res, next, 'http://localhost:3001/auth/whoAmI')));

router.use(errorHandler);

export default router;