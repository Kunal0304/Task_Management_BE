import { Router } from 'express';
const router = Router();
import { createUser,createBulkUsers,updateUserConfigKey, getAllUsers,verifyLead, getUserById, updateUserById, deleteUserById, getUsersByRole } from '../Controllers/UserController.js';

// Routes
router.post('/', createUser);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/docs', updateUserConfigKey);
router.put('/:id', updateUserById);
router.delete('/:id', deleteUserById);
router.post('/verify/:id', verifyLead);
router.post('/import', createBulkUsers)
router.get('/role/:role', getUsersByRole);

export default router;
