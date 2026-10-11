import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface INote extends Document {
  userId: Types.ObjectId;
  conceptId: Types.ObjectId;
  blockId?: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    conceptId: { type: Schema.Types.ObjectId, ref: 'Concept', required: true, index: true },
    blockId: { type: String },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

NoteSchema.index({ userId: 1, conceptId: 1 });

export const Note: Model<INote> = mongoose.model<INote>('Note', NoteSchema);
