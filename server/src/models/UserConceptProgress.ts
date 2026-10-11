import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import { ConceptStatuses, ConceptStatus } from '@csf/shared';

export interface IUserConceptProgress extends Document {
  userId: Types.ObjectId;
  conceptId: Types.ObjectId;
  status: ConceptStatus;
  startedAt?: Date;
  completedAt?: Date;
  lastAccessedAt: Date;
  bestScore?: number;
  attemptsCount: number;
  lastBlockId?: string;
  videoPositionSec: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserConceptProgressSchema = new Schema<IUserConceptProgress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    conceptId: { type: Schema.Types.ObjectId, ref: 'Concept', required: true, index: true },
    status: { type: String, enum: ConceptStatuses, default: 'NOT_STARTED', index: true },
    startedAt: { type: Date },
    completedAt: { type: Date },
    lastAccessedAt: { type: Date, default: Date.now },
    bestScore: { type: Number },
    attemptsCount: { type: Number, default: 0 },
    lastBlockId: { type: String },
    videoPositionSec: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Compound unique index on { userId, conceptId } as per Section 4
UserConceptProgressSchema.index({ userId: 1, conceptId: 1 }, { unique: true });

export const UserConceptProgress: Model<IUserConceptProgress> =
  mongoose.model<IUserConceptProgress>('UserConceptProgress', UserConceptProgressSchema);
