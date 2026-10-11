import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import { AttemptStatuses, AttemptStatus } from '@csf/shared';

export interface IAttemptAnswer {
  questionId: string;
  response: any;
  isCorrect: boolean;
  score: number;
}

export interface IAssessmentAttempt extends Document {
  userId: Types.ObjectId;
  assessmentId: Types.ObjectId;
  status: AttemptStatus;
  score: number; // percentage
  rawScore: number;
  maxScore: number;
  startedAt: Date;
  submittedAt?: Date;
  answers: IAttemptAnswer[];
  createdAt: Date;
  updatedAt: Date;
}

const AttemptAnswerSchema = new Schema<IAttemptAnswer>(
  {
    questionId: { type: String, required: true },
    response: { type: Schema.Types.Mixed },
    isCorrect: { type: Boolean, required: true },
    score: { type: Number, required: true },
  },
  { _id: false }
);

const AssessmentAttemptSchema = new Schema<IAssessmentAttempt>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    assessmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Assessment',
      required: true,
      index: true,
    },
    status: { type: String, enum: AttemptStatuses, default: 'IN_PROGRESS' },
    score: { type: Number, default: 0 },
    rawScore: { type: Number, default: 0 },
    maxScore: { type: Number, default: 0 },
    startedAt: { type: Date, default: Date.now },
    submittedAt: { type: Date },
    answers: { type: [AttemptAnswerSchema], default: [] },
  },
  { timestamps: true }
);

// Compound index on { userId, assessmentId, createdAt } as per Section 4
AssessmentAttemptSchema.index({ userId: 1, assessmentId: 1, createdAt: -1 });

export const AssessmentAttempt: Model<IAssessmentAttempt> = mongoose.model<IAssessmentAttempt>(
  'AssessmentAttempt',
  AssessmentAttemptSchema
);
