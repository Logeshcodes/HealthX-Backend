


import { IUserController } from "../controllers/interface/IUserController";
import { IUserService } from "../services/interface/IUserService";
import { IUserRepository } from "../respostories/interface/IUserRepository";
import { IUserBaseRepository } from "../respostories/baseRepository/interface/IUserBaseRepository";

import { UserController } from "../controllers/UserController";
import { UserServices } from "../services/userService";
import { UserRepository } from "../respostories/userRepository";
import  UserBaseRepository  from "../respostories/baseRepository/userBaseRepository";

import { IDoctorController } from "../controllers/interface/IDoctorController";
import { IDoctorService } from "../services/interface/IDoctorService";
import { IDoctorRepository } from "../respostories/interface/IDoctorRepository";
import { IDoctorBaseRepository } from "../respostories/baseRepository/interface/IDoctorBaseRepository";

import { DoctorController } from "../controllers/DoctorController";
import { DoctorServices } from "../services/doctorService";
import { DoctorRepository } from "../respostories/doctorRepository";
import { DoctorBaseRepository } from "../respostories/baseRepository/doctorBaseRepository";


const userBaseRepository : IUserBaseRepository = new UserBaseRepository();
const userRepository : IUserRepository = new UserRepository(userBaseRepository) ;
const userService : IUserService = new UserServices(userRepository) ;
const userController : IUserController = new UserController(userService);


const doctorBaseRepository : IDoctorBaseRepository = new DoctorBaseRepository();
const doctorRepository : IDoctorRepository = new DoctorRepository(doctorBaseRepository) ;
const doctorService : IDoctorService = new DoctorServices(doctorRepository) ;
const doctorController : IDoctorController = new DoctorController(doctorService);

export {  doctorController , userController}