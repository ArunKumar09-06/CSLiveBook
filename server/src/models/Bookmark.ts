import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface IBookmark extends Document {
  userId: Types.ObjectId;
  conceptId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const BookmarkSchema = new Schema<IBookmark>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    conceptId: { type: Schema.Types.ObjectId, ref: 'Concept', required: true, index: true },
  },
  { timestamps: true }
);

// Compound unique index on { userId, conceptId } as per Section 4
BookmarkSchema.index({ userId: 1, conceptId: 1 }, { unique: true });

export const Bookmark: Model<IBookmark> = mongoose.model<IBookmark>('Bookmark', BookmarkSchema);
