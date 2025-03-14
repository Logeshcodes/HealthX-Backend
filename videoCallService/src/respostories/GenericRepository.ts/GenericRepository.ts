import { Model, Document } from "mongoose";

export interface IGenericRepository<T extends Document> {
  create(payload: Partial<T>): Promise<T>;
}

export class GenericRespository< T extends Document > implements IGenericRepository <T> {

    private model : Model<T> ;
    
    constructor(model : Model<T>){
        this.model = model ;
    }

    async create(payload: Partial<T>): Promise<T> {
        return await this.model.create(payload);
    }
}