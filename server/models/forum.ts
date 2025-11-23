import mongoose, { Document, Schema } from 'mongoose';

export interface IForumTopic extends Document {
  title: string;
  content: string;
  category: 'general' | 'nutrition' | 'workouts' | 'motivation' | 'progress' | 'questions';
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  tags: string[];
  isPinned: boolean;
  isLocked: boolean;
  viewCount: number;
  likeCount: number;
  replies: {
    replyId: string;
    authorId: string;
    authorName: string;
    authorAvatar?: string;
    content: string;
    likeCount: number;
    createdAt: Date;
    updatedAt: Date;
  }[];
  lastActivityAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const forumTopicSchema = new Schema<IForumTopic>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['general', 'nutrition', 'workouts', 'motivation', 'progress', 'questions'],
    default: 'general',
    index: true
  },
  authorId: { type: String, required: true, index: true },
  authorName: { type: String, required: true },
  authorAvatar: String,
  tags: [String],
  isPinned: { type: Boolean, default: false },
  isLocked: { type: Boolean, default: false },
  viewCount: { type: Number, default: 0 },
  likeCount: { type: Number, default: 0 },
  replies: [{
    replyId: { type: String, required: true },
    authorId: { type: String, required: true },
    authorName: { type: String, required: true },
    authorAvatar: String,
    content: { type: String, required: true },
    likeCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }],
  lastActivityAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

forumTopicSchema.index({ isPinned: -1, lastActivityAt: -1 });
forumTopicSchema.index({ category: 1, lastActivityAt: -1 });

export const ForumTopic = mongoose.model<IForumTopic>('ForumTopic', forumTopicSchema);
