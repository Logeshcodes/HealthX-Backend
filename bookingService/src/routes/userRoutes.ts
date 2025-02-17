
import { Router } from "express";

import { userController } from "../config/dependencyInjector";


const router = Router()


// router.post('/slotBooking', userController.slotBooking.bind(userController))
router.get('/slotBooking/:email', userController.getSlotBooking.bind(userController))



const userRoutes = router ;

export default userRoutes ;