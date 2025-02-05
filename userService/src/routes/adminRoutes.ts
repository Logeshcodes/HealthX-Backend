import { Router } from "express";

import AdminController from "../controllers/AdminController";
import authenticateToken from "../middleware/AuthenticatedRoutes";
import { IsAdmin } from "../middleware/RoleBasedAuth";
const router=Router()

let adminController=new AdminController()

router.post('/addDepartment',IsAdmin , authenticateToken,adminController.createDepartment.bind(adminController))
router.get('/department', IsAdmin, authenticateToken, adminController.getAllDepartments.bind(adminController));
router.get('/users',IsAdmin,authenticateToken , adminController.getAllUsers.bind(adminController));
router.get('/blockUser/:email',IsAdmin, authenticateToken , adminController.blockUser.bind(adminController));





// Fetch department by ID
router.get('/editDepartment/:departmentName',IsAdmin,authenticateToken ,  adminController.getDepartmentByName.bind(adminController));
router.put('/editDepartment/:departmentName',IsAdmin,authenticateToken , adminController.updateDepartment.bind(adminController));





const adminRoutes=router
export default adminRoutes ;