"use client"
import { useState } from "react";
import type { SocialLink, IMentorSignupData } from "@/src/types/mentorTypes";
import { IMentorSocialLinksInputProps } from "@/src/types/mentorProps";


export const SocialLinksInput = ({
  mentorData,
  onAddSocialLink,
  onRemoveSocialLink
}: IMentorSocialLinksInputProps) => {
  const [socialLinkInput, setSocialLinkInput] = useState<Omit<SocialLink, 'url'> & { url: string }>({
    platform: "github",
    url: ""
  });

  const handleSocialLinkChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSocialLinkInput({
      ...socialLinkInput,
      [name]: name === 'platform' ? value as SocialLink['platform'] : value
    });
  };

  const handleAddSocialLink = () => {
    if (socialLinkInput.url.trim()) {
      const newLink: SocialLink = {
        platform: socialLinkInput.platform,
        url: socialLinkInput.url
      };
      onAddSocialLink(newLink);
      setSocialLinkInput({
        platform: "github",
        url: ""
      });
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700">Social Links (Optional)</h3>
      
      <div className="flex gap-2">
        <div className="flex-1">
          <label htmlFor="socialPlatform" className="block text-sm font-medium text-gray-700 mb-1">
            Platform
          </label>
          <select
            id="socialPlatform"
            name="platform"
            value={socialLinkInput.platform}
            onChange={handleSocialLinkChange}
            className="block w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-colors"
          >
            <option value="github">GitHub</option>
            <option value="twitter">Twitter</option>
            <option value="website">Website</option>
          </select>
        </div>
        <div className="flex-1">
          <label htmlFor="socialUrl" className="block text-sm font-medium text-gray-700 mb-1">
            URL
          </label>
          <input
            type="url"
            id="socialUrl"
            name="url"
            value={socialLinkInput.url}
            onChange={handleSocialLinkChange}
            className="block w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-colors"
            placeholder="https://example.com"
          />
        </div>
        <div className="flex items-end">
          <button
            type="button"
            onClick={handleAddSocialLink}
            className="h-[42px] rounded-lg bg-purple-600 px-3 text-white hover:bg-purple-700 transition-colors"
          >
            Add
          </button>
        </div>
      </div>
      
      {mentorData.socialLinks && mentorData.socialLinks.length > 0 && (
        <div className="mt-2 space-y-2">
          {mentorData.socialLinks.map((link, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
              <div>
                <span className="text-sm font-medium capitalize">{link.platform}:</span>
                <span className="text-sm text-gray-600 ml-2">{link.url}</span>
              </div>
              <button
                type="button"
                onClick={() => onRemoveSocialLink(index)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};