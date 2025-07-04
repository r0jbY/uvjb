import { Router } from "express";
import axios from "axios";
import forwardRequest from "../utils/forwardRequest";
import { verifyJwt } from '../middleware/jwtMiddleware';
import catchAsync from '../utils/catchAsync'; // ✅ Import your catchAsync helper

const router = Router();

router.use(verifyJwt('admin')); // ✅ Protect all routes

router.get('/full/:id', catchAsync(async (req, res) => {
  const clientId = req.params.id;
  const cookies = req.headers.cookie || "";


  const clientRes = await axios.get(`${process.env.CLIENT_SERVICE_URL}/clients/${clientId}`, {
    headers: {...req.headers, Cookie: cookies },
    withCredentials: true,
  });


  const clientData = clientRes.data;

  const buddyRes = await axios.get(`${process.env.AUTH_SERVICE_URL}/auth/${clientData.superbuddyId}`, {
    headers: {...req.headers, Cookie: cookies },
    withCredentials: true,
  });

  const fullClient = {
    ...clientData,
    superbuddyEmail: buddyRes.data.email,
  };

  res.status(200).json(fullClient);
}));

router.put('/update/:id', catchAsync((req, res, next) => {
  const { id } = req.params;
  return forwardRequest(req, res, next, `${process.env.CLIENT_SERVICE_URL}/clients/update/${id}`);
}));

router.post('/register', catchAsync((req, res, next) =>
  forwardRequest(req, res, next, `${process.env.CLIENT_SERVICE_URL}/clients/create`)));


router.get('/getAll', catchAsync((req, res, next) =>
  forwardRequest(req, res, next, `${process.env.CLIENT_SERVICE_URL}/clients/getAll`)));

router.get('/search', catchAsync((req, res, next) =>
  forwardRequest(req, res, next, `${process.env.CLIENT_SERVICE_URL}/clients/search`)));

router.delete('/delete/:id', catchAsync((req, res, next) => {
  const { id } = req.params;
  return forwardRequest(req, res, next, `${process.env.CLIENT_SERVICE_URL}/clients/delete/${id}`);
}));

router.get('/:id', catchAsync((req, res, next) => {
  const { id } = req.params;
  return forwardRequest(req, res, next, `${process.env.CLIENT_SERVICE_URL}/clients/${id}`);
}));




export default router;
