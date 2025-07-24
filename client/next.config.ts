import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Use remotePatterns for more granular control and future compatibility
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        // port: '', // Optional: specify if a non-standard port is used
        // pathname: '/**', // Optional: restrict to specific paths
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
      {
        // Add your S3 bucket hostname here to allow next/image to load images from it
        protocol: 'https',
        hostname: 'learn-vista.s3.ap-south-1.amazonaws.com',
        port: '',
        // This pathname allows images from any subfolder within your S3 bucket
        // Adjust if you want to restrict to specific paths like '/profile_pictures/**'
        pathname: '/**',
      },
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;
