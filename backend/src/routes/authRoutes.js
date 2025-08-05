import express from 'express'
import userAuth from '../middleware/userAuth.js'
import { isAuthenticated, loginUser, logoutUser, registerUser, resetPassword, sendResetOtp, sendVerifyOtp, verifyEmail } from '../controllers/authController.js';


const authRouter = express.Router();

authRouter.post('/signup',registerUser)
authRouter.post('/login',loginUser)
authRouter.post('/logout',logoutUser)
authRouter.post('/send-verify-otp', userAuth ,sendVerifyOtp)
authRouter.post('/verify-email', userAuth,verifyEmail)
authRouter.post('/is-auth', userAuth, isAuthenticated)
authRouter.post('/send-reset-otp', sendResetOtp)
authRouter.post('/reset-password',resetPassword)


export default authRouter;