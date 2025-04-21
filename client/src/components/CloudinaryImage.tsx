// import Image from "next/image";

// interface CloudinaryImageProps {
//   src: string;
//   alt: string;
//   width: number;
//   height: number;
//   className?: string;
//   priority?: boolean;
//   quality?: number;
//   style?: React.CSSProperties;
// }

// export default function CloudinaryImage({
//   src,
//   alt,
//   width,
//   height,
//   className = "",
//   priority = false,
//   quality = 75,
//   style = {},
// }: CloudinaryImageProps) {
//   // Remove the base URL if present for optimization
//   const optimizedSrc = src.replace("https://res.cloudinary.com/dksofshjh", "");

//   return (
//     <Image
//       src={optimizedSrc}
//       alt={alt}
//       width={width}
//       height={height}
//       className={className}
//       priority={priority}
//       quality={quality}
//       style={style}
//       // Cloudinary-specific transformations
//       sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//     />
//   );
// }