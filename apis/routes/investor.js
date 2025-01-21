import { Router } from 'express';
const router = Router();
import { getAllUsersWithInvestments, getUserWithInvestmentsById } from '../Controllers/investorController.js';

// Routes
router.get('/', getAllUsersWithInvestments);
router.get('/dashbord', getUserWithInvestmentsById)

export default router;
