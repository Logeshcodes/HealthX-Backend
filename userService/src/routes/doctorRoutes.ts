import { DoctorController } from "../controllers/DoctorController";
import { Router } from "express";
import upload from "../helpers/multer";
const router=Router()
let doctorController=new DoctorController()

router.patch('/updateProfile',upload.single('profile'),doctorController.updateProfile.bind(doctorController))
router.patch('/updatePassword',doctorController.updatePassword.bind(doctorController))


router.get('/getDoctors',doctorController.getDoctors.bind(doctorController))
router.get('/blockDoctor/:email',doctorController.blockDoctor.bind(doctorController))
router.get('/:email',doctorController.getDoctor.bind(doctorController))


const doctorRoutes=router
export default doctorRoutes ;