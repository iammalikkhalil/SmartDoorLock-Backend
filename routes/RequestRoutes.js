import express from 'express';
const router = express.Router();

import JwtMiddleware from '../middleware/JwtMiddleware.js';
import { getAllRequests, postRequest, updateStatus} from '../controllers/RequestController.js';

router.get('/getallrequests',JwtMiddleware, getAllRequests);
router.post('/postrequest',JwtMiddleware, postRequest);
router.put('/updatestatus',JwtMiddleware, updateStatus);


export default router;