
import { Decimal128, Document, ObjectId, Types } from "mongoose";
import { IMentor } from "./mentorTypes";

export interface ISessionDocument extends ISession, Document {
  _id: ObjectId; 
}

// export interface ISession extends Document {
//   _id: ObjectId;
//   title: string;
//   duration: number;
//   content?: string;
//   courseId: ObjectId;
//   videoUrl: string;
//   order?: number;
//   isPreview?: boolean;
//   resources?: string[];
//   createdAt: Date;
//   updatedAt: Date;
//   liveSessionId?: ObjectId;
//   practicalId?: ObjectId;
// }

export interface ICourse extends Document {
  _id: ObjectId;
  title: string;
  description?: string;
  mentorId: ObjectId;
  sessions: ObjectId[];
  categoryId: ObjectId;
  mentor:IMentor
  price?: number;
  students: number,
  categoryName:string,
  courseLanguage?: string;
  isBlock: boolean;
  tags?: string[];
  enrolledUsers:string[]
  // mentorApproved: boolean
  lessons:ObjectId[]|string[],
  category:ICategory
  mentorStatus: "approved" | "rejected"|"pending";
  isCompleted:boolean
  currentTag?: string;    
  startDate?: string;      
  endDate?: string;       
  startTime?: string;      
  thumbnail?: string;
  thumbnailPreview?: string | null; 
  createdAt: Date;
  updatedAt: Date;
}
export interface IPopulatedCourse extends Omit<ICourse, 'mentorId' | 'categoryId'> {
  mentorId: IMentor;   
  categoryId: ICategory;
}


  export interface ICategory extends Document {
    title: string;
    description: string;
    isBlock:boolean,
    createdAt?: Date;
    updatedAt?: Date;
  }
 export interface ICourseFormData {
    title: string
    description: string
    mentorId: string
    categoryId: string
    category?: string
    price: string
    language: string
    tags: string[]
    currentTag: string
    startDate: string
    endDate: string
    startTime: string
    thumbnail?: File | null
    thumbnailPreview: string | null
  }
  export interface ILiveClass extends Document {
    _id: ObjectId;
    courseId:Types.ObjectId;
    mentorId:Types.ObjectId;
    date: Date;
    duration: string;
    liveId: string;
    participants: { userId: ObjectId }[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    isEnd:boolean

  }
  
  export interface ISession extends Document {
    _id: ObjectId;
    title: string;
    duration: number;
    courseId: ObjectId;
    videoUrl?: string;
    liveSessionId?: ObjectId;  
    createdAt: Date;
    updatedAt: Date;
  }
  