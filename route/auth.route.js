import express from 'express';
import authController from '../controller/auth.controller.js';
const router = express.Router()
router.route('/auth/signup').post(authController.signUp)
router.route('/auth/signin').post(authController.signIn)
router.route('/auth/forget-password').post(authController.forgetPassword)
router.route('/auth/reset-password').post(authController.resetPassword)
export default router