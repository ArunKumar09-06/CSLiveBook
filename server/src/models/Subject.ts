import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ISubject extends Document {
  name: string;
  slug: string;
  description: string;
  icon: string;
  themeKey: string;
  order: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SubjectSchema = new Schema<ISubject>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, index: true },
    description: { type: String, default: '' },
    icon: { type: String, required: true },
    themeKey: { type: String, required: true }, // e.g. 'dbms', 'oop', 'os', 'cn', etc.
    order: { type: Number, default: 0, index: true },
    isPublished: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Subject: Model<ISubject> = mongoose.model<ISubject>('Subject', SubjectSchema);
