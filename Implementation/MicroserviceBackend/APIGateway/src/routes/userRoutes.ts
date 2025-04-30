import { Router } from "express";
import axios from "axios";
import forwardRequest from "../utils/forwardRequest";
import { verifyJwt } from '../middleware/jwtMiddleware';
import catchAsync from '../utils/catchAsync'; // ✅ Import your catchAsync helper

const router = Router();

router.use(verifyJwt); // ✅ Protect all routes

// ✅ Full User (custom handling)
router.get("/users/full/:id", catchAsync(async (req, res) => {
  const userId = req.params.id;
  const cookies = req.headers.cookie || '';

  const [userRes, authRes] = await Promise.all([
    axios.get(`http://localhost:3002/users/${userId}`, {
      headers: { Cookie: cookies },
      withCredentials: true,
    }),
    axios.get(`http://localhost:3001/auth/${userId}`, {
      headers: { Cookie: cookies },
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

// ✅ Forwarded requests (using catchAsync to forward errors too)
router.put('/users/update/:id', catchAsync((req, res, next) => {
  const { id } = req.params;
  return forwardRequest(req, res, next, `http://localhost:3001/auth/update/${id}`);
}));

router.get('/users/getAll', catchAsync((req, res, next) => {
  return forwardRequest(req, res, next, 'http://localhost:3002/users/getAll');
}));

router.get('/users/search', catchAsync((req, res, next) => {
  return forwardRequest(req, res, next, 'http://localhost:3002/users/search');
}));

router.delete('/users/delete/:id', catchAsync((req, res, next) => {
  const { id } = req.params;
  return forwardRequest(req, res, next, `http://localhost:3001/auth/delete/${id}`);
}));

export default router;
