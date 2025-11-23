import mongoose, { Schema, Document } from 'mongoose';

export interface IClientWeightTracking extends Document {
  clientId: mongoose.Types.ObjectId;
  entries: Array<{
    weight: number;
    date: string;
  }>;
  goal: number | null;
  createdAt: Date;
  updatedAt: Date;
}

const clientWeightTrackingSchema = new Schema<IClientWeightTracking>({
  clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true, unique: true, index: true },
  entries: [{
    weight: { type: Number, required: true },
    date: { type: String, required: true },
  }],
  goal: { type: Number, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const ClientWeightTracking = mongoose.model<IClientWeightTracking>('ClientWeightTracking', clientWeightTrackingSchema);
