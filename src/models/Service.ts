import mongoose, { Schema, Document } from "mongoose";

export interface IService extends Document {
  name: string;
  description: string;
  category: string;
  ownerId: string;
  ownerName: string;
  address: string;
  contactNumber: string;
  startHour: string;
  endHour: string;
  images?: string[];
  maxTokens: number;
  currentQueue: number;
  totalTokens: number;
  averageTimePerToken: number;
  createdAt: Date;
}

const ServiceSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  ownerId: { type: String, required: true },
  ownerName: { type: String, required: true },
  address: { type: String, required: true },
  contactNumber: { type: String, required: true },
  startHour: { type: String, required: true },
  endHour: { type: String, required: true },
  images: { type: [String], default: [] },
  maxTokens: { type: Number, default: 50 },
  currentQueue: { type: Number, default: 0 },
  totalTokens: { type: Number, default: 0 },
  averageTimePerToken: { type: Number, default: 20 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema);
