import { Model, Document, FilterQuery, UpdateQuery } from "mongoose";

export abstract class BaseRepository<T extends Document, U> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  protected toDTO(document: T): U {
    const { _id, __v, ...rest } = document.toObject();
    return { id: _id.toString(), ...rest } as unknown as U;
  }

  async create(data: Partial<T>): Promise<U> {
    try {
      const document = await this.model.create(data);
      return this.toDTO(document);
    } catch (error) {
      throw this.handleError(error, 'Error creating document');
    }
  }

  async findAll(): Promise<U[]> {
    try {
      const documents = await this.model.find().lean();
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
      const document = await this.model.findByIdAndUpdate(id, data, { 
        new: true 
      }).lean();
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

  private handleError(error: unknown, message: string): Error {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Error(`${message}: ${errorMessage}`);
  }
}