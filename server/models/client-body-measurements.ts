import mongoose, { Schema, Document } from 'mongoose';

export interface IClientBodyMeasurements extends Document {
  clientId: mongoose.Types.ObjectId;
  entries: Array<{
    chest?: number;
    waist?: number;
    hips?: number;
    shoulders?: number;
    date: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const clientBodyMeasurementsSchema = new Schema<IClientBodyMeasurements>({
  clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true, unique: true, index: true },
  entries: [{
    chest: { type: Number },
    waist: { type: Number },
    hips: { type: Number },
    shoulders: { type: Number },
    date: { type: String, required: true },
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const ClientBodyMeasurements = mongoose.model<IClientBodyMeasurements>('ClientBodyMeasurements', clientBodyMeasurementsSchema);
