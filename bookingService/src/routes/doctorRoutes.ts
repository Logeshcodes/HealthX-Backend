
import { Router } from "express";

import { doctorController } from "../config/dependencyInjector";


const router = Router()


router.post('/slotBooking', doctorController.slotBooking.bind(doctorController))
router.get('/slotBooking/:email', doctorController.getSlotBooking.bind(doctorController))
router.delete('/slotBooking/:id', doctorController.deleteSlot.bind(doctorController));



const doctorRoutes = router ;

export default doctorRoutes ;