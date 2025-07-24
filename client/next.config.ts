import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "res.cloudinary.com",
      "lh3.googleusercontent.com",
      "images.unsplash.com",
      "source.unsplash.com" // ← Add this line
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;
