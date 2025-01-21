import { Router } from 'express';
const router = Router();
import { addInvestment,getVisibleInvestments,getUserTotalInterestAmount,getVisibleInvestmentsAll,getVisibleUserInvestmentsAmount, getAllInvestment,getInvestmentByUserId, getInvestmentById , updateInvestment, deleteInvestment} from '../Controllers/investmentController.js';
import { requireInvestorRole } from '../../middleware/roleMiddleware.js';

// Routes
router.use(requireInvestorRole);

router.post('/', addInvestment);
router.get('/', getAllInvestment);
router.get('/:id', getInvestmentById);
router.put('/:id', updateInvestment);
router.delete('/:id', deleteInvestment);
router.get('/user/totalInterest', getUserTotalInterestAmount);
router.get('/user/totalcapital', getVisibleUserInvestmentsAmount);
router.get('/user/:uid', getInvestmentByUserId);
router.get('/capital/all', getVisibleInvestmentsAll);
router.get('/capital/:userId', getVisibleInvestments);


export default router;
