  //// src/core/interfaces/repositories/IBaseRepository.ts
  import { Document, FilterQuery, UpdateQuery } from "mongoose";

  export interface IBaseRepository<T extends Document, U> {
    // CRUD Operations
    create(data: Partial<T>): Promise<U>;
    findAll(filter?: FilterQuery<T>): Promise<U[]>;
    findById(id: string): Promise<U | null>;
    findOne(condition: FilterQuery<T>): Promise<U | null>;
    update(id: string, data: UpdateQuery<T>): Promise<U | null>;
    delete(id: string): Promise<boolean>;
    findPaginated(
      filter: FilterQuery<T>,
      page: number
    ): Promise<{ data: U[]; total: number }>;
    
    // // Utility Methods - all public in interface
    // toDTO(document: T): U;
    handleError(error: unknown, message: string): Error;
  }