import express from 'express';
import userRoutes from '../routes/user.js';
import profileRoutes from '../routes/profile.js';
import authRoutes from '../routes/auth.js';
import {auth} from '../../middleware/auth.js';

const app = express();

app.use('/auth', authRoutes);
app.use('/users',auth, userRoutes);
app.use('/profile',auth, profileRoutes);

export default app;