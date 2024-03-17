import express from 'express';
const router = express.Router();

import JwtMiddleware from '../middleware/JwtMiddleware.js';
import {getAllFingerprints, postFingerprint } from '../controllers/FingerprintController.js';

router.get('/getallfingerprints',JwtMiddleware, getAllFingerprints);
router.post('/postfingerprint',JwtMiddleware, postFingerprint);

export default router;