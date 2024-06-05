import express from 'express';
const router = express.Router();

import JwtMiddleware from '../middleware/JwtMiddleware.js';
import { getAllRoles, postRole } from '../controllers/RoleController.js';

router.get('/getallroles', JwtMiddleware, getAllRoles);
router.post('/postrole', JwtMiddleware, postRole);

export default router;