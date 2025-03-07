import { Router } from "express";
import { userController } from "../config/dependencyInjector";

let router=Router()

router.post('/signup',userController.userSignUp.bind(userController))
router.post('/verify_otp', userController.createUser.bind(userController))
router.post('/resendOtp',userController.resendOtp.bind(userController))
router.post('/googleLogin',userController.doGoogleLogin.bind(userController))
router.post('/login',userController.login.bind(userController))
router.post('/logout',userController.logout.bind(userController))
router.post('/verifyEmail',userController.verifyEmail.bind(userController))
router.post('/verifyResetOtp',userController.verifyResetOtp.bind(userController))
router.post('/resetPassword',userController.resetPassword.bind(userController))
router.post('/forgotResendOtp',userController.forgotResendOtp.bind(userController))


const userRoutes = router
export default userRoutes;