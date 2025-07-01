"use client";

import DonationComponent from "@/src/components/user/Donation";

export default function DonationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 py-20 px-4">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-purple-700 mb-4">
          Support Our Mission 💜
        </h1>
        <p className="text-gray-600 text-lg md:text-xl">
          Every contribution helps us continue delivering quality education to students across the globe.
        </p>
      </div>

      <div className="flex justify-center mb-12">
        <DonationComponent />
      </div>

      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Why Donate?</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-2 text-left">
          <li>Help provide free learning resources to underprivileged students.</li>
          <li>Support development of interactive learning tools and live sessions.</li>
          <li>Enable continuous platform improvement and content creation.</li>
        </ul>

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Where Your Money Goes</h3>
          <p className="text-gray-600">
            Donations directly support server infrastructure, educator compensation, content production,
            and scholarships for learners in need.
          </p>
        </div>
      </div>

      <footer className="mt-16 text-center text-sm text-gray-400">
        💡 Transparency is our promise — you'll receive updates on how your donation is used.
      </footer>
    </div>
  );
}
