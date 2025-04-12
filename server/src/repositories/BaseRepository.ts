// src/repositories/BaseRepository.ts
import { Model, Document, FilterQuery, UpdateQuery, Types } from "mongoose";
import { IBaseRepository } from "../core/interfaces/repositories/IBaseRepository";

export abstract class BaseRepository<T extends Document, U> implements IBaseRepository<T, U> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  public toDTO(document: T): U {
    const obj = document.toObject();
    const { _id, __v, password, ...rest } = obj;
    
    // Convert all ObjectIds to strings
    const converted = Object.entries(rest).reduce((acc, [key, value]) => {
      if (value instanceof Types.ObjectId) {
        acc[key] = value.toString();
      } else if (Array.isArray(value) && value.every(v => v instanceof Types.ObjectId)) {
        acc[key] = value.map(v => v.toString());
      } else {
        acc[key] = value;
      }
      return acc;
    }, {} as any);

    return { id: _id.toString(), ...converted } as unknown as U;
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

  async findAll(filter: FilterQuery<T> = {}): Promise<U[]> {
    try {
      const documents = await this.model.find(filter).lean();
      return documents.map(doc => this.toDTO(doc as unknown as T));
    } catch (error) {
      throw this.handleError(error, 'Error fetching documents');
    }
  }

  async findById(id: string): Promise<U | null> {
    try {
      const document = await this.model.findById(id).lean();
      return document ? this.toDTO(document as unknown as T) : null;
    } catch (error) {
      throw this.handleError(error, 'Error finding document by ID');
    }
  }

  async findOne(condition: FilterQuery<T>): Promise<U | null> {
    try {
      const document = await this.model.findOne(condition).lean();
      return document ? this.toDTO(document as unknown as T) : null;
    } catch (error) {
      throw this.handleError(error, 'Error finding document');
    }
  }

  async update(id: string, data: UpdateQuery<T>): Promise<U | null> {
    try {
      const document = await this.model.findByIdAndUpdate(
        id, 
        data, 
        { new: true }
      ).lean();
      return document ? this.toDTO(document as unknown as T) : null;
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