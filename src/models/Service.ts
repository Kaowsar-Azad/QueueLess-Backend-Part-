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
  maxTokens: number;
  currentQueue: number;
  totalTokens: number;
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
  maxTokens: { type: Number, default: 50 },
  currentQueue: { type: Number, default: 0 },
  totalTokens: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema);
