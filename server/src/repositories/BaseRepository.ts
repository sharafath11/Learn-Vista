  import { Model, Document, FilterQuery, UpdateQuery, Types } from "mongoose";
  import { IBaseRepository } from "../core/interfaces/repositories/IBaseRepository";

  export abstract class BaseRepository<T extends Document, U> implements IBaseRepository<T, U> {
    protected model: Model<T>;
    constructor(model: Model<T>) {
      this.model = model;
    }
    // Modified to optionally include password
    // public toDTO(document: T, includePassword = false): U {
    //   const obj = document.toObject();
    //   const { _id, __v, ...rest } = obj;
    //   // Convert all ObjectIds to strings
    //   const converted = Object.entries(rest).reduce((acc, [key, value]) => {
    //     if (value instanceof Types.ObjectId) {
    //       acc[key] = value.toString();
    //     } else if (Array.isArray(value) && value.every(v => v instanceof Types.ObjectId)) {
    //       acc[key] = value.map(v => v.toString());
    //     } else {
    //       acc[key] = value;
    //     }
    //     return acc;
    //   }, {} as any);
    //   return { id: _id as string, ...converted } as unknown as U;
    // }
  public toDTO(document: T): U {
    const obj = document.toObject();
    const { _id, __v, password, updatedAt, ...rest } = obj;
    return { id: _id.toString(), ...rest } as unknown as U;
  }



    public handleError(error: unknown, message: string): Error {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return new Error(`${message}: ${errorMessage}`);
    }

    async create(data: Partial<T>): Promise<U> {
      try {
        const document = await this.model.create(data);
        return this.toDTO(document);
      } catch (error) {
        throw this.handleError(error, 'Error creating document');
      }
    }
    async count(filter: FilterQuery<T> = {}): Promise<number> {
    try {
      return await this.model.countDocuments(filter);
    } catch (error) {
      throw this.handleError(error, 'Error counting documents');
    }
  }

    async findAll(filter: FilterQuery<T> = {}): Promise<U[]> {
      try {
        const documents = await this.model.find(filter);
        return documents.map(doc => this.toDTO(doc));
      } catch (error) {
        throw this.handleError(error, 'Error fetching documents');
      }
    }
  async updateMany(filter: FilterQuery<T>, update: UpdateQuery<T>): Promise<number> {
    try {
      const result = await this.model.updateMany(filter, update);
      return result.modifiedCount; 
    } catch (error) {
      throw this.handleError(error, "Failed to update multiple documents");
    }
  }

    async findPaginated(
      filter: FilterQuery<T> = {},
      page: number = 1,
      limit?: number,
      search?: string,
      sort: Record<string, 1 | -1> = { createdAt: -1 }
    ): Promise<{ data: U[]; total: number; totalPages: number }> {
      try {
        
        const finalLimit =  2
        const skip = (page - 1) * finalLimit;
    
      
        if (search) {
          const searchRegex = new RegExp(search, 'i');
          filter.$or = [
            { username: { $regex: searchRegex } },
            { email: { $regex: searchRegex } },
            { tag: { $regex: searchRegex } },
            { title: { $regex: searchRegex } }
          ];
        }
      console.log("basefilter",filter)
        const [documents, total] = await Promise.all([
          this.model.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(finalLimit),
          this.model.countDocuments(filter),
        ]);
    
        const data = documents.map(doc => this.toDTO(doc));
        const totalPages = Math.ceil(total / finalLimit);
        
        return { data, total, totalPages };
      } catch (error) {
        throw this.handleError(error, 'Error fetching paginated documents');
      }
    }
    async updateOne(filter: FilterQuery<T>, update: UpdateQuery<T>): Promise<U | null> {
    try {
      const document = await this.model.findOneAndUpdate(filter, update, { new: true });
      return document ? this.toDTO(document) : null;
    } catch (error) {
      throw this.handleError(error, 'Error updating document with filter');
    }
  }

    async findById(id: string): Promise<U | null> {
      try {
        const document = await this.model.findById(id);
        return document ? this.toDTO(document) : null;
      } catch (error) {
        throw this.handleError(error, 'Error finding document by ID');
      }
    }

    async findOne(condition: FilterQuery<T>): Promise<U | null> {
      try {
        const document = await this.model.findOne(condition);
        return document ? this.toDTO(document) : null;
      } catch (error) {
        throw this.handleError(error, 'Error finding document');
      }
    }

    // with password
    async findWithPassword(condition: FilterQuery<T>): Promise<T | null> {
    try {
      return await this.model.findOne(condition).select('+password').exec();
    } catch (error) {
      throw this.handleError(error, 'Error finding document with password');
    }
  }


    async findOneWithPassword(condition: FilterQuery<T>): Promise<T | null> {
      try {
        return await this.model.findOne(condition).select('+password').exec();
      } catch (error) {
        throw this.handleError(error, 'Error finding document with password');
      }
    }

    async update(id: string, data: UpdateQuery<T>): Promise<U | null> {
      try {

        const document = await this.model.findByIdAndUpdate(
          id, 
          data, 
          { new: true }
        );
        return document ? this.toDTO(document) : null;
      } catch (error) {
        throw this.handleError(error, 'Error updating document');
      }
    }

    async delete(id: string): Promise<boolean> {
      try {
        const result = await this.model.findByIdAndDelete(id);
        return result !== null;
      } catch (error) {
        throw this.handleError(error, 'Error deleting document');
      }
    }
  }