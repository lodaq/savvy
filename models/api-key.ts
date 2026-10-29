import mongoose, { Document, Model, Schema, models, model } from 'mongoose';

export interface IApiKey extends Document {
  userId: string;
  name: string;
  keyHash: string;
  keyPrefix: string; // e.g. sv_live_abc123... (first few chars for UI identification)
  createdAt: Date;
  lastUsedAt?: Date;
}

const apiKeySchema = new Schema<IApiKey>(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, default: 'Default API Key' },
    keyHash: { type: String, required: true, unique: true },
    keyPrefix: { type: String, required: true },
    lastUsedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

export const ApiKeyModel: Model<IApiKey> =
  models.ApiKey || model<IApiKey>('ApiKey', apiKeySchema);

export default ApiKeyModel;
