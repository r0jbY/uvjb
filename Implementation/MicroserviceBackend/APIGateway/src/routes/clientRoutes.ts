import { Router } from "express";
import axios from "axios";
import forwardRequest from "../utils/forwardRequest";
import { verifyJwt } from '../middleware/jwtMiddleware';
import catchAsync from '../utils/catchAsync'; // ✅ Import your catchAsync helper

const router = Router();

router.use(verifyJwt); // ✅ Protect all routes

router.get("/clients/full/:id", catchAsync(async (req, res) => {
  const clientId = req.params.id;
  const cookies = req.headers.cookie || "";

  // Fetch client info from ClientService
  const clientRes = await axios.get(`http://localhost:3003/clients/${clientId}`, {
    headers: { Cookie: cookies },
    withCredentials: true,
  });

  const clientData = clientRes.data;

  // Fetch superbuddy email from AuthService
  const buddyRes = await axios.get(`http://localhost:3001/auth/${clientData.superbuddyId}`, {
    headers: { Cookie: cookies },
    withCredentials: true,
  });

  const fullClient = {
    ...clientData,
    superbuddyEmail: buddyRes.data.email,
  };

  res.status(200).json(fullClient);
}));

router.put('/clients/update/:id', catchAsync((req, res, next) => {
  const { id } = req.params;
  return forwardRequest(req, res, next, `http://localhost:3003/clients/update/${id}`);
}));

router.post('/clients/register', verifyJwt, catchAsync((req, res, next) => forwardRequest(req, res, next, 'http://localhost:3003/clients/create')));

router.get('/clients/getAll', catchAsync((req, res, next) => {
    console.log("Route");
  return forwardRequest(req, res, next, 'http://localhost:3003/clients/getAll');
}));

router.get('/clients/search', catchAsync((req, res, next) => {
  return forwardRequest(req, res, next, 'http://localhost:3003/clients/search');
}));

router.delete('/clients/delete/:id', catchAsync((req, res, next) => {
  const { id } = req.params;
  return forwardRequest(req, res, next, `http://localhost:3003/clients/delete/${id}`);
}));

router.get("/clients/:id", catchAsync(async (req, res, next) => {
    const { id } = req.params;
    return forwardRequest(req, res, next, `http://localhost:3003/clients/${id}`);
}));



export default router;
