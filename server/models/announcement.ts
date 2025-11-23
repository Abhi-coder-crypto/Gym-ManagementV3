import mongoose, { Document, Schema } from 'mongoose';

export interface IAnnouncement extends Document {
  title: string;
  content: string;
  category: 'general' | 'maintenance' | 'event' | 'promotion' | 'policy' | 'emergency';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  authorId: string;
  authorName: string;
  targetAudience: 'all' | 'basic' | 'premium' | 'elite';
  images?: string[];
  isPinned: boolean;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const announcementSchema = new Schema<IAnnouncement>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['general', 'maintenance', 'event', 'promotion', 'policy', 'emergency'],
    default: 'general'
  },
  priority: { 
    type: String, 
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  authorId: { type: String, required: true },
  authorName: { type: String, required: true },
  targetAudience: { 
    type: String, 
    enum: ['all', 'basic', 'premium', 'elite'],
    default: 'all'
  },
  images: [String],
  isPinned: { type: Boolean, default: false },
  expiresAt: Date
}, {
  timestamps: true
});

announcementSchema.index({ isPinned: -1, createdAt: -1 });
announcementSchema.index({ targetAudience: 1, createdAt: -1 });

export const Announcement = mongoose.model<IAnnouncement>('Announcement', announcementSchema);
