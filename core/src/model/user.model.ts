import { Schema, model, Document, Types } from "mongoose";
import bcrypt from "bcryptjs";
import { IRole } from "./role.model";
import { IPermission } from "./permission.model";

export interface IUser extends Document {
  tenantId: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  roles: Types.ObjectId[] | IRole[]; 
  customPermissions: Types.ObjectId[] | IPermission[]; 
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    roles: [{ type: Schema.Types.ObjectId, ref: "Role" }],
    customPermissions: [{ type: Schema.Types.ObjectId, ref: "Permission" }],
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);


UserSchema.index({ tenantId: 1, email: 1 }, { unique: true });

UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password || "");
};

export const User = model<IUser>("User", UserSchema);
