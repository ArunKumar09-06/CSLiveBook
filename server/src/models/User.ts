import mongoose, { Document, Model, Schema } from 'mongoose';
import { Roles, Role } from '@csf/shared';

export interface IUserPreferences {
  theme: 'dark' | 'light' | 'system';
  reducedMotion: boolean;
}

export interface IUserStreak {
  current: number;
  longest: number;
  lastActiveDate: string; // YYYY-MM-DD
}

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  avatarUrl?: string;
  preferences: IUserPreferences;
  streak: IUserStreak;
  xp: number;
  badges: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: Roles, default: 'STUDENT', index: true },
    avatarUrl: { type: String, default: '' },
    preferences: {
      theme: { type: String, enum: ['dark', 'light', 'system'], default: 'dark' },
      reducedMotion: { type: Boolean, default: false },
    },
    streak: {
      current: { type: Number, default: 0 },
      longest: { type: Number, default: 0 },
      lastActiveDate: { type: String, default: '' },
    },
    xp: { type: Number, default: 0 },
    badges: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);
