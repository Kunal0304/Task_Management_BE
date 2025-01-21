import { Router } from 'express';
import {getProfile} from '../Controllers/profileController.js'
const router = Router();

// Routes
router.get('/', getProfile);

export default router;
