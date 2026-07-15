import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  serviceId: mongoose.Types.ObjectId;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

const ReviewSchema: Schema = new Schema({
  serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);
