import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import { ContentBlock, TableOfContentsItem } from '@csf/shared';

export interface IConceptContent extends Document {
  conceptId: Types.ObjectId;
  blocks: ContentBlock[];
  version: number;
  tableOfContents: TableOfContentsItem[];
  createdAt: Date;
  updatedAt: Date;
}

const TableOfContentsSchema = new Schema<TableOfContentsItem>(
  {
    id: { type: String, required: true },
    text: { type: String, required: true },
    level: { type: Number, required: true, min: 1, max: 4 },
  },
  { _id: false }
);

const ConceptContentSchema = new Schema<IConceptContent>(
  {
    conceptId: {
      type: Schema.Types.ObjectId,
      ref: 'Concept',
      required: true,
      unique: true,
      index: true,
    },
    blocks: { type: [Schema.Types.Mixed] as any, default: [] },
    version: { type: Number, default: 1 },
    tableOfContents: { type: [TableOfContentsSchema], default: [] },
  },
  { timestamps: true }
);

export const ConceptContent: Model<IConceptContent> = mongoose.model<IConceptContent>(
  'ConceptContent',
  ConceptContentSchema
);
