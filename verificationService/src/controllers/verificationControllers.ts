import { Request, Response } from "express";
import { IVerificationControllers } from "./IVerificationControllers";
import { uploadToS3Bucket } from "../utils/s3Bucket"
import { IVerificationService } from "../service/IVerificationService"

import produce from "../config/kafka/producer";

import { ResponseError } from "../utils/constants";
import { StatusCode } from "../utils/enum";

export class VerificationContoller implements IVerificationControllers {
  private verificationService: IVerificationService;

  constructor(verificationService: IVerificationService) {
    this.verificationService = verificationService;
  }

  async submitRequest(req: Request, res: Response): Promise<void> {
    try {
      const { name, email  } = req.body;

      if (!req.files || typeof req.files !== "object") {
        throw new Error("No documents received");
      }

      const files = req.files as {
        [fieldname: string]: Express.Multer.File[]; 
      };

      const medicalLicense = files.medicalLicense?.[0] || null;
      const degreeCertificate = files.degreeCertificate?.[0] || null;



      let medicalLicenseUrl;
      let degreeCertificateUrl;

      if (degreeCertificate && medicalLicense) {

        medicalLicenseUrl = await uploadToS3Bucket(medicalLicense, "medicalLicense");
        degreeCertificateUrl = await uploadToS3Bucket(degreeCertificate,"degreeCertificate");
        
        let status2 = 'pending';
        let response = await this.verificationService.sendVerifyRequest( name,email ,medicalLicenseUrl,degreeCertificateUrl, status2);
        
        const emailID = response.email;
        const status = response.status;

        produce("verification-request", { emailID, status , medicalLicenseUrl ,degreeCertificateUrl  });

        res.status(StatusCode.OK).send({
          success: true,
          message: ResponseError.VERIFY_REQUEST,
          data: response,
        });
      } else {
        res.status(StatusCode.NOT_FOUND).send({
          success: false,
          message: ResponseError.DOCUMENT_NOT_FOUND,
        });
      }
    } catch (error) {
      throw new Error("Verify Request Document failed Creation at controller");
    }
  }

  async getRequestData(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.params;
      const requestData = await this.verificationService.getRequestData(email);

      if (requestData) {
        res.status(StatusCode.OK).json({
          data: requestData,
        });
      } else {
        res.json(requestData);
      }
    } catch (error) {
      throw new Error("Error ");
    }
  }


  async getAllRequests(req: Request, res: Response): Promise<void> {
    try {
      const requestData = await this.verificationService.getAllRequests();
      if (requestData) {
        res.status(StatusCode.OK).json(requestData);
      } else {
        res.json(requestData);
      }
    } catch (error) {
      throw new Error("Error ");
    }
  }

  async approveRequest(req: Request, res: Response): Promise<void> {
    try {
      const { email, status } = req.body;

      const approvedRequest = await this.verificationService.approveRequest(email,status);
      if (approvedRequest) {
        produce("approve-reject-request", { emailID: email,status: approvedRequest.status});
        console.log("kafka-produces");
        if (approvedRequest.status == "approved") {
          let email = approvedRequest.email;
          let username = approvedRequest.name;

          produce("verified-Doctor-email", { email, username });

          res.status(StatusCode.OK).json({
            success: true,
            message: ResponseError.APPROVED,
            data: approvedRequest,
          });
        } else if (approvedRequest.status === "rejected") {
          res.status(StatusCode.OK).json({
            success: true,
            message: ResponseError.REJECTED,
            data: approvedRequest,
          });
        }
      } else {
        res.json(approvedRequest);
      }
    } catch (error) {
      throw new Error("Error in controller ");
    }
  }

 
}