import mongoose, { Schema} from "mongoose";
import { ICategory } from "../../types/classTypes";



const CategorySchema: Schema = new Schema<ICategory>(
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

const CategoryModel = mongoose.model<ICategory>("Category", CategorySchema);
export default CategoryModel;