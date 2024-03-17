import express from 'express';
const router = express.Router();

import { getAllUsers, login, getOtp, postUser, updateStatus } from '../controllers/UserController.js';
import ImageUploader from '../middleware/ImageUploader.js';
import JwtMiddleware from '../middleware/JwtMiddleware.js';


router.get('/getallusers',JwtMiddleware, getAllUsers);
router.post('/login', login);
router.post('/getotp', getOtp);
router.put('/updatestatus',JwtMiddleware, updateStatus);
router.post('/postuser', ImageUploader, postUser);

export default router;
