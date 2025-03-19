import { Request, Response } from "express";
import { uploadToS3Bucket } from "../utils/s3Bucket";
import produce from "../config/kafka/producer";
import { IAdminController } from "./interface/IAdminController";
import { IAdminService } from "../services/interface/IAdminservice";
import { StatusCode } from '../utils/enum';
import { ResponseError } from '../utils/constants';
import { WalletData } from "../types/walletType";
import AdminModel, { AdminInterface } from "../models/adminModel";


export default class AdminController implements IAdminController {

  private adminService: IAdminService;

  constructor(adminService :  IAdminService) {
    this.adminService = adminService ;
  }

  public async addAdmin(payload: AdminInterface): Promise<void> {
      await this.adminService.createAdmin(payload);
    }

  async createDepartment(req: Request, res: Response): Promise<void> {
    try {
      const { departmentName, isListed } = req.body;

      const existingDept = await this.adminService.findDepartmentByName(departmentName);

      if (existingDept) {
         res.json({
          success: false,
          message: ResponseError.DEPARTMENT_EXIST ,
          user: existingDept,
        });
        return ;
      } else {
        const dept = await this.adminService.createDepartment(departmentName );

        if (dept) {
          await produce("add-department", dept);
          res.status(StatusCode.CREATED).json({
            success: true,
            message: ResponseError.DEPARTMENT_CREATED,
            dept,
          });
          return ;
        } else {
         res.status(StatusCode.BAD_REQUEST).json({
            success: false,
            message: ResponseError.DEPARTMENT_NOTFOUND,
          });
          return ;
        }
      }
    } catch (error: any) {
      console.error(error);
       res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ResponseError.INTERNAL_SERVER_ERROR,
        error: error.message,
      });
      return ;
    }
  }

  async getAllDepartments(req: Request, res: Response): Promise<any> {
    try {
      // Fetch all departments from the service
      const departments = await this.adminService.getAllDepartments();

      if (departments && departments.length > 0) {
        return res.status(StatusCode.OK).json({
          success: true,
          message: ResponseError.DEPARTMENT_FETCHED,
          departments,
        });
      } else {
        return res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: ResponseError.DEPARTMENT_NOTFOUND,
        });
      }
    } catch (error: any) {
      console.error(error);
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ResponseError.INTERNAL_SERVER_ERROR,
        error: error.message,
      });
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<any> {
    try {
      const users = await this.adminService.getAllUsers();

      if (users && users.length > 0) {
        return res
          .status(StatusCode.OK)
          .json({
            success: true,
            message: ResponseError.FETCH_USER,
            users,
          });
      } else {
        return res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: ResponseError.USER_NOT_FOUND,
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ResponseError.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getAllDoctors(req: Request, res: Response): Promise<any> {
    try {
      const doctors = await this.adminService.getAllDoctors();

      if (doctors && doctors.length > 0) {
        return res.status(StatusCode.OK).json({
          success: true,
          message: ResponseError.FETCH_DOCTOR,
          doctors,
        });
      } else {
        return res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: ResponseError.FETCH_NOT_DOCTOR,
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ResponseError.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getAdminData(req: Request, res: Response): Promise<any> {
    try {
      const admin = await this.adminService.getAdminData();

      if (admin) {
        return res.status(StatusCode.OK).json({
          success: true,
          message: ResponseError.FETCH_ADMIN,
          admin,
        });
      } else {
        return res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: ResponseError.NOT_FOUND,
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ResponseError.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async blockUser(req: any, res: any) {
    try {
      const { email } = req.params;
      const userData = await this.adminService.getUserData(email);
      if (!userData) {
        return res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: ResponseError.USER_NOT_FOUND,
        });
      }
      const emailId = userData.email;
      const isBlocked = !userData?.isBlocked;

      const userStatus = await this.adminService.updateProfile(emailId, {
        isBlocked,
      });

      await produce("block-user", { email, isBlocked });

      return res.status(StatusCode.OK).json({
        success: true,
        message: userStatus?.isBlocked ? ResponseError.ACCOUNT_BLOCKED : ResponseError.ACCOUNT_UNBLOCKED,
      });
    } catch (error) {
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ResponseError.INTERNAL_SERVER_ERROR,
      });
    }
  }


  async listBanner(req: any, res: any) {
    try {
      const { id  } = req.params;
      const bannerData = await this.adminService.getBannerById(id)

      if (!bannerData) {
        return res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: ResponseError.NOT_FOUND,
        });
      }
      const isListed = !bannerData?.isListed;

      const bannerStatus = await this.adminService.updateBanner(id , {isListed})

      return res.status(StatusCode.OK).json({
        success: true,
        message: bannerStatus?.isListed ? "Banner Listed" : "Banner Unlisted",
      });
    } catch (error) {
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ResponseError.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async rejectDocuments(req: any, res: any) {
    try {
      const { email , } = req.params;
      const rejectedReason = req.body.rejectReason ;
      const doctorData = await this.adminService.getDoctorData(email);

      if (!doctorData) {
        return res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: ResponseError.USER_NOT_FOUND,
        });
      }
      const emailId = doctorData.email;
      const status = "rejected";

      const response = await this.adminService.updateDoctorProfile(emailId, {status,rejectedReason});
      if(response){

          await produce("document-rejection-mail", { email , rejectedReason});

          return res.status(StatusCode.OK).json({
            success: true,
            message: ResponseError.REJECT_DOCTOR,
          });
      }

    } catch (error) {
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ResponseError.INTERNAL_SERVER_ERROR,
      });
    }
  }
  async approveDocuments(req: any, res: any) {
    try {
      const { email , } = req.params;
      const doctorData = await this.adminService.getDoctorData(email);
      if (!doctorData) {
        return res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: ResponseError.NOT_FOUND,
        });
      }

      const emailId = doctorData.email;
      const status = "approved";
      const response = await this.adminService.updateDoctorProfile(emailId, {status});
      if(response){

          await produce("document-approval-mail", { email });

          return res.status(StatusCode.OK).json({
            success: true,
            message: ResponseError.APPROVE_DOCTOR,
          });
      }
    } catch (error) {
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ResponseError.INTERNAL_SERVER_ERROR
      });
    }
  }



  async blockDoctor(req: any, res: any) {
    try {
      const { email } = req.params;
      const userData = await this.adminService.getDoctorData(email);
      if (!userData) {
        return res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: ResponseError.NOT_FOUND,
        });
      }
      const emailId = userData.email;
      const isBlocked = !userData?.isBlocked;
      const status = userData?.status === "blocked" ? "approved" : "blocked";

      const userStatus = await this.adminService.updateDoctorProfile(emailId, {
        isBlocked,
        status,
      });
      await produce("block-doctor", { email, isBlocked  , status});

      return res.status(StatusCode.OK).json({
        success: true,
        message: userStatus?.isBlocked ? ResponseError.ACCOUNT_BLOCKED : ResponseError.ACCOUNT_UNBLOCKED,
      });
    } catch (error) {
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ResponseError.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getDepartmentByName(req: Request, res: Response):  Promise< void>{
    try {

      const { departmentName } = req.params;
      const deptData = await this.adminService.getDepartmentByName( decodeURIComponent(departmentName));

      if (!deptData) {
         res
          .status(StatusCode.NOT_FOUND)
          .json({ success: false, message: ResponseError.NOT_FOUND });
          return;
      }

      res.json({ success: true, data: deptData });
    } catch (error) {
      console.error("Error fetching department by name:", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: ResponseError.INTERNAL_SERVER_ERROR });
    }
  }

  async getBannerById(req: Request, res: Response):  Promise< void>{
    try {

      const { id } = req.params;
      const bannerData = await this.adminService.getBannerById(decodeURIComponent(id));

      if (!bannerData) {
         res
          .status(StatusCode.NOT_FOUND)
          .json({ success: false, message: ResponseError.NOT_FOUND });
          return;
      }
      res.json({ success: true, data: bannerData });
    } catch (error) {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: ResponseError.INTERNAL_SERVER_ERROR });
    }
  }

  async getDoctorByEmail(req: Request, res: Response): Promise<any> {
    try {

      const { email } = req.params;
      const doctorData = await this.adminService.getDoctorByEmail(decodeURIComponent(email) );

      if (!doctorData) {
        return res
          .status(StatusCode.NOT_FOUND)
          .json({ success: false, message: ResponseError.NOT_FOUND });
      }
      res.json({ success: true, data: doctorData });
    } catch (error) {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: ResponseError.INTERNAL_SERVER_ERROR });
    }
  }

  async updateDepartment(req: Request, res: Response): Promise<void> {
    try {
      const { departmentName } = req.params;
      const updateData = req.body;

      const existingDept = await this.adminService.findDepartmentByName(updateData.deptData.departmentName);
      if (existingDept) {
        res.json({
          success: false,
          message: ResponseError.DEPARTMENT_EXIST,
          user: existingDept,
        });
        return ;
      }
      const deptData = await this.adminService.updateDepartment(departmentName,updateData.deptData);

      await produce("update-department", { departmentName, updateData });

      res.json({
        success: true,
        message: ResponseError.DEPARTMENT_UPDATED ,
        data: deptData,
      });
    } catch (error) {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: ResponseError.INTERNAL_SERVER_ERROR });
    }
  }

  async updateBanner(req: Request, res: Response): Promise<void> {
    try {

      const { id } = req.params; 
      let updateData = req.body; 
      let bannerImage = updateData.bannerImage || "No image"; 
  
      if (req.file) {
        bannerImage = await uploadToS3Bucket(req.file, "banners");
      }
  
      updateData = { ...updateData, bannerImage };
  
      const bannerData = await this.adminService.updateBanner(id, updateData);
      res.json({
        success: true,
        message: ResponseError.BANNER_UPDATED,
        data: bannerData,
      });
    } catch (error) {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: ResponseError.INTERNAL_SERVER_ERROR });
    }
  }

