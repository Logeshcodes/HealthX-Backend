import { Router } from "express";
import { doctorController } from "../config/dependencyInjector";

let router=Router()

router.post('/googleLogin',doctorController.doGoogleLogin.bind(doctorController))
router.post('/register',doctorController.doctorSignUp.bind(doctorController))
router.post('/verify_otp', doctorController.createUser.bind(doctorController))
router.post('/createUser',doctorController.createUser.bind(doctorController))
router.post('/login',doctorController.login.bind(doctorController))
router.post('/logout',doctorController.logout.bind(doctorController))
router.post('/resendOtp',doctorController.resendOtp.bind(doctorController))
router.post('/verifyEmail',doctorController.verifyEmail.bind(doctorController))
router.post('/resetPassword',doctorController.resetPassword.bind(doctorController))
router.post('/verifyResetOtp',doctorController.verifyResetOtp.bind(doctorController))  
router.post('/forgotResendOtp',doctorController.forgotResendOtp.bind(doctorController))  

const userRoutes = router
export default userRoutes;