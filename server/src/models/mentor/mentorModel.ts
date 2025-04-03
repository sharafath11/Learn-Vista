import mongoose, { Schema } from 'mongoose';
import { IMentor } from '../../types/mentorTypes';

const MentorSchema: Schema = new Schema(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    profilePicture: { type: String, default: null },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, },
    username: { type: String, required: true, unique: true, trim: true },
    experience: { type: Number, min: 0, default: 0 },
    expertise: [{ type: String, trim: true }],
    status: { 
      type: String, 
      enum: ['pending', 'active', 'inactive', 'banned', 'rejected'],
      default: 'pending' 
    },
    bio: { type: String, default: null },
    socialLinks: [
      {
        platform: { type: String, trim: true },
        url: { type: String, trim: true },
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
