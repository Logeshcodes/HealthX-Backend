
import { DoctorRepository } from "../respostories/doctorRespository"

export class DoctorServices{
    private doctorRepository:DoctorRepository
    constructor(){
        this.doctorRepository=new DoctorRepository()

    }
    public async createDoctor(payload:object){
        try {
            const response=await this.doctorRepository.createDoctor(payload)
            return response
        } catch (error) {
            console.log(error)
            
        }
    }

    
    public async getDoctorData(email:string){
        try {
            const response=await this.doctorRepository.getDoctorData(email)
            return response
        } catch (error) {
            console.log(error)
            
        }
    }
    public async updateProfile(email:string,data:object){
        try {
            const response=await this.doctorRepository.updateProfile( email ,data)
            return response
        } catch (error) {
            console.log(error)
            
        }
    }
    public async updatePassword(email:string,password:string){
        try {
            const response=await this.doctorRepository.updatePassword(email,password)
            return response
        } catch (error) {
            console.log(error)
        }
    }
    public async getDoctors(){
        try {
            const response=await this.doctorRepository.getDoctors()
            return response
        } catch (error) {
            console.log(error)
        }
    }
    
}