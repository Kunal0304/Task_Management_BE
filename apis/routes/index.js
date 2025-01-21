import express from 'express';
import userRoutes from '../routes/user.js';
import investmentRoutes from '../routes/investment.js';
import transactionRoutes from '../routes/transaction.js';
import profileRoutes from '../routes/profile.js';
import authRoutes from '../routes/auth.js';
import investorRoutes from '../routes/investor.js';
import withdrawRoutes from '../routes/withdraw.js';
import {auth} from '../../middleware/auth.js';
import contactDetailRoutes from '../routes/contactDetail.js';

const app = express();

app.use('/auth', authRoutes);
app.use('/users',auth, userRoutes);
app.use('/profile',auth, profileRoutes);
app.use('/investor',auth, investorRoutes);
app.use('/withdraw',auth, withdrawRoutes);
app.use('/investments', auth, investmentRoutes);
app.use('/transactions', auth, transactionRoutes);
app.use('/contactdetail', contactDetailRoutes);

export default app;