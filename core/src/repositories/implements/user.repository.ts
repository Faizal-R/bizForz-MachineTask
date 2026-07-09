import { injectable } from "inversify";
import { BaseRepository } from "./base.repository.js";
import { IUser, User } from "../../model/user.model.js";
import { IUserRepository } from "../interfaces/user.repository.interface.js";
import { Types } from "mongoose";

@injectable()
export class UserRepository extends BaseRepository<IUser> implements IUserRepository {
  constructor() {
    super(User);
  }

  async findByEmailAndTenant(email: string, tenantId: string): Promise<IUser | null> {
    return this.model
      .findOne({ email, tenantId: new Types.ObjectId(tenantId) })
      .populate({
        path: "roles",
        populate: { path: "permissions" },
      })
      .populate("customPermissions")
      .exec();
  }

  async findUserWithPermissions(userId: string): Promise<IUser | null> {
    return this.model
      .findById(userId)
      .populate({
        path: "roles",
        populate: { path: "permissions" },
      })
      .populate("customPermissions")
      .exec();
  }

  async findTenantUsers(tenantId: string): Promise<IUser[]> {
    return this.model
      .find({ tenantId: new Types.ObjectId(tenantId) })
      .populate("roles")
      .populate("customPermissions")
      .exec();
  }

  async findByIdWithRelations(userId: string): Promise<IUser | null> {
    return this.model
      .findById(userId)
      .populate({
        path: "roles",
        populate: { path: "permissions" },
      })
      .populate("customPermissions")
      .exec();
  }

}
