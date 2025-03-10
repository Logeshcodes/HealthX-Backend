import { Request, Response } from "express";


import { uploadToS3Bucket } from "../utils/s3Bucket";
import produce from "../config/kafka/producer";
import DepartmentModel, { DepartmentInterface } from "../models/departmentModel";

import { IAdminController } from "./interface/IAdminController";
import { IAdminService } from "../services/interface/IAdminservice";

import { StatusCode } from '../utils/enum';
import { ResponseError } from '../utils/constants';


export default class AdminController implements IAdminController {

  private adminService: IAdminService;

  constructor(adminService :  IAdminService) {
    this.adminService = adminService ;
  }

  async createDepartment(req: Request, res: Response): Promise<void> {
    try {
      const { departmentName, isListed } = req.body;

      // Check if the department already exists
      const existingDept = await this.adminService.findDepartmentByName(
        departmentName
      );

      if (existingDept) {
         res.json({
          success: false,
          message: ResponseError.DEPARTMENT_EXIST ,
          user: existingDept,
        });
        return ;
      } else {
        const deptData = { departmentName, isListed };
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
      // Fetch all users from the service
      const users = await this.adminService.getAllUsers();

      if (users && users.length > 0) {
        return res
          .status(StatusCode.OK)
          .json({
            success: true,
            message: "Users retrieved successfully",
            users,
          });
      } else {
        return res.status(404).json({
          success: false,
          message: "No users found",
        });
      }
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }

  // admin - doctor data

  async getAllDoctors(req: Request, res: Response): Promise<any> {
    try {
      // Fetch all doctors from the service
      const doctors = await this.adminService.getAllDoctors();

      if (doctors && doctors.length > 0) {
        return res.status(StatusCode.OK).json({
          success: true,
          message: "Users retrieved successfully",
          doctors,
        });
      } else {
        return res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: "No doctors found",
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

  async blockUser(req: any, res: any) {
    try {
      const { email } = req.params;

      // Fetch user data by email
      const userData = await this.adminService.getUserData(email);

      if (!userData) {
        return res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: "User not found",
        });
      }

      const emailId = userData.email;
      const isBlocked = !userData?.isBlocked;

      // Update the user profile
      const userStatus = await this.adminService.updateProfile(emailId, {
        isBlocked,
      });

      await produce("block-user", { email, isBlocked });

      return res.status(StatusCode.OK).json({
        success: true,
        message: userStatus?.isBlocked ? "User Blocked" : "User Unblocked",
      });
    } catch (error) {
      console.error("Error blocking/unblocking user:", error);
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
          message: "banner not found",
        });
      }

      console.log(bannerData ,'dtaaa')

     
      const isListed = !bannerData?.isListed;

      console.log("status updated*** __________====" , isListed)
    

      const bannerStatus = await this.adminService.updateBanner(id , {isListed})


      return res.status(StatusCode.OK).json({
        success: true,
        message: bannerStatus?.isListed ? "Banner Listed" : "Banner Unlisted",
      });
    } catch (error) {
      console.error("Error listed/unlisted banner:", error);
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


      console.log(req.body.rejectReason);
      

      const doctorData = await this.adminService.getDoctorData(email);

      if (!doctorData) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const emailId = doctorData.email;
      const status = "rejected";
      

      const response = await this.adminService.updateDoctorProfile(emailId, {
        status,rejectedReason
      });


      if(response){

        
          await produce("document-rejection-mail", { email , rejectedReason});

          return res.status(200).json({
            success: true,
            message: "Doctor Records Rejected ",
          });
      }

    } catch (error) {

      console.error("Error Doctor Records Rejected:", error);
      return res.status(500).json({
        success: false,
        message: "Error Doctor Records Rejected",
      });
    }
  }
  async approveDocuments(req: any, res: any) {
    try {
      const { email , } = req.params;
      

      const doctorData = await this.adminService.getDoctorData(email);

      if (!doctorData) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const emailId = doctorData.email;
      const status = "approved";
      

      const response = await this.adminService.updateDoctorProfile(emailId, {
        status
      });


      if(response){

        
          await produce("document-approval-mail", { email });

          return res.status(200).json({
            success: true,
            message: "Doctor Records Approved ",
          });
      }

    } catch (error) {

      console.error("Error Doctor Records Approved:", error);
      return res.status(500).json({
        success: false,
        message: "Error Doctor Records Approved",
      });
    }
  }




  async blockDoctor(req: any, res: any) {
    try {
      const { email } = req.params;

      // Fetch user data by email
      const userData = await this.adminService.getDoctorData(email);

      if (!userData) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const emailId = userData.email;
      const isBlocked = !userData?.isBlocked;
      const status = userData?.status === "blocked" ? "approved" : "blocked";

      // Update the user profile
      const userStatus = await this.adminService.updateDoctorProfile(emailId, {
        isBlocked,
        status,
      });

      // await produce("block-doctor", { email, isBlocked , status });
      await produce("block-doctor", { email, isBlocked  , status});

      return res.status(200).json({
        success: true,
        message: userStatus?.isBlocked ? "Doctor Blocked" : "Doctor Unblocked",
      });
    } catch (error) {
      console.error("Error blocking/unblocking Doctor:", error);
      return res.status(500).json({
        success: false,
        message: "Error blocking/unblocking Doctor",
      });
    }
  }

