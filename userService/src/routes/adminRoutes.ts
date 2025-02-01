import { Router } from "express";



import AdminController from "../controllers/AdminController";
const router=Router()

let adminController=new AdminController()

router.post('/addDepartment',adminController.createDepartment.bind(adminController))
router.get('/department', adminController.getAllDepartments.bind(adminController));
router.get('/users', adminController.getAllUsers.bind(adminController));
router.get('/blockUser/:email', adminController.blockUser.bind(adminController));





// Fetch department by ID
router.get('/editDepartment/:departmentName', adminController.getDepartmentByName.bind(adminController));
router.put('/editDepartment/:departmentName', adminController.updateDepartment.bind(adminController));





const adminRoutes=router
export default adminRoutes ;