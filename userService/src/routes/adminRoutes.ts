import { Router } from "express";
import upload from "../helpers/multer";
import AdminController from "../controllers/AdminController";
import authenticateToken from "../helpers/AdminAuthRoutes";
import { IsAdmin } from "../middleware/RoleBasedAuth";
import { adminController } from "../config/dependencyInjector";
const router = Router();

router.get(
  "/blockUser/:email",
  IsAdmin,
  authenticateToken,
  adminController.blockUser.bind(adminController)
);
router.get(
  "/blockDoctor/:email",
  IsAdmin,
  authenticateToken,
  adminController.blockDoctor.bind(adminController)
);
router.get(
  "/listBanner/:id",
  IsAdmin,
  authenticateToken,
  adminController.listBanner.bind(adminController)
);

router.post(
  "/addDepartment",
  IsAdmin,
  authenticateToken,
  adminController.createDepartment.bind(adminController)
);
router.get(
  "/department",
  IsAdmin,
  authenticateToken,
  adminController.getAllDepartments.bind(adminController)
);
router.get(
  "/users",
  IsAdmin,
  authenticateToken,
  adminController.getAllUsers.bind(adminController)
);
router.get(
  "/getDoctors",
  IsAdmin,
  authenticateToken,
  adminController.getAllDoctors.bind(adminController)
);

router.get(
  "/getAdminData",
  IsAdmin,
  authenticateToken,
  adminController.getAdminData.bind(adminController)
);

router.post(
  "/rejectDocuments/:email",
  IsAdmin,
  authenticateToken,
  adminController.rejectDocuments.bind(adminController)
);
router.post(
  "/approveDocuments/:email",
  IsAdmin,
  authenticateToken,
  adminController.approveDocuments.bind(adminController)
);

// Fetch department by ID
router.get(
  "/editDepartment/:departmentName",
  IsAdmin,
  authenticateToken,
  adminController.getDepartmentByName.bind(adminController)
);
router.put(
  "/editDepartment/:departmentName",
  IsAdmin,
  authenticateToken,
  adminController.updateDepartment.bind(adminController)
);

router.get(
  "/getDoctorByEmail/:email",
  IsAdmin,
  authenticateToken,
  adminController.getDoctorByEmail.bind(adminController)
);

router.get(
  "/banner",
  IsAdmin,
  authenticateToken,
  adminController.getAllBanner.bind(adminController)
);
router.post(
  "/banner",
  IsAdmin,
  authenticateToken,
  upload.single("bannerImage"),
  adminController.addBanner.bind(adminController)
);

router.get(
  "/editBanner/:id",
  IsAdmin,
  authenticateToken,
  adminController.getBannerById.bind(adminController)
);
router.put(
    "/editBanner/:id",
    authenticateToken,  
    IsAdmin,            
    upload.single("bannerImage"), 
    adminController.updateBanner.bind(adminController) 
  );
  


  router.get(
    "/getAllReports",
    IsAdmin,
    authenticateToken,
    adminController.getAllReport.bind(adminController)
  );

const adminRoutes = router;
export default adminRoutes;
