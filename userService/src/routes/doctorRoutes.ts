import { DoctorController } from "../controllers/DoctorController";
import { Router } from "express";
import upload from "../helpers/multer";
import authenticateToken from "../middleware/AuthenticatedRoutes";
import { IsDoctor } from "../middleware/RoleBasedAuth";
const router=Router()
let doctorController=new DoctorController()

router.put('/profile/edit-profile',upload.single('profile'),doctorController.updateProfile.bind(doctorController))
router.put('/profile/change-password',doctorController.updatePassword.bind(doctorController))


router.get('/getDoctors',doctorController.getDoctors.bind(doctorController))
router.get('/blockDoctor/:email',doctorController.blockDoctor.bind(doctorController))
router.get('/:email',doctorController.getDoctor.bind(doctorController))



const doctorRoutes=router
export default doctorRoutes ;