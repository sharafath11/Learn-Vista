import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;





// const uploadImage = async (imagePath) => {
//     try {
//       const result = await cloudinary.uploader.upload(imagePath, {
//         folder: "LearnVista"
//       });
//       console.log(result);
//     } catch (error) {
//       console.error(error);
//     }
//   };
  
//   uploadImage("path/to/your/image.jpg");