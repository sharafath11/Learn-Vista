import { Types } from "mongoose";

export const toObjectId = (id: string | Types.ObjectId): Types.ObjectId =>
  typeof id === "string" ? new Types.ObjectId(id) : id;
