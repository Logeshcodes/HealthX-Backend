import UserController from "../controllers/UserController";
import { Router } from "express";
import upload from "../helpers/multer";
import authenticateToken from "../middleware/AuthenticatedRoutes";

import { IsUser } from "../middleware/RoleBasedAuth";


const router=Router()
let userController=new UserController()




// router.get('/getUsers',userController.getUsers.bind(userController))

router.post('/profile/updateProfile',upload.single('profilePicture'),userController.updateProfile.bind(userController))

router.get('/doctor_list' , userController.findAllDoctors.bind(userController))

// profile
router.get('/:email',userController.getUser.bind(userController))
// change - password
router.put('/profile/change-password',userController.updatePassword.bind(userController))

// edit- profile


const userRoutes=router
export default userRoutes