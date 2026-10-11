import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface IModule extends Document {
  subjectId: Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  order: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ModuleSchema = new Schema<IModule>(
  {
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, index: true },
    description: { type: String, default: '' },
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

// Compound index on { subjectId, order } as per Section 4
ModuleSchema.index({ subjectId: 1, order: 1 });

export const Module: Model<IModule> = mongoose.model<IModule>('Module', ModuleSchema);
