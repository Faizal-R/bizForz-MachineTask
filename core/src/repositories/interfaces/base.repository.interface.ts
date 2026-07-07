import { Document, QueryFilter, UpdateQuery } from "mongoose";

export interface IBaseRepository<T extends Document> {
  create(item: Partial<T>): Promise<T>;
  findById(id: string): Promise<T | null>;
  findOne(filter: QueryFilter<T>): Promise<T | null>;
  find(filter: QueryFilter<T>): Promise<T[]>;
  update(id: string, update: UpdateQuery<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}
