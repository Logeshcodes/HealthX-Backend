
import OtpService from "../services/otpService"
import IOtpServices from "../services/interfaces/IOtpService"
import { OtpRespository } from "../repositories/otpRespository"
import IOtpRepository from "@/repositories/interfaces/IOtpRepository"
import OtpBaseRespository from "../repositories/baseRepositories/otpBaseRepository"
import IOtpBaseRepository from "../repositories/baseRepositories/interfaces/IOtpBaseRepository"

import { UserController } from "../controllers/UserController"
import IUserControllers from "../controllers/interface/IUserControllers"
import UserServices from "../services/UserService"
import IUserServices from "../services/interfaces/IUserServices"
import { UserRepository } from "../repositories/userRepository"
import IUserRepository from "../repositories/interfaces/IUserRepository"
import UserBaseRepository from "../repositories/baseRepositories/userBaseRepository"
import IUserBaseRepository from "../repositories/baseRepositories/interfaces/IUserBaseRepository"

import DoctorController from "../controllers/DoctorController"
import IDoctorControllers from "../controllers/interface/IDoctorController"
import DoctorService from "../services/DoctorService"
import IDoctorServices from "../services/interfaces/IDoctorService"
import DoctorRepository from "../repositories/doctorRespository"
import IDoctorRepository from "../repositories/interfaces/IDoctorRepository"
import DoctorBaseRepository from "../repositories/baseRepositories/doctorBaseRepository"
import IDoctorBaseRepository from "../repositories/baseRepositories/interfaces/IDoctorBaseRepository"

import { AdminController } from "../controllers/AdminController"
import { IAdminControllers } from "../controllers/interface/IAdminControllers"


const otpBaseRepository:IOtpBaseRepository = new OtpBaseRespository()
const otpRespository:IOtpRepository=new OtpRespository(otpBaseRepository)
const otpService:IOtpServices=new OtpService(otpRespository)


const userBaseRepository:IUserBaseRepository= new UserBaseRepository()
const userRepository:IUserRepository=new UserRepository(userBaseRepository)
const userService:IUserServices= new UserServices( userRepository )
const userController: IUserControllers=new UserController(userService ,otpService )



const doctorBaseRepository:IDoctorBaseRepository=new DoctorBaseRepository()
const doctorRepository:IDoctorRepository=new DoctorRepository(doctorBaseRepository)
const doctorService:IDoctorServices=new DoctorService(doctorRepository)
const doctorController: IDoctorControllers=new DoctorController(doctorService ,otpService )






const adminController:IAdminControllers=new AdminController()


export {userController ,  doctorController , adminController};
