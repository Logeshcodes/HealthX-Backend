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



import { IUserBaseRepository } from "../respostories/baseRepository/interface/IUserBaseRepository";
import { IDoctorBaseRepository } from "../respostories/baseRepository/interface/IDoctorBaseRepository";


import UserBaseRepository from "../respostories/baseRepository/userBaseRepository";
import { DoctorBaseRepository } from "../respostories/baseRepository/doctorBaseRepository";




const userBaseRepository : IUserBaseRepository = new UserBaseRepository();
const userRepository : IUserRepository = new UserRepository(userBaseRepository);
const userService : IUserService = new UserServices(userRepository);
const userController  : IUserController = new UserController(userService) ;


const doctorBaseRepository : IDoctorBaseRepository = new DoctorBaseRepository();
const doctorRepository : IDoctorRepository = new DoctorRepository(doctorBaseRepository) ;
const doctorService : IDoctorService = new DoctorServices(doctorRepository) ;
const doctorController : IDoctorController = new DoctorController(doctorService);







export {userController , doctorController }