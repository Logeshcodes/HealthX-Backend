import { Request, Response } from "express";

import AdminService from "../services/adminServices";

import produce from "../config/kafka/producer";

export default class AdminController {
  private adminService: AdminService;

  constructor() {
    this.adminService = new AdminService();
  }

  async createDepartment(req: Request, res: Response): Promise<any> {
    try {
      const { departmentName, isListed } = req.body;

      // Check if the department already exists
      const existingDept = await this.adminService.findDepartmentByName(
        departmentName
      );

      if (existingDept) {
        return res.json({
          success: false,
          message: "Department already exists",
          user: existingDept,
        });
      } else {
        const deptData = { departmentName, isListed };
        const dept = await this.adminService.createDepartment(deptData);

        if (dept) {
          await produce("add-department", dept);
          return res.status(201).json({
            success: true,
            message: "Department registration successful!",
            dept,
          });
        } else {
          return res.status(400).json({
            success: false,
            message: "Department registration failed!",
          });
        }
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

  async getAllDepartments(req: Request, res: Response): Promise<any> {
    try {
      // Fetch all departments from the service
      const departments = await this.adminService.getAllDepartments();

      if (departments && departments.length > 0) {
        return res.status(200).json({
          success: true,
          message: "Departments retrieved successfully",
          departments,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "No departments found",
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

  async getAllUsers(req: Request, res: Response): Promise<any> {
    try {
      // Fetch all users from the service
      const users = await this.adminService.getAllUsers();

      if (users && users.length > 0) {
        return res
          .status(200)
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
        return res.status(200).json({
          success: true,
          message: "Users retrieved successfully",
          doctors,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "No doctors found",
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

  async blockUser(req: any, res: any) {
    try {
      const { email } = req.params;

      // Fetch user data by email
      const userData = await this.adminService.getUserData(email);

      if (!userData) {
        return res.status(404).json({
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

      return res.status(200).json({
        success: true,
        message: userStatus?.isBlocked ? "User Blocked" : "User Unblocked",
      });
    } catch (error) {
      console.error("Error blocking/unblocking user:", error);
      return res.status(500).json({
        success: false,
        message: "Error blocking/unblocking user",
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
      await produce("block-doctor", { email, isBlocked });

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
  async getDepartmentByName(req: Request, res: Response): Promise<any> {
    try {
      console.log("oooooo", req.params);

      const { departmentName } = req.params;
      console.log("dept name ???????:", decodeURIComponent(departmentName));
      const deptData = await this.adminService.getDepartmentByName(
        decodeURIComponent(departmentName)
      );

      if (!deptData) {
        return res
          .status(404)
          .json({ success: false, message: "Department not found" });
      }

      res.json({ success: true, data: deptData });
    } catch (error) {
      console.error("Error fetching department by name:", error);
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
  async updateDepartment(req: Request, res: Response): Promise<any> {
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
        return res.json({
          success: false,
          message: "Department already exists",
          user: existingDept,
        });
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
}
