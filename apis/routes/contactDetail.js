import { Router } from 'express';
const router = Router();
import { createContactDetail, getAllContactDetails } from '../Controllers/contactDetailController.js';

// Routes
router.post('/', createContactDetail);
router.get('/', getAllContactDetails);

export default router;
