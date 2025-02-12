import { IUserController } from "../controllers/interface/IUserController";
import { IDoctorController } from "../controllers/interface/IDoctorController";
import { IAdminController } from "../controllers/interface/IAdminController";

import UserController from "../controllers/UserController";
import { DoctorController } from "../controllers/DoctorController";
import AdminController from "../controllers/AdminController";

import { IUserService } from "../services/interface/IUserService";
import { IDoctorService } from "../services/interface/IDoctorService";
import { IAdminService } from "../services/interface/IAdminservice";

import UserServices from "../services/userServices";
import { DoctorServices } from "../services/doctorServices";
import AdminService from "../services/adminServices";

import { IUserRepository } from "../respostories/interface/IUserRepository";
import { IDoctorRepository } from "../respostories/interface/IDoctorRepository";
import { IAdminRepository } from "../respostories/interface/IAdminRepository";

import { UserRepository } from "../respostories/userRepository";
import { DoctorRepository } from "../respostories/doctorRepository";
import AdminRepository from "../respostories/adminRepository";


import { IUserBaseRepository } from "../respostories/baseRepository/interface/IUserBaseRepository";
import { IDoctorBaseRepository } from "../respostories/baseRepository/interface/IDoctorBaseRepository";
import { IAdminBaseRepository } from "../respostories/baseRepository/interface/IAdminBaseRepository";

import UserBaseRepository from "../respostories/baseRepository/userBaseRepository";
import { DoctorBaseRepository } from "../respostories/baseRepository/doctorBaseRepository";
import { AdminBaseRepository } from "../respostories/baseRepository/adminBaseRepository";



const userBaseRepository : IUserBaseRepository = new UserBaseRepository();
const userRepository : IUserRepository = new UserRepository(userBaseRepository);
const userService : IUserService = new UserServices(userRepository);
const userController  : IUserController = new UserController(userService) ;


const doctorBaseRepository : IDoctorBaseRepository = new DoctorBaseRepository();
const doctorRepository : IDoctorRepository = new DoctorRepository(doctorBaseRepository) ;
const doctorService : IDoctorService = new DoctorServices(doctorRepository) ;
const doctorController : IDoctorController = new DoctorController(doctorService);



const adminBaseRepository : IAdminBaseRepository = new AdminBaseRepository();
const adminRepository :  IAdminRepository = new AdminRepository(adminBaseRepository);
const adminService : IAdminService =  new AdminService(adminRepository);
const adminController : IAdminController = new AdminController(adminService);






export {userController , doctorController , adminController}