import { userController } from "../config/dependencyInjector";
import { Router } from "express";
import upload from "../helpers/multer";
import authenticateToken from "../helpers/UserAuthRoutes";

import { IsUser } from "../middleware/RoleBasedAuth";
import { IsUserBlocked } from "../middleware/blockedUsers";

const router = Router();

// Home Page doctor and dept list
router.get("/banner_list", userController.findAllBanners.bind(userController));
router.get("/doctor_list", userController.findAllDoctors.bind(userController));
router.get("/department_list",userController.findAllDepartment.bind(userController));

router.post(
  "/profile/updateProfile",
  IsUser,
  authenticateToken,
  upload.single("profilePicture"),
  userController.updateProfile.bind(userController)
);

// profile
router.get(
  "/:email",
  IsUser,
  authenticateToken,
  userController.getUser.bind(userController)
);

// For Doctor Details Page
router.get(
  "/doctor_details/:email",
  IsUser,
  authenticateToken,
  userController.getDoctorDetails.bind(userController)
);

// change - password
router.put(
  "/profile/change-password",
  IsUser,
  authenticateToken,
  userController.updatePassword.bind(userController)
);

// edit- profile

// payment :

router.post(
  "/payment-success",
  IsUser,
  authenticateToken,
  userController.paymentSuccess.bind(userController)
);
router.get(
  "/payment-success/:txnid",
  IsUser,
  authenticateToken,
  userController.getAppointmentDetails.bind(userController)
);
router.post(
  "/payment-failure/",
  IsUser,
  authenticateToken,
  userController.paymentFailure.bind(userController)
);

router.get(
  "/appointments/:email",
  IsUser,
  authenticateToken,
  IsUserBlocked ,
  userController.getAllAppointmentDetails.bind(userController)
);
router.get(
  "/appointmentData/:email",
  IsUser,
  authenticateToken,
  IsUserBlocked ,
  userController.getAppointment.bind(userController)
);

const userRoutes = router;
export default userRoutes;
