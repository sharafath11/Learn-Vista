import { Model, Document, FilterQuery, UpdateQuery } from "mongoose";
import { IBaseRepository } from "../core/interfaces/repositories/IBaseRepository";
import { Messages } from "../constants/messages";

export abstract class BaseRepository<T extends Document, U>
  implements IBaseRepository<T, U>
{
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  public handleError(error: unknown, message: string): Error {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return new Error(`${message}: ${errorMessage}`);
  }

  async create(data: Partial<T>): Promise<U> {
    try {
      const result = await this.model.create(data);
      return result as unknown  as U
     
    } catch (error) {
      throw this.handleError(error, Messages.REPOSITORY.CREATE_ERROR);
    }
  }

  async count(filter: FilterQuery<T> = {}): Promise<number> {
    try {
      return await this.model.countDocuments(filter);
    } catch (error) {
      throw this.handleError(error, Messages.REPOSITORY.COUNT_ERROR);
    }
  }

  async findAll(filter: FilterQuery<T> = {}): Promise<U[]> {
    try {
    return await this.model.find(filter).lean().exec() as unknown as U[];
      
    } catch (error) {
      throw this.handleError(error, Messages.REPOSITORY.FIND_ALL_ERROR);
    }
  }

  async updateMany(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>
  ): Promise<number> {
    try {
      const result = await this.model.updateMany(filter, update);
      return result.modifiedCount;
    } catch (error) {
      throw this.handleError(error, Messages.REPOSITORY.UPDATE_MANY_ERROR);
    }
  }

  async findPaginated(
    filter: FilterQuery<T> = {},
    page: number = 1,
    limit: number = 2,
    search?: string,
    sort: Record<string, 1 | -1> = { createdAt: -1 }
  ): Promise<{ data: U[]; total: number; totalPages: number }> {
    try {
      const skip = (page - 1) * limit;

      if (search) {
        const searchRegex = new RegExp(search, "i");
        filter.$or = [
          { username: { $regex: searchRegex } },
          { email: { $regex: searchRegex } },
          { tag: { $regex: searchRegex } },
          { title: { $regex: searchRegex } },
        ];
      }

      const [documents, total] = await Promise.all([
        this.model.find(filter).sort(sort).skip(skip).limit(limit).lean().exec(),
        this.model.countDocuments(filter),
      ]);

      const totalPages = Math.ceil(total / limit);
      return {
        data: documents as unknown as U[],
        total,
        totalPages,
      };
    } catch (error) {
      throw this.handleError(error, Messages.REPOSITORY.FIND_PAGINATED_ERROR);
    }
  }

  async updateOne(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>
  ): Promise<U | null> {
    try {
      return await this.model.findOneAndUpdate(filter, update, { new: true });
      
    } catch (error) {
      throw this.handleError(error, Messages.REPOSITORY.UPDATE_ONE_ERROR);
    }
  }

  async findById(id: string): Promise<U | null> {
    try {
      return await this.model.findById(id);
    } catch (error) {
      throw this.handleError(error, Messages.REPOSITORY.FIND_BY_ID_ERROR);
    }
  }

  async findOne(condition: FilterQuery<T>): Promise<U | null> {
    try {
      return await this.model.findOne(condition);
      
    } catch (error) {
      throw this.handleError(error, Messages.REPOSITORY.FIND_ONE_ERROR);
    }
  }

  async findWithPassword(condition: FilterQuery<T>): Promise<T | null> {
    try {
      return await this.model.findOne(condition).select("+password").exec();
    } catch (error) {
      throw this.handleError(
        error,
        Messages.REPOSITORY.FIND_WITH_PASSWORD_ERROR
      );
    }
  }

  async findOneWithPassword(condition: FilterQuery<T>): Promise<T | null> {
    try {
      return await this.model.findOne(condition).select("+password").exec();
    } catch (error) {
      throw this.handleError(
        error,
        Messages.REPOSITORY.FIND_WITH_PASSWORD_ERROR
      );
    }
  }

  async update(id: string, data: UpdateQuery<T>): Promise<U | null> {
    try {
    return await this.model.findByIdAndUpdate(id, data, { new: true });
    
    } catch (error) {
      throw this.handleError(error, Messages.REPOSITORY.UPDATE_ERROR);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.model.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      throw this.handleError(error, Messages.REPOSITORY.DELETE_ERROR);
    }
  }
}
