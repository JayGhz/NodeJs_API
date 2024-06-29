import express from 'express';
import { register } from '../controllers/auth.controller';

const router = express.Router();

router.post('/signup', register);
router.post('/signin');

export default router;