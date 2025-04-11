import { Model, Document, FilterQuery, UpdateQuery, Types } from "mongoose";

export abstract class BaseRepository<T extends Document, U> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  protected toDTO(document: T): U {
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

  async create(data: Partial<T>): Promise<U> {
    try {
      const document = await this.model.create(data);
      return this.toDTO(document);
    } catch (error) {
      throw this.handleError(error, 'Error creating document');
    }
  }

  // ... (other methods same as before)
}