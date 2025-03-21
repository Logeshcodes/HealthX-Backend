import upload from "../utils/multer";
import { verificationController } from "../config/dependencyInjector"
import { Router } from "express";
import { IsAdmin , IsDoctor } from "../middlewares/roleauth" ;

const router = Router();

router.post("/verificationRequest",upload.fields([{ name: "medicalLicense", maxCount: 1 },{ name: "degreeCertificate", maxCount: 1},
  ]),
  verificationController.submitRequest.bind(verificationController)
);


router.get("/request/:email",IsAdmin,verificationController.getRequestData.bind(verificationController))
router.get("/requests",IsAdmin,verificationController.getAllRequests.bind(verificationController))
router.post("/approveRequest",IsAdmin,verificationController.approveRequest.bind(verificationController))

const verificationRoutes = router;
export default verificationRoutes;