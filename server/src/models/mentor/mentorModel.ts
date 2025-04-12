import { Schema, model, Document, Types } from 'mongoose';
import { IMentor, ISocialLink } from '../../types/mentorTypes';

const socialLinkSchema = new Schema<ISocialLink>({
  platform: { 
    type: String, 
    enum: ['twitter', 'github', 'website'], 
    required: true 
  },
  url: { 
    type: String, 
    required: true,
    validate: {
      validator: (value: string) => {
        return /^(https?:\/\/)/.test(value);
      },
      message: 'URL must start with http:// or https://'
    }
  }
});

const mentorSchema = new Schema<IMentor>({
  userId: { 
    type: Schema.Types.ObjectId, 
    required: true, 
    ref: 'User' 
  },
  profilePicture: { 
    type: String 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: { 
    type: String, 
    required: true,
    minlength: [8, 'Password must be at least 8 characters long']
  },
  phoneNumber: { 
    type: String, 
    required: true,
    match: [/^[0-9]{10,15}$/, 'Please fill a valid phone number']
  },
  username: { 
    type: String, 
    required: true, 
    unique: true,
    minlength: [3, 'Username must be at least 3 characters long']
  },
  experience: { 
    type: Number, 
    required: true,
    min: [0, 'Experience cannot be negative']
  },
  expertise: { 
    type: [String], 
    required: true,
    validate: {
      validator: (value: string[]) => value.length > 0,
      message: 'At least one expertise is required'
    }
  },
  googleMentor: { 
    type: Boolean, 
    default: false 
  },
  role: { 
    type: String, 
    default: 'mentor',
    enum: ['mentor']
  },
  googleId: { 
    type: String 
  },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  isBlock: { 
    type: Boolean, 
    default: false 
  },
  bio: { 
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  socialLinks: { 
    type: [socialLinkSchema], 
    default: [] 
  },
  liveClasses: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'LiveClass' 
  }],
  coursesCreated: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Course' 
  }],
  reviews: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Review' 
  }],
  applicationDate: { 
    type: Date, 
    default: Date.now 
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  cvOrResume: { 
    type: String, 
    required: true 
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function (doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      delete ret.password;
      return ret;
    }
  },
  toObject: {
    transform: function (doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      delete ret.password;
      return ret;
    }
  }
});

// Add text index for search functionality
mentorSchema.index({
  username: 'text',
  email: 'text',
  bio: 'text',
  expertise: 'text'
});

// Pre-save hook for additional validation
mentorSchema.pre('save', function(next) {
  if (this.googleMentor && !this.googleId) {
    throw new Error('Google mentors must have a googleId');
  }
  next();
});

const MentorModel = model<IMentor>('Mentor', mentorSchema);

export default MentorModel;