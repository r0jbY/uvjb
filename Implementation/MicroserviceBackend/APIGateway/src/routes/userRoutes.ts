import { Router } from "express";
import axios from "axios";
import forwardRequest from "../utils/forwardRequest";
import { verifyJwt } from '../middleware/jwtMiddleware';

const router = Router();

router.use(verifyJwt);

router.get("/users/full/:id", async (req, res) => {
  const userId = req.params.id;
  const cookies = req.headers.cookie || '';

  try {
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
  } catch (error: any) {
    console.error("Error fetching user data:", error?.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch full user data." });
  }
});

router.put('/users/update/:id', (req, res) => {
  const { id } = req.params;
  forwardRequest(req, res, `http://localhost:3001/auth/update/${id}`);
});

router.get('/users/getAll', (req, res) => {
  forwardRequest(req, res, 'http://localhost:3002/users/getAll');
});

router.get('/users/search', (req, res) => {
  forwardRequest(req, res, 'http://localhost:3002/users/search');
});

export default router;
