import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  serviceId: mongoose.Types.ObjectId;
  userId: string;
  userName: string;
  tokenNumber: number;
  status: 'pending' | 'served' | 'cancelled';
  createdAt: Date;
}

const BookingSchema: Schema = new Schema({
  serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  tokenNumber: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'served', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);
