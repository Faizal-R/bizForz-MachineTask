import { Schema, model, Document } from "mongoose";

export interface ITenant extends Document {
  name: string;
  slug: string;
  status: "active" | "suspended" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

const TenantSchema = new Schema<ITenant>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    status: {
      type: String,
      enum: ["active", "suspended", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

export const Tenant = model<ITenant>("Tenant", TenantSchema);
