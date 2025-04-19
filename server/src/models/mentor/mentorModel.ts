import { Schema, model } from 'mongoose';
import { IMentor, ISocialLink } from '../../types/mentorTypes';

const socialLinkSchema = new Schema<ISocialLink>({
  platform: {
    type: String,
    enum: ['LinkedIn', 'GitHub', 'Portfolio'],
   
  },
  url: {
    type: String,
   
  },
});

const mentorSchema = new Schema<IMentor>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  profilePicture: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  experience: {
    type: Number,
    
  },
  expertise: {
    type: [String],
    required: true,
  },
  
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  isBlock: {
    type: Boolean,
    default: false,
  },
  bio: {type:String},
  socialLinks: {
    type: [socialLinkSchema],
    default: [],
  },
  liveClasses: [{
    type: Schema.Types.ObjectId,
    ref: 'LiveClass',
  }],
  coursesCreated: [{
    type: Schema.Types.ObjectId,
    ref: 'Course',
  }],
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: 'Review',
  }],
  applicationDate: {
    type: Date,
    default: Date.now,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  cvOrResume: {
    type: String,
    required: true,
  }
}, {
  timestamps: true,
});

const MentorModel = model<IMentor>('Mentor', mentorSchema);
export default MentorModel;
