import { Router } from 'express';
const router = Router();
import { RequestOtp,verifyOtpAPIs,requestRegisterEmailOtp,requestEmailOtp,verifyOtpByEmail,requestEmailLoginOtp, verifyOtp, logout, mobileLogin, verifyMobileOtp, registerUser, loginWithPassword, resetPassword, changePassword} from '../Controllers/authController.js';
import { auth } from '../../middleware/auth.js';

router.post('/request-otp', RequestOtp);
router.post('/verify-otp', verifyOtp);
router.post('/verify-otp-auth', verifyOtpAPIs);
router.post('/verify-otp-email-auth', verifyOtpByEmail);
router.post('/login', loginWithPassword); 
router.post('/logout',auth, logout);
router.post('/register', registerUser);
router.post('/reset-password', resetPassword);
router.post('/change-password', changePassword);
router.post('/request-email-otp', requestEmailOtp);
router.post('/request-register-otp', requestRegisterEmailOtp);
router.post('/request-email-login-otp', requestEmailLoginOtp);

// mobile routes
router.post('/mobile/request-otp', mobileLogin);
router.post('/mobile/verify-otp', verifyMobileOtp);


export default router;
