import { Model, Document, FilterQuery, UpdateQuery } from "mongoose";

export class BaseRepository<T extends Document> {
  private model: Model<T>;

    constructor(model: Model<T>) {
      //this acces the model
    this.model = model;
  }
  async create(data: Partial<T>): Promise<T> {
    try {
      return await this.model.create(data);
    } catch (error) {
      throw new Error(`Error creating document: ${(error as Error).message}`);
    }
  }
  async findAll(): Promise<T[]> {
    try {
      return await this.model.find();
    } catch (error) {
      throw new Error(`Error fetching documents: ${(error as Error).message}`);
    }
  }
  async findById(id: string): Promise<T | null> {
    try {
      return await this.model.findById(id);
    } catch (error) {
      throw new Error(`Error finding document by ID: ${(error as Error).message}`);
    }
  }
  async findOne(condition: FilterQuery<T>): Promise<T | null> {
    try {
      return await this.model.findOne(condition);
    } catch (error) {
      throw new Error(`Error finding document: ${(error as Error).message}`);
    }
  }
  async update(id: string, data: UpdateQuery<T>): Promise<T | null> {
    try {
      return await this.model.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      throw new Error(`Error updating document: ${(error as Error).message}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.model.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      throw new Error(`Error deleting document: ${(error as Error).message}`);
    }
  }
}
