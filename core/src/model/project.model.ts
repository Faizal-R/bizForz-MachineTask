import { Schema, model, Document, Types } from "mongoose";

export interface IProject extends Document {
  tenantId: Types.ObjectId;
  name: string;
  description?: string;
  status: "planning" | "active" | "completed" | "on-hold";
  members: Types.ObjectId[]; 
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true, index: true },
    name: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["planning", "active", "completed", "on-hold"],
      default: "planning",
    },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

export const Project = model<IProject>("Project", ProjectSchema);
