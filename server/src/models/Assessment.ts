import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import { AssessmentTypes, AssessmentType, QuestionTypes, QuestionType } from '@csf/shared';

export interface IQuestionOption {
  id: string;
  text: string;
}

export interface IQuestion {
  _id?: Types.ObjectId;
  type: QuestionType;
  prompt: string;
  options: IQuestionOption[];
  correctAnswer: any; // Schema select: false
  explanation: string;
  points: number;
  order: number;
  tags: string[];
  learningObjective?: string;
}

export interface IAssessment extends Document {
  conceptId?: Types.ObjectId;
  moduleId?: Types.ObjectId;
  type: AssessmentType;
  title: string;
  description: string;
  timeLimit: number; // in seconds
  passingScore: number;
  isPublished: boolean;
  questions: IQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

const QuestionOptionSchema = new Schema<IQuestionOption>(
  {
    id: { type: String, required: true },
    text: { type: String, required: true },
  },
  { _id: false }
);

const QuestionSchema = new Schema<IQuestion>(
  {
    type: { type: String, enum: QuestionTypes, required: true },
    prompt: { type: String, required: true },
    options: { type: [QuestionOptionSchema], default: [] },
    // CRITICAL: correctAnswer must NEVER be selected in learner-facing queries
    correctAnswer: { type: Schema.Types.Mixed, required: true, select: false },
    explanation: { type: String, required: true },
    points: { type: Number, default: 1 },
    order: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    learningObjective: { type: String },
  },
  { _id: true }
);

const AssessmentSchema = new Schema<IAssessment>(
  {
    conceptId: { type: Schema.Types.ObjectId, ref: 'Concept', index: true },
    moduleId: { type: Schema.Types.ObjectId, ref: 'Module', index: true },
    type: { type: String, enum: AssessmentTypes, required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    timeLimit: { type: Number, default: 600 },
    passingScore: { type: Number, default: 70 },
    isPublished: { type: Boolean, default: true, index: true },
    questions: { type: [QuestionSchema], default: [] },
  },
  { timestamps: true }
);

export const Assessment: Model<IAssessment> = mongoose.model<IAssessment>(
  'Assessment',
  AssessmentSchema
);
