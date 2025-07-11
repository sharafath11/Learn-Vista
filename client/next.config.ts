import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['res.cloudinary.com','lh3.googleusercontent.com', 'images.unsplash.com'],
    // Alternative using remotePatterns (choose one):
    // remotePatterns: [
    //   {
    //     protocol: "https",
    //     hostname: "res.cloudinary.com",
    //   },
    // ],
  },
  reactStrictMode: true,
};

export default nextConfig;