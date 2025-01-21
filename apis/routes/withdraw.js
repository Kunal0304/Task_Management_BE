import { Router } from 'express';
const router = Router();
import { createWithdraw, getAllWithdraws, getWithdrawById, updateWithdrawById, deleteWithdrawById, getWithdrawsByUserId, getWithdrawsCurrentMonth, getWithdrawsCurrentMonthByUserId } from '../Controllers/withdrawController.js';

// Routes
router.post('/', createWithdraw);
router.get('/', getAllWithdraws);
router.get('/:id', getWithdrawById);
router.get('/user/:userId', getWithdrawsByUserId);
router.get('/month/current', getWithdrawsCurrentMonth);  
router.get('/month/current/:type', getWithdrawsCurrentMonthByUserId); 
router.put('/:id', updateWithdrawById);
router.delete('/:id', deleteWithdrawById);

export default router;
