import { Schema, model, Document, Types } from "mongoose";

export interface IPermission extends Document {
  tenantId: Types.ObjectId | null;
  name: string; 
  description: string;
  category: string; 
  createdAt: Date;
  updatedAt: Date;
}

const PermissionSchema = new Schema<IPermission>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", default: null, index: true },
    name: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

PermissionSchema.index({ tenantId: 1, name: 1 }, { unique: true });

export const Permission = model<IPermission>("Permission", PermissionSchema);
