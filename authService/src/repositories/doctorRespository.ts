import DoctorModel , {DoctorInterface} from "../models/doctorModel"
import IDoctorRepository from "./interfaces/IDoctorRepository";
import { GenericRespository } from "./GenericRepository.ts/GenericRepository"

export default class DoctorRepository extends GenericRespository<DoctorInterface> implements IDoctorRepository{

    constructor(){
        super(DoctorModel)
    }

    async findByEmail(email:string){
        return await this.findOne(email);
    }

    async createUser(userData:DoctorInterface) {
        return await this.create(userData);
    }
    
    async resetPassword(email:string,password:string) {
        return await this.update( email , {hashedPassword : password} );
    }

    public async updateProfile(email: string, profilePicture: string): Promise<void> {
        await this.update(email,{profilePicture : profilePicture});
    }

    public async blockDoctor(email : string, isBlocked : boolean   ) : Promise<void>{
         await this.update(email, {isBlocked : isBlocked} );
    }
   
}