  // Get Department by Name
  async getDepartmentByName(req: Request, res: Response):  Promise< void>{
    try {
      console.log("oooooo", req.params);

      const { departmentName } = req.params;
      console.log("dept name ???????:", decodeURIComponent(departmentName));
      const deptData = await this.adminService.getDepartmentByName(
        decodeURIComponent(departmentName)
      );

      if (!deptData) {
         res
          .status(404)
          .json({ success: false, message: "Department not found" });
          return;
      }

      res.json({ success: true, data: deptData });
    } catch (error) {
      console.error("Error fetching department by name:", error);
      res.status(500).json({ success: false, message: "Server Error." });
    }
  }


  // Get getBannerById 
  async getBannerById(req: Request, res: Response):  Promise< void>{
    try {
      console.log("idd", req.params);

      const { id } = req.params;
      console.log("banner Id ???????:", decodeURIComponent(id));
      const bannerData = await this.adminService.getBannerById(
        decodeURIComponent(id)
      );

      if (!bannerData) {
         res
          .status(404)
          .json({ success: false, message: "banner not found" });
          return;
      }

      res.json({ success: true, data: bannerData });
    } catch (error) {
      console.error("Error fetching banner by id:", error);
      res.status(500).json({ success: false, message: "Server Error." });
    }
  }



  // Get Doctor by email
  async getDoctorByEmail(req: Request, res: Response): Promise<any> {
    try {
      console.log("oooooo", req.params);

      const { email } = req.params;
      console.log("dept name ???????:", decodeURIComponent(email));
      const doctorData = await this.adminService.getDoctorByEmail(
        decodeURIComponent(email)
      );

      if (!doctorData) {
        return res
          .status(404)
          .json({ success: false, message: "Department not found" });
      }

      res.json({ success: true, data: doctorData });
    } catch (error) {
      console.error("Error fetching department by name:", error);
      res.status(500).json({ success: false, message: "Server Error." });
    }
  }

  // Update Department by Name
  async updateDepartment(req: Request, res: Response): Promise<void> {
    try {
      console.log("iiiii", req.params);

      const { departmentName } = req.params;

      const updateData = req.body;

      console.log(departmentName, "dept");
      console.log(updateData.deptData.departmentName, "deptup");

      const existingDept = await this.adminService.findDepartmentByName(
        updateData.deptData.departmentName
      );
      if (existingDept) {
        res.json({
          success: false,
          message: "Department already exists",
          user: existingDept,

        });
        return ;
      }
      const deptData = await this.adminService.updateDepartment(
        departmentName,
        updateData.deptData
      );
      console.log("existingDept", existingDept);

      await produce("update-department", { departmentName, updateData });

      res.json({
        success: true,
        message: "Department updated successfully",
        data: deptData,
      });
    } catch (error) {
      console.error("Error updating department:", error);
      res.status(500).json({ success: false, message: "Server Error." });
    }
  }


  // Update updateBanner by id
  async updateBanner(req: Request, res: Response): Promise<void> {
    try {
      console.log("Request params:", req.params);

  
      const { id } = req.params; 
      let updateData = req.body; 
      let bannerImage = updateData.bannerImage || "No image"; 
  
      console.log("Banner ID:", id);
      console.log("Received File:", req.file);
  
      
      if (req.file) {
        console.log("Uploading new banner image...");
        bannerImage = await uploadToS3Bucket(req.file, "banners");
      }
  
      
      updateData = { ...updateData, bannerImage };
  
     
      const bannerData = await this.adminService.updateBanner(id, updateData);
  
      res.json({
        success: true,
        message: "Banner updated successfully",
        data: bannerData,
      });
    } catch (error) {
      console.error("Error updating banner:", error);
      res.status(500).json({ success: false, message: "Server Error." });
    }
  }
  


public async addBanner(req: Request, res: Response): Promise<any> {
  try {
    const { bannerTitle, description, startDate, endDate, link, role } = req.body;

    console.log(req.body, "Adding Banner Data");
    console.log(req.file, "bannerImage - Adding Banner Data");

    let bannerImage = "No image";

    if (req.file) {
      console.log("Uploading banner image...");
      bannerImage = await uploadToS3Bucket(req.file, "banners");
    }

    const response = await this.adminService.addBanner({
      bannerTitle,
      description,
      bannerImage,
      startDate,
      endDate,
      link,
      role
    });

    if (response) {
      return res.status(200).json({
        success: true,
        message: "Banner added successfully!",
        data : response,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Failed to add banner!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while adding the banner.",
    });
  }
}

  
  
async getAllBanner(req: Request, res: Response): Promise<any> {
  try {
    // Fetch all departments from the service
    const banners = await this.adminService.getAllBanner();

    if (banners && banners.length > 0) {
      return res.status(200).json({
        success: true,
        message: "banners retrieved successfully",
        data : banners,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "No banners found",
      });
    }
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}


}
