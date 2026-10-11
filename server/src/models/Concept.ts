import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import { Difficulties, Difficulty } from '@csf/shared';

export interface IConcept extends Document {
  moduleId: Types.ObjectId;
  conceptCode: string;
  title: string;
  slug: string;
  description: string;
  estimatedMinutes: number;
  difficulty: Difficulty;
  prerequisites: Types.ObjectId[];
  tags: string[];
  order: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ConceptSchema = new Schema<IConcept>(
  {
    moduleId: { type: Schema.Types.ObjectId, ref: 'Module', required: true, index: true },
    conceptCode: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, index: true },
    description: { type: String, default: '' },
    estimatedMinutes: { type: Number, default: 15 },
    difficulty: { type: String, enum: Difficulties, default: 'BEGINNER' },
    prerequisites: [{ type: Schema.Types.ObjectId, ref: 'Concept' }],
    tags: { type: [String], default: [] },
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

// Compound unique index on { moduleId, conceptCode } as per Section 4
ConceptSchema.index({ moduleId: 1, conceptCode: 1 }, { unique: true });

// Text index on { title, description, tags } for global search
ConceptSchema.index({ title: 'text', description: 'text', tags: 'text' });

export const Concept: Model<IConcept> = mongoose.model<IConcept>('Concept', ConceptSchema);
