import { Router } from "express";
import { adminController } from "../config/dependencyInjector";
import { IsAdmin } from "../middlewares/RoleBasedAuth";
import authenticateToken from "../middlewares/UserAuthRoutes";

const router = Router();


router.get("/totalappointments",IsAdmin,authenticateToken,adminController.totalAppointmentDetails.bind(adminController));
router.get("/generateRevenueData",IsAdmin,authenticateToken,adminController.generateRevenueData.bind(adminController));

const adminRoutes = router;

export default adminRoutes;
