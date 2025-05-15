// import mongoose, { Schema } from 'mongoose';
// import { ISessionDocument } from '../../types/classTypes';

// const SessionSchema: Schema = new Schema(
//   {
//     title: { type: String, required: true },
//     duration: { type: Number, required: true },
//     content: { type: String },
//     courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
//     videoUrl: { type: String, required: true },
//     order: { type: Number },
//     isPreview: { type: Boolean, default: false },
//     resources: [{ type: String }],
//     liveSessionId: { type: Schema.Types.ObjectId, ref: 'LiveSession' },
//     questionId: { type: Schema.Types.ObjectId, ref: 'Question' }
//   },
//   { timestamps: true }
// );

// const Session = mongoose.model<ISessionDocument>('Session', SessionSchema);

// export default Session;
