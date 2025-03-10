import { Model, Document } from "mongoose";

export interface IGenericRepository<T extends Document> {
  create(payload: Partial<T>): Promise<T>;
  findOne(email:  string): Promise<T | null>;
  update( email:  string ,data: Record<string, any> ): Promise<T>
  delete( filter: Record<string, any>): Promise<void>;
}

export class GenericRespository< T extends Document > implements IGenericRepository <T> {

    private model : Model<T> ;

    constructor(model : Model<T>){
        this.model = model ;
    }

    async create(payload: Partial<T>): Promise<T> {
        return await this.model.create(payload);
    }

    async findOne(email:  string): Promise<T | null> {
        return await this.model.findOne({email : email});
    }

    async update(email: string, data: Record<string, any>): Promise<T> {

        return await this.model.findOneAndUpdate(
            { email },
            { $set: data }, 
            { new: true, upsert: true }
        );
    }
    
    async delete(filter: Record<string, any>): Promise<void> {
        await this.model.findOneAndDelete(filter);
    }
}