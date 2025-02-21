import { DoctorController } from "../controllers/DoctorController";
import { Router } from "express";
import upload from "../helpers/multer";
import authenticateToken from "../helpers/DoctorAuthRoutes";
import { IsDoctor } from "../middleware/RoleBasedAuth";
import { doctorController } from "../config/dependencyInjector";
const router=Router()


router.put('/profile/edit-profile',upload.single('profilePicture'),doctorController.updateProfile.bind(doctorController))
router.put('/profile/change-password',doctorController.updatePassword.bind(doctorController))


router.get('/getDoctors',doctorController.getDoctors.bind(doctorController))
router.get('/blockDoctor/:email',doctorController.blockDoctor.bind(doctorController))
router.get('/:email',doctorController.getDoctor.bind(doctorController))

router.get('/appointments/:email' , doctorController.getAllAppointmentDetails.bind(doctorController))


const doctorRoutes=router
export default doctorRoutes ;