import mongoose, { Schema, Document } from 'mongoose';

export interface IClientPersonalRecords extends Document {
  clientId: mongoose.Types.ObjectId;
  records: Array<{
    category: string;
    value: number;
    date: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const clientPersonalRecordsSchema = new Schema<IClientPersonalRecords>({
  clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true, unique: true, index: true },
  records: [{
    category: { type: String, required: true },
    value: { type: Number, required: true },
    date: { type: String, required: true },
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const ClientPersonalRecords = mongoose.model<IClientPersonalRecords>('ClientPersonalRecords', clientPersonalRecordsSchema);
