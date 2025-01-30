import UserController from "../controllers/UserController";
import { Router } from "express";
import upload from "../helpers/multer";
const router=Router()
let userController=new UserController()

router.patch('/updateProfile',upload.single('profile'),userController.updateProfile.bind(userController))
router.patch('/updatePassword',userController.updatePassword.bind(userController))


router.get('/getUsers',userController.getUsers.bind(userController))
router.get('/blockStudent/:email',userController.blockUser.bind(userController))
// router.get('/:email',userController.getUser.bind(userController))

router.get('/doctor_list',userController.findAllDoctors.bind(userController))

// router.get('/doctor_details:doctorId',userController.getDoctorDetails.bind(userController))



const userRoutes=router
export default userRoutes