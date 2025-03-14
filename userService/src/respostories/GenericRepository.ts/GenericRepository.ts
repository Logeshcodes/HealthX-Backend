import { Model, Document } from "mongoose";

export interface IGenericRepository<T extends Document> {
  create(payload: Partial<T>): Promise<T>;
  find(): Promise<T[] | null>;
  findOne(filter: object): Promise<T | null>;
  update( email:  string ,data: Record<string, any> ): Promise<T>
  findIdAndUpdate( id :  string ,data: Record<string, any> ): Promise<T | null>
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

    async find(): Promise<T[] | null> {
        return await this.model.find();
    }


    async findOne(filter: object): Promise<T | null> {
        return await this.model.findOne(filter);
      }

    async update(email: string, data: Record<string, any>): Promise<T> {
        return await this.model.findOneAndUpdate(
            { email },
            { $set: data }, 
            { new: true, upsert: true }
        );
    }

    async findIdAndUpdate(id: string, data: Record<string, any>): Promise<T | null> {

        return await this.model.findByIdAndUpdate(
            id,
            {
                $set: {
                    "wallet.balance": data.balance,
                    "wallet.transactions": data.transactions,
                },
            },
            { new: true }
        );
    }


    
    async delete(filter: Record<string, any>): Promise<void> {
        await this.model.findOneAndDelete(filter);
    }
}