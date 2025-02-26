import { Router } from "express";
import upload from "../helpers/multer";
import authenticateToken from "../helpers/DoctorAuthRoutes";
import { IsDoctor } from "../middleware/RoleBasedAuth";
import { doctorController } from "../config/dependencyInjector";
import { IsDoctorBlocked } from "../middleware/blockedUsers";
const router = Router();

router.put(
  "/profile/edit-profile",
  IsDoctor,
  authenticateToken,
  upload.single("profilePicture"),
  doctorController.updateProfile.bind(doctorController)
);

router.put(
  "/profile/change-password",
  IsDoctor,
  authenticateToken,
  doctorController.updatePassword.bind(doctorController)
);

router.get(
  "/getDoctors",
  IsDoctor,
  authenticateToken,
  doctorController.getDoctors.bind(doctorController)
);
router.get(
  "/blockDoctor/:email",
  IsDoctor,
  authenticateToken,
  doctorController.blockDoctor.bind(doctorController)
);
router.get(
  "/:email",
  IsDoctor,
  authenticateToken,
  doctorController.getDoctor.bind(doctorController)
);

router.get(
  "/appointments/:email",
  IsDoctor,
  authenticateToken,
  IsDoctorBlocked ,
  doctorController.getAllAppointmentDetails.bind(doctorController)
);
router.get(
  "/appointmentData/:email",
  IsDoctor,
  authenticateToken,
  IsDoctorBlocked ,
  doctorController.getAppointment.bind(doctorController)
);

const doctorRoutes = router;
export default doctorRoutes;
