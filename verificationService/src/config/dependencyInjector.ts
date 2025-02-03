import { IVerificationService } from "../service/IVerificationService"
import { IVerificationControllers } from "../controllers/IVerificationControllers"
import { VerificationContoller } from "../controllers/verificationControllers"
import { VerificationService } from "../service/verificationService"
import { IVerificationRepository } from "../respository/IVerificationRepository"
import { VerificationRepository } from "../respository/verificationRepository"
import { IVerificationBaseRepository } from "../respository/baseRespository/IVerificationBaseRepository"
import { VerificationBaseRepository } from "../respository/baseRespository/verificationBaseRepository"


const verificationBaseRepository:IVerificationBaseRepository=new VerificationBaseRepository()
const verificationRepository:IVerificationRepository=new VerificationRepository(verificationBaseRepository)
const verificationService:IVerificationService=new VerificationService(verificationRepository)
const  verificationController:IVerificationControllers=new VerificationContoller(verificationService)

export { verificationController}