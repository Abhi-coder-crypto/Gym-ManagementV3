import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  conversationId: string;
  senderId: string;
  senderType: 'client' | 'trainer' | 'admin';
  senderName: string;
  receiverId: string;
  receiverType: 'client' | 'trainer' | 'admin';
  receiverName: string;
  content: string;
  attachments?: {
    type: 'image' | 'file' | 'video';
    url: string;
    name: string;
  }[];
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>({
  conversationId: { type: String, required: true, index: true },
  senderId: { type: String, required: true, index: true },
  senderType: { type: String, enum: ['client', 'trainer', 'admin'], required: true },
  senderName: { type: String, required: true },
  receiverId: { type: String, required: true, index: true },
  receiverType: { type: String, enum: ['client', 'trainer', 'admin'], required: true },
  receiverName: { type: String, required: true },
  content: { type: String, required: true },
  attachments: [{
    type: { type: String, enum: ['image', 'file', 'video'] },
    url: String,
    name: String
  }],
  isRead: { type: Boolean, default: false },
  readAt: Date
}, {
  timestamps: true
});

messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ senderId: 1, receiverId: 1 });

export const Message = mongoose.model<IMessage>('Message', messageSchema);
