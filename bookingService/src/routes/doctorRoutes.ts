
import { Router } from "express";

import { doctorController } from "../config/dependencyInjector";

import { IsDoctor } from "../middlewares/RoleBasedAuth";
import authenticateToken from "../middlewares/UserAuthRoutes";
import { IsDoctorBlocked } from "../middlewares/blockedUsers";

const router = Router()


router.post('/slotBooking', doctorController.slotBooking.bind(doctorController))
router.get('/slotBooking/:email', doctorController.getSlotBooking.bind(doctorController))
router.delete('/slotBooking/:id', doctorController.deleteSlot.bind(doctorController));

router.get(
    "/appointments/:id",
    // IsDoctor,
    // authenticateToken,
    // IsDoctorBlocked ,
    doctorController.getAllAppointmentDetails.bind(doctorController)
  );
  router.get(
    "/appointmentData/:id",
    // IsDoctor,
    // authenticateToken,
    // IsDoctorBlocked ,
    doctorController.getAppointment.bind(doctorController)
  );



const doctorRoutes = router ;

export default doctorRoutes ;