public async addBanner(req: Request, res: Response): Promise<any> {
  try {
    const { bannerTitle, description, startDate, endDate, link, role } = req.body;

    let bannerImage = "No image";

    if (req.file) {
      bannerImage = await uploadToS3Bucket(req.file, "banners");
    }

    const response = await this.adminService.addBanner({ bannerTitle, description,bannerImage,startDate,endDate,link,role});

    if (response) {
      return res.status(StatusCode.OK).json({
        success: true,
        message: ResponseError.BANNER_CREATED,
        data : response,
      });
    } else {
      return res.status(StatusCode.NOT_FOUND).json({
        success: false,
        message: ResponseError.NOT_FOUND,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ResponseError.INTERNAL_SERVER_ERROR,
    });
  }
}

async getAllBanner(req: Request, res: Response): Promise<any> {
  try {
    const banners = await this.adminService.getAllBanner();

    if (banners && banners.length > 0) {
      return res.status(StatusCode.OK).json({
        success: true,
        message: ResponseError.FETCH_BANNER,
        data : banners,
      });
    } else {
      return res.status(StatusCode.NOT_FOUND).json({
        success: false,
        message: ResponseError.NOT_FOUND,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ResponseError.INTERNAL_SERVER_ERROR,
    });
  }
}



async getAllReport(req: Request, res: Response): Promise<any> {
  try {
      const { page = 1, limit = 10, search = "" } = req.query;

      const pageNumber = parseInt(page as string);
      const limitNumber = parseInt(limit as string);
      
      const { reports, totalPages } = await this.adminService.getAllReport(pageNumber, limitNumber, search as string);

      return res.status(StatusCode.OK).json({
          success: true,
          message: ResponseError.FETCH_REPORTS,
          data: reports,
          totalPages,
      });
  } catch (error) {
      console.error(error);
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: ResponseError.INTERNAL_SERVER_ERROR,
      });
  }
}



  async updateWalletBookAppointment(data: WalletData): Promise<void> {
    try {
      console.log("update- admin wallet data", data);
      const { doctorId , userId , appointmentId, transactionId, amount, type } = data;

      if (!doctorId) {
        throw new Error("Doctor ID is required");
      }

      const adminDetails = await AdminModel.findOne({email : "admin@gmail.com"})

      if (!adminDetails) {
        throw new Error("No admin details not found");
      }
      const transactions = adminDetails?.wallet.transactions ?? [];
      const description = `Booked Appointment Id : ${appointmentId}`;
      const Amount = amount* 0.1 ;

      const newTransaction = {amount: Amount,description,transactionId, type, date: new Date()};

      const newBalance = adminDetails.wallet.balance + Amount;
      const walletDetails = {
        balance: newBalance,
        transactions: [...transactions, newTransaction],
      };

      console.log("Updated admin Wallet Data:", walletDetails);

      await this.adminService.updateWallet( walletDetails);
    } catch (error) {
      console.log(error);
    }
  }




}