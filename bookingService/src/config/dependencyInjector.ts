import { IUserController } from "../controllers/interface/IUserController";
import { IUserService } from "../services/interface/IUserService";
import { IUserRepository } from "../respostories/interface/IUserRepository";

import { UserController } from "../controllers/UserController";
import { UserServices } from "../services/userService";
import { UserRepository } from "../respostories/userRepository";

import { IDoctorController } from "../controllers/interface/IDoctorController";
import { IDoctorService } from "../services/interface/IDoctorService";
import { IDoctorRepository } from "../respostories/interface/IDoctorRepository";

import { DoctorController } from "../controllers/DoctorController";
import { DoctorServices } from "../services/doctorService";
import { DoctorRepository } from "../respostories/doctorRepository";


const userRepository : IUserRepository = new UserRepository() ;
const userService : IUserService = new UserServices(userRepository) ;
const userController : IUserController = new UserController(userService);

const doctorRepository : IDoctorRepository = new DoctorRepository() ;
const doctorService : IDoctorService = new DoctorServices(doctorRepository) ;
const doctorController : IDoctorController = new DoctorController(doctorService);

export {  doctorController , userController}