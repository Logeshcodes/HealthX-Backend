import  { DoctorInterface } from "../models/doctorModel";
import IDoctorRepository from "../repositories/interfaces/IDoctorRepository";
import IDoctorServices from "./interfaces/IDoctorService";

export default class DoctorService implements IDoctorServices{

    private doctorRepository:IDoctorRepository

    constructor(instructorRepository:IDoctorRepository){
        this.doctorRepository=instructorRepository
    }

    public async findByEmail(email:string){
      return await this.doctorRepository.findByEmail(email)
    }
  
    public async createUser(userData:DoctorInterface){
      return await this.doctorRepository.createUser(userData)
    }

    public async resetPassword(email:string,password:string){
      return await this.doctorRepository.resetPassword(email,password)
    }


    public async updateProfile(email: string, profilePicture: string): Promise<void> {
      return await this.doctorRepository.updateProfile(email, profilePicture);
    }

    public async blockDoctor(email : string, isBlocked : boolean ) : Promise<void> {
      return await this.doctorRepository.blockDoctor(email, isBlocked );
    }
          
  


}