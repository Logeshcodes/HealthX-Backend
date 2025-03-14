import { IVerificationService } from "../service/IVerificationService"
import { IVerificationControllers } from "../controllers/IVerificationControllers"
import { VerificationContoller } from "../controllers/verificationControllers"
import { VerificationService } from "../service/verificationService"
import { IVerificationRepository } from "../respository/IVerificationRepository"
import { VerificationRepository } from "../respository/verificationRepository"


const verificationRepository:IVerificationRepository=new VerificationRepository()
const verificationService:IVerificationService=new VerificationService(verificationRepository)
const  verificationController:IVerificationControllers=new VerificationContoller(verificationService)

export { verificationController}