// import userRepository from "../repositories/user/userRepository";
// import MentorRepo from "../repositories/mentor/MentorRepository";

// interface GoogleSignupPayload {
//   username: string;
//   email: string;
//   image?: string | null;
//   googleId: string;
//   role: "user" | "mentor";
// }

// interface GoogleSignupResult {
//   user: {
//     _id: string;
//     username: string;
//     email: string;
//     image?: string;
//     role: "user" | "mentor";
//   };
//   message: string;
// }
// export const handleGoogleSignup = async (
//   payload: GoogleSignupPayload
// ): Promise<GoogleSignupResult> => {
//   const { username, email, image, googleId, role } = payload;

//   if (!email || !googleId || !username || !role) {
//     throw new Error("Missing required fields");
//   }

//   let user: any;

//   if (role === "user") {
//     user = await userRepository.findOne({ email });

//     if (user) {
//       // Update existing user
//       user.username = username;
//       user.profilePicture = image || user.profilePicture;
//       user.googleId = googleId;
//       user.googleUser = true;
//       user = await user.save();
//     } else {
//       // Create new user
//       user = await userRepository.create({
//         username,
//         email,
//         profilePicture: image || undefined,
//         googleId,
//         role,
//         googleUser: true,
//       });
//     }

//   } else {
//     user = await MentorRepo.findOne({ email });

//     if (user) {
//       // Update existing mentor
//       user.username = username;
//       user.profilePicture = image || user.profilePicture;
//       user.googleId = googleId;
//       user.googleMentor = true;
//       user = await user.save();
//     } else {
//       // Create new mentor
//       user = await MentorRepo.create({
//         username,
//         email,
//         profilePicture: image || undefined,
//         googleId,
//         googleMentor: true,
//       });
//     }
//   }

//   if (!user) throw new Error("Signup failed");

//   return {
//     message: "Signup successful",
//     user: {
//       _id: user._id.toString(),
//       username: user.username,
//       email: user.email,
//       image: user.profilePicture || undefined,
//       role,
//     },
//   };
// };


