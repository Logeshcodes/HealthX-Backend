import BannerModel, { BannerInterface } from "../../models/bannerModel";
import DoctorModel , {DoctorInterface, ITransaction} from "../../models/doctorModel"

import { IDoctorBaseRepository } from "./interface/IDoctorBaseRepository";



export class DoctorBaseRepository implements IDoctorBaseRepository {


  async createDoctor(payload: DoctorInterface): Promise<DoctorInterface | null> {
    try {
      console.log("Kafka payload___________***" , payload)
      const doctor = await new DoctorModel(payload);
      await doctor.save();

      console.log("doctor detials saved...." , doctor)
      return doctor;
    } catch (error) {
      throw error;
    }
  }

  async getDoctorData(email: string): Promise<DoctorInterface | null | undefined> {
    try {
      const doctorData = await DoctorModel.findOne({ email: email });
      return doctorData;
    } catch (error) {
      throw error;
    }
  }

  // Doctor - Profile - update
  async updateProfile(email:string, data: object): Promise<DoctorInterface | null | undefined> {
    try {
      const doctorData = await DoctorModel.findOneAndUpdate( 
        {email : email},
        {$set : data},
        {new: true});
      return doctorData;
    } catch (error) {
      throw error;
    }
  }

  async updatePassword(email: string, password: string): Promise<DoctorInterface | null | undefined> {
    try {
      const doctorData = await DoctorModel.findOneAndUpdate(
        { email },
        {
          $set: {
            hashedPassword: password,
          },
        },
        { new: true }
      );
      return doctorData;
    } catch (error) {
      throw error;
    }
  }

  async findAllBanners(): Promise <BannerInterface[] | null | undefined>{
          try {
  
            const currentDate = new Date();

            const response = await BannerModel.find({
              isListed: true,
              role: "Doctor",
              startDate: { $lte: currentDate }, 
              endDate: { $gte: currentDate }    
            });
            
              return response
              
          } catch (error) {
              console.log(error);
              
          }
        }


  async VerificationRequest(emailID: string, status: string ,medicalLicenseUrl: string , degreeCertificateUrl : string):  Promise<DoctorInterface | null | undefined> {
    try {

      console.log(emailID , status , "consume data...")
      const doctorData = await DoctorModel.findOneAndUpdate(
        {  email : emailID },
        {
          $set: {
            status: status ,
            medicalLicense : medicalLicenseUrl ,
            degreeCertificate : degreeCertificateUrl 
          },
        },
        { new: true }
      );
      console.log(doctorData)
      return doctorData;
    } catch (error) {
      throw error;
    }
  }

  async getDoctors(): Promise<DoctorInterface[] | null | undefined>{
    try {
        const response=await DoctorModel.find()
        return response
        
    } catch (error) {
        console.log(error);
        
    }
  }




async updateWallet(doctorId: string, wallet: { balance: number; transactions: ITransaction[] }): Promise<DoctorInterface | null> {
  try {
      console.log("Final doctor wallet data:", wallet);

     
      const userData = await DoctorModel.findByIdAndUpdate(
        doctorId,
          {
              $set: {
                  "wallet.balance": wallet.balance,
                  "wallet.transactions": wallet.transactions,
              },
          },
          { new: true }
      );

      return userData;
  } catch (error) {
      console.error("Error updating user wallet:", error);
      throw error;
  }
}




}