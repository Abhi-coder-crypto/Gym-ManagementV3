import mongoose, { Document, Schema } from 'mongoose';

export interface ITicket extends Document {
  ticketNumber: string;
  clientId: string;
  clientName: string;
  subject: string;
  category: 'technical' | 'billing' | 'account' | 'training' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'waiting-response' | 'resolved' | 'closed';
  description: string;
  attachments?: {
    type: string;
    url: string;
    name: string;
  }[];
  responses: {
    responderId: string;
    responderName: string;
    responderType: 'client' | 'support' | 'admin';
    message: string;
    attachments?: {
      type: string;
      url: string;
      name: string;
    }[];
    createdAt: Date;
  }[];
  assignedTo?: string;
  assignedToName?: string;
  resolvedAt?: Date;
  closedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ticketSchema = new Schema<ITicket>({
  ticketNumber: { type: String, required: true, unique: true },
  clientId: { type: String, required: true, index: true },
  clientName: { type: String, required: true },
  subject: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['technical', 'billing', 'account', 'training', 'general'],
    required: true 
  },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: { 
    type: String, 
    enum: ['open', 'in-progress', 'waiting-response', 'resolved', 'closed'],
    default: 'open',
    index: true
  },
  description: { type: String, required: true },
  attachments: [{
    type: String,
    url: String,
    name: String
  }],
  responses: [{
    responderId: { type: String, required: true },
    responderName: { type: String, required: true },
    responderType: { type: String, enum: ['client', 'support', 'admin'], required: true },
    message: { type: String, required: true },
    attachments: [{
      type: String,
      url: String,
      name: String
    }],
    createdAt: { type: Date, default: Date.now }
  }],
  assignedTo: String,
  assignedToName: String,
  resolvedAt: Date,
  closedAt: Date
}, {
  timestamps: true
});

ticketSchema.index({ clientId: 1, status: 1 });

export const Ticket = mongoose.model<ITicket>('Ticket', ticketSchema);
