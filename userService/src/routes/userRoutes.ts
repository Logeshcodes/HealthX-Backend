import UserController from "../controllers/UserController";
import { Router } from "express";
import upload from "../helpers/multer";
import authenticateToken from "../middleware/AuthenticatedRoutes";

import { IsUser } from "../middleware/RoleBasedAuth";


const router=Router()
let userController=new UserController()

router.patch('/updateProfile',upload.single('profile'),userController.updateProfile.bind(userController))
router.patch('/updatePassword',userController.updatePassword.bind(userController))


router.get('/getUsers',userController.getUsers.bind(userController))


router.get('/doctor_list' , authenticateToken , IsUser, userController.findAllDoctors.bind(userController))




const userRoutes=router
export default userRoutes