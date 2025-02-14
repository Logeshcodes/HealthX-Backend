
import DoctorModel , {DoctorInterface} from "../models/doctorModel"


import IDoctorBaseRepository from "./baseRepositories/interfaces/IDoctorBaseRepository";
import IDoctorRepository from "./interfaces/IDoctorRepository";


export default class DoctorRepository implements IDoctorRepository{


    private baseRepository:IDoctorBaseRepository
    constructor(baseRepository:IDoctorBaseRepository){
        this.baseRepository=baseRepository

    }


    async findByEmail(email:string){
        const response = await this.baseRepository.findByEmail(email)
        return response
    }

    // dept - signup

    async getAllDepartments() {
        const response = await this.baseRepository.getAllDepartments();
        return response;
      }
   

    async createUser(userData:any) {
        const response= await this.baseRepository.createDoctor(userData)
        return response
    }
    
    async resetPassword(email:string,password:string) {
        const response= await this.baseRepository.resetPassword(email,password)
        return response
    }


    public async googleLogin(name: string, email: string, password: string): Promise<DoctorInterface | null> {
        try {
            const response = await this.baseRepository.googleLogin(name, email, password);
            return response;
        } catch (error) {
            throw error;
        }
    }

    public async updateProfile(email: string, profilePicture: string): Promise<void> {
        try {
            const response = await this.baseRepository.updateProfile(email,profilePicture);
            return response;
        } catch (error) {
            throw error;
        }
    }

    public async blockDoctor(email : string, isBlocked : boolean  , status : string  ) : Promise<void>{
        try {
            const response = await this.baseRepository.blockDoctor(email, isBlocked  , status);
            return response;
        } catch (error) {
            throw error;
        }
    }
   
}