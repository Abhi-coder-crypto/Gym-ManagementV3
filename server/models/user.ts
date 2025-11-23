import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  role: 'client' | 'admin' | 'trainer';
  name?: string;
  phone?: string;
  clientId?: string;
  trainerId?: string;
  status?: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['client', 'admin', 'trainer'], required: true, default: 'client' },
  name: { type: String },
  phone: { type: String },
  clientId: { type: Schema.Types.ObjectId, ref: 'Client' },
  trainerId: { type: Schema.Types.ObjectId, ref: 'Trainer' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

export const User = mongoose.model<IUser>('User', UserSchema);
