import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import {
  ResourceTypes,
  ResourceType,
  ResourceSources,
  ResourceSource,
  VideoChapter,
  VideoMetadata,
} from '@csf/shared';

export interface IConceptResource extends Document {
  conceptId: Types.ObjectId;
  type: ResourceType;
  source: ResourceSource;
  content: string;
  metadata?: VideoMetadata;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VideoChapterSchema = new Schema<VideoChapter>(
  {
    timestamp: { type: Number, required: true },
    title: { type: String, required: true },
  },
  { _id: false }
);

const VideoMetadataSchema = new Schema<VideoMetadata>(
  {
    duration: { type: Number },
    size: { type: Number },
    format: { type: String },
    originalName: { type: String },
    chapters: { type: [VideoChapterSchema], default: [] },
  },
  { _id: false }
);

const ConceptResourceSchema = new Schema<IConceptResource>(
  {
    conceptId: { type: Schema.Types.ObjectId, ref: 'Concept', required: true, index: true },
    type: { type: String, enum: ResourceTypes, required: true },
    source: { type: String, enum: ResourceSources, required: true },
    content: { type: String, required: true },
    metadata: { type: VideoMetadataSchema },
    isPublished: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

// Compound unique index on { conceptId, type } as per Section 4
ConceptResourceSchema.index({ conceptId: 1, type: 1 }, { unique: true });

export const ConceptResource: Model<IConceptResource> = mongoose.model<IConceptResource>(
  'ConceptResource',
  ConceptResourceSchema
);
