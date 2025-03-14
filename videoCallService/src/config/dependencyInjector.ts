import { IUserController } from "../controllers/interface/IUserController";
import { IDoctorController } from "../controllers/interface/IDoctorController";
import UserController from "../controllers/UserController";
import { DoctorController } from "../controllers/DoctorController";


import { IUserService } from "../services/interface/IUserService";
import { IDoctorService } from "../services/interface/IDocterService";
import UserServices from "../services/userService";
import { DoctorServices } from "../services/doctorService";


import { IUserRepository } from "../respostories/interface/IUserRepository";
import { IDoctorRepository } from "../respostories/interface/IDoctorRepository";
import { UserRepository } from "../respostories/userRepository";
import { DoctorRepository } from "../respostories/doctorRepository";


const userRepository : IUserRepository = new UserRepository();
const userService : IUserService = new UserServices(userRepository);
const userController  : IUserController = new UserController(userService) ;


const doctorRepository : IDoctorRepository = new DoctorRepository() ;
const doctorService : IDoctorService = new DoctorServices(doctorRepository) ;
const doctorController : IDoctorController = new DoctorController(doctorService);

export {userController , doctorController };