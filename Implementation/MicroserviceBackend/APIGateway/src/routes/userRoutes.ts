import { Router } from "express";
import axios from "axios";

const router = Router();

router.get("/users/full/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    // 🔗 Adjust these URLs to match your service URLs
    const [userRes, authRes] = await Promise.all([
      axios.get(`http://localhost:3002/users/${userId}`),  // User Service
      axios.get(`http://localhost:3001/auth/${userId}`),   // Auth Service
    ]);

    console.log(authRes);

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

export default router;
