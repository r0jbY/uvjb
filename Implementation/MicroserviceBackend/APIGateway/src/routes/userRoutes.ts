import { Router } from "express";
import axios from "axios";
import forwardRequest from "../utils/forwardRequest";
import { verifyJwt } from '../middleware/jwtMiddleware';
import catchAsync from '../utils/catchAsync';

const router = Router();

// ✅ Routes accessible to 'buddy' (or higher)
router.get('/users/full/:id', verifyJwt('buddy'), catchAsync(async (req, res) => {
  const userId = req.params.id;
  const cookies = req.headers.cookie || '';

  const [userRes, authRes] = await Promise.all([
    axios.get(`${process.env.USER_SERVICE_URL}/users/${userId}`, {
      headers: {...req.headers, Cookie: cookies },
      withCredentials: true,
    }),
    axios.get(`${process.env.AUTH_SERVICE_URL}/auth/${userId}`, {
      headers: {...req.headers, Cookie: cookies },
      withCredentials: true,
    }),
  ]);

  const fullUser = {
    ...userRes.data,
    email: authRes.data.email,
    role: authRes.data.role,
  };

  res.status(200).json(fullUser);
}));

router.put('/users/update/:id', verifyJwt('buddy'), catchAsync((req, res, next) => {
  const { id } = req.params;
  return forwardRequest(req, res, next, `${process.env.AUTH_SERVICE_URL}/auth/update/${id}`);
}));

// ✅ Admin-only routes
router.get('/users/getAll', verifyJwt('admin'), catchAsync((req, res, next) =>
  forwardRequest(req, res, next, `${process.env.USER_SERVICE_URL}/users/getAll`)));

router.get('/users/search', verifyJwt('admin'), catchAsync((req, res, next) =>
  forwardRequest(req, res, next, `${process.env.USER_SERVICE_URL}/users/search`)));

router.get('/users/searchSuperbuddies', verifyJwt('admin'), catchAsync((req, res, next) =>
  forwardRequest(req, res, next, `${process.env.AUTH_SERVICE_URL}/auth/superbuddies`)));

router.delete('/users/delete/:id', verifyJwt('admin'), catchAsync((req, res, next) => {
  const { id } = req.params;
  return forwardRequest(req, res, next, `${process.env.AUTH_SERVICE_URL}/auth/delete/${id}`);
}));

export default router;
