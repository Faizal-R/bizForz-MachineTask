import { Model, Document,QueryFilter, UpdateQuery } from "mongoose";
import { IBaseRepository } from "../interfaces/base.repository.interface.js";
import { injectable, unmanaged } from "inversify";

@injectable()
export class BaseRepository<T extends Document> implements IBaseRepository<T> {
  constructor(@unmanaged() protected model: Model<T>) {}

  async create(item: Partial<T>): Promise<T> {
    return this.model.create(item);
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async findOne(filter: QueryFilter<T>): Promise<T | null> {
    return this.model.findOne(filter).exec();
  }

  async find(filter?: QueryFilter<T>): Promise<T[]> {
    return this.model.find(filter || {}).exec();
  }

  async update(id: string, update: UpdateQuery<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, update, { new: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return !!result;
  }
}
