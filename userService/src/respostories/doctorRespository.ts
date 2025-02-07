import DoctorModel , {DoctorInterface} from "../models/doctorModel"
import { DoctorBaseRepository } from "./baseRepository/doctorBaseRepository";



export class DoctorRepository{
    private doctorBaseRepository:DoctorBaseRepository<DoctorInterface>
    constructor(){
        this.doctorBaseRepository=new DoctorBaseRepository(DoctorModel)

    }
    async createDoctor(payload:any){
        try {
            const response=await this.doctorBaseRepository.createDoctor(payload)
            
            
        } catch (error) {
            
        }
    }
    async getDoctorData(email:string){
        try {
            const response=await this.doctorBaseRepository.getDoctorData(email)
            return response
            
        } catch (error) {
            
        }
    }
    async updateProfile(email:string,data:object){
        try {
            const response=await this.doctorBaseRepository.updateProfile( email,data)
            return response
            
        } catch (error) {
            console.log(error)
            
        }
    }
    
    async updatePassword(email:string,password:string){
        try {
            const response=await this.doctorBaseRepository.updatePassword(email,password)
            return response
            
        } catch (error) {
            console.log(error)
            
        }
    }
    async getDoctors(){
        try {
            const response=await this.doctorBaseRepository.getDoctors()
            return response
            
        } catch (error) {
            console.log(error)
            
        }
    }
    
    
    
}