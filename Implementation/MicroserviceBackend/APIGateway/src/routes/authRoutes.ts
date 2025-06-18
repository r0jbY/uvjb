import express from 'express';
import forwardRequest from '../utils/forwardRequest'; // (we will create this file in step 3)
import { verifyJwt } from '../middleware/jwtMiddleware';
import catchAsync from '../utils/catchAsync';
const router = express.Router();

// Auth routes

router.post("/refresh", catchAsync((req, res, next) => forwardRequest(req, res, next, `${process.env.AUTH_SERVICE_URL}/auth/refresh`)));

router.post('/login', catchAsync((req, res, next) =>
    forwardRequest(req, res, next, `${process.env.AUTH_SERVICE_URL}/auth/login`)));

router.post('/logout', catchAsync((req, res, next) =>
    forwardRequest(req, res, next, `${process.env.AUTH_SERVICE_URL}/auth/logout`)));

router.post('/register', verifyJwt('admin'), catchAsync((req, res, next) =>
    forwardRequest(req, res, next, `${process.env.AUTH_SERVICE_URL}/auth/register`)));

router.get('/whoAmI', verifyJwt('admin'), catchAsync((req, res, next) =>
    forwardRequest(req, res, next, `${process.env.AUTH_SERVICE_URL}/auth/whoAmI`)));



export default router;