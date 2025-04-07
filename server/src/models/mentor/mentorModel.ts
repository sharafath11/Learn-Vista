import mongoose, { Schema } from 'mongoose';
import { IMentor } from '../../types/mentorTypes';
const allowedPlatforms = ["twitter", "github", "website"];
const MentorSchema: Schema = new Schema(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    profilePicture: { type: String, default: null },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String },
    phoneNumber:{type:String,required:true},
    username: { type: String, required: true, unique: true, trim: true },
    experience: { type: Number, min: 0, default: 0 },
    expertise: [{ type: String, trim: true }],
    status: { 
      type: String, 
      enum: ['pending' , 'approved' , 'rejected'],
      default: 'pending' 
    },
    isBlock:{type:Boolean,default:false},
    bio: { type: String, default: null },
    socialLinks: [
      {
        platform: {
          type: String,
          trim: true,
          lowercase: true,
          enum: ["twitter", "github", "website"], 
        },
        url: {
          type: String,
          trim: true,
          match: /^https?:\/\/[^\s$.?#].[^\s]*$/, 
        },
      },
    ],
    
    liveClasses: [{ type: Schema.Types.ObjectId, ref: 'LiveClass' }],
    coursesCreated: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
    applicationDate: { type: Date },
    
    isVerified: { type: Boolean, default: false },
    cvOrResume: { type: String, required: true }, 
  },
  { timestamps: true }
);

const mentorModel = mongoose.model<IMentor>('Mentor', MentorSchema);

export default mentorModel;
