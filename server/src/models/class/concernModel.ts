import mongoose, { Schema, model, Model } from "mongoose"
import { IConcern } from "../../types/concernTypes"
import { Type } from "@aws-sdk/client-s3"

const concernSchema = new Schema<IConcern>({
  title:{type:String,required:true},
  message: {
    type: String,
    required: [true, "Description is required"],
    minlength: [10, "Description must be at least 10 characters"],
    maxlength: [1000, "Description cannot exceed 1000 characters"]
  },
  attachments: [{
    url: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['image', 'audio'],
      required: true
    },
    filename: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    }
  }],
  courseId: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },
  mentorId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  status: {
    type: String,
    enum: ["open", "in-progress", "resolved"],
    default: "open"
  },
  resolution: {
    type: String,
    default: "",
   
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
  
})

const ConcernModel: Model<IConcern> = model<IConcern>("Concern", concernSchema)

export default ConcernModel
