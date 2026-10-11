import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface IActivityLog extends Document {
  userId: Types.ObjectId;
  date: string; // YYYY-MM-DD
  minutes: number;
  conceptsTouched: number;
  quizzesTaken: number;
  createdAt: Date;
  updatedAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: String, required: true },
    minutes: { type: Number, default: 0 },
    conceptsTouched: { type: Number, default: 0 },
    quizzesTaken: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Compound unique index on { userId, date } as per Section 4
ActivityLogSchema.index({ userId: 1, date: 1 }, { unique: true });

export const ActivityLog: Model<IActivityLog> = mongoose.model<IActivityLog>(
  'ActivityLog',
  ActivityLogSchema
);
