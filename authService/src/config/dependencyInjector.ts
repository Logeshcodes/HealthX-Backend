import OtpService from "../services/otpService"
import IOtpServices from "../services/interfaces/IOtpService"
import { OtpRespository } from "../repositories/otpRespository"
import IOtpRepository from "../repositories/interfaces/IOtpRepository"

import { UserController } from "../controllers/UserController"
import IUserControllers from "../controllers/interface/IUserControllers"
import UserServices from "../services/UserService"
import IUserServices from "../services/interfaces/IUserServices"
import { UserRepository } from "../repositories/userRepository"
import IUserRepository from "../repositories/interfaces/IUserRepository"

import DoctorController from "../controllers/DoctorController"
import IDoctorControllers from "../controllers/interface/IDoctorController"
import DoctorService from "../services/DoctorService"
import IDoctorServices from "../services/interfaces/IDoctorService"
import DoctorRepository from "../repositories/doctorRespository"
import IDoctorRepository from "../repositories/interfaces/IDoctorRepository"


import { AdminController } from "../controllers/AdminController"
import { IAdminControllers } from "../controllers/interface/IAdminControllers"



const otpRespository:IOtpRepository=new OtpRespository()
const otpService:IOtpServices=new OtpService(otpRespository)


const userRepository:IUserRepository=new UserRepository()
const userService:IUserServices= new UserServices( userRepository )
const userController: IUserControllers=new UserController(userService ,otpService )



const doctorRepository:IDoctorRepository=new DoctorRepository()
const doctorService:IDoctorServices=new DoctorService(doctorRepository)
const doctorController: IDoctorControllers=new DoctorController(doctorService ,otpService )


const adminController:IAdminControllers=new AdminController()

export {userController ,  doctorController , adminController};
