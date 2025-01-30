
import { UserRepository } from "../respostories/userRepository"

export default class UserServices{
    private userRepository:UserRepository
    constructor(){
        this.userRepository=new UserRepository()

    }
    public async createUser(payload:object){
        try {
            const response=await this.userRepository.createUser(payload)
            return response
        } catch (error) {
            console.log(error)
            
        }
    }
    public async getUserData(email:string){
        try {
            const response=await this.userRepository.getUserData(email)
            return response
        } catch (error) {
            console.log(error)
            
        }
    }
    public async updateProfile(id:any,data:object){
        try {
            const response=await this.userRepository.updateProfile(id,data)
            return response
        } catch (error) {
            console.log(error)
            
        }
    }
    public async updatePassword(email:string,password:string){
        try {
            const response=await this.userRepository.updatePassword(email,password)
            return response
        } catch (error) {
            console.log(error)
        }
    }
    public async getUsers(){
        try {
            const response=await this.userRepository.getUsers()
            return response
        } catch (error) {
            console.log(error)
        }
    }
    public async findAllDoctors(){
        try {
            const response=await this.userRepository.findAllDoctors()
            console.log("doctor ", response)
            return response
        } catch (error) {
            console.log(error)
        }
    }
    
}