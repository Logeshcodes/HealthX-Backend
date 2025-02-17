import { userController } from "../config/dependencyInjector";
import { Router } from "express";
import upload from "../helpers/multer";
import authenticateToken from "../middleware/AuthenticatedRoutes";

import { IsUser } from "../middleware/RoleBasedAuth";
import { IsUserBlocked } from "../middleware/blockedUsers";

const router=Router()

// Home Page doctor and dept list
router.get('/doctor_list' , userController.findAllDoctors.bind(userController))
router.get('/department_list', userController.findAllDepartment.bind(userController))


router.post('/profile/updateProfile', IsUser , authenticateToken,upload.single('profilePicture'),userController.updateProfile.bind(userController))



// profile
router.get('/:email', IsUser, authenticateToken,userController.getUser.bind(userController));

 // For Doctor Details Page
router.get('/doctor_details/:email', IsUser, authenticateToken,userController.getDoctorDetails.bind(userController));

// change - password
router.put('/profile/change-password', IsUser, authenticateToken,userController.updatePassword.bind(userController))

// edit- profile


const userRoutes=router
export default userRoutes