import mongoose, { Schema, Document } from "mongoose";
import { ICategory } from "../../types/classTypes";


export interface ICategoryModel extends ICategory, Document {}

const CategorySchema: Schema = new Schema<ICategoryModel>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    isBlock:{type:Boolean,required:true,default:false}
  },
  {
    timestamps: true,
  }
);

const CategoryModel = mongoose.model<ICategoryModel>("Category", CategorySchema);
export default CategoryModel;