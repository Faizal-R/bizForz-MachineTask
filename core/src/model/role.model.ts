import { Schema, model, Document, Types } from "mongoose";
import { IPermission } from "./permission.model.js";

export interface IRole extends Document {
  tenantId: Types.ObjectId;
  name: string;
  description?: string;
  permissions: Types.ObjectId[] | IPermission[]; 
  createdAt: Date;
  updatedAt: Date;
}

const RoleSchema = new Schema<IRole>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true, index: true },
    name: { type: String, required: true },
    description: { type: String },
    permissions: [{ type: Schema.Types.ObjectId, ref: "Permission" }],
  },
  {
    timestamps: true,
  }
);

// Role name must be unique within a tenant
RoleSchema.index({ tenantId: 1, name: 1 }, { unique: true });

export const Role = model<IRole>("Role", RoleSchema);
