import upload from "../utils/multer";
import { verificationController } from "../config/dependencyInjector"
import express, { Request, Response, Router } from "express";
import { IsAdmin, IsUser , IsDoctor } from "../middlewares/roleauth" ;

const router = Router();

router.post("/verificationRequest",
  upload.fields([
    { name: "degreeCertificate", maxCount: 1 },
    { name: "experienceCertificate", maxCount: 1 },
  ]),
  IsDoctor,
  verificationController.submitRequest.bind(verificationController)
);

// router.post("/reVerifyRequest",
//   upload.fields([
//     { name: "experienceCertificate", maxCount: 1 },
//     { name: "experienceCertificate", maxCount: 1 },
//   ]),
//   IsDoctor,
//   verificationController.reVerifyRequest.bind(verificationController)
// );

router.get("/request/:email",IsAdmin,verificationController.getRequestData.bind(verificationController))
router.get("/requests",IsAdmin,verificationController.getAllRequests.bind(verificationController))
router.post("/approveRequest",IsAdmin,verificationController.approveRequest.bind(verificationController))

const verificationRoutes = router;
export default verificationRoutes;