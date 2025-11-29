import { MentorAPIMethods } from "@/src/services/methods/mentor.api";
import { showErrorToast } from "@/src/utils/Toast";

export const handleLocalVideoDuration = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const objectURL = URL.createObjectURL(file);    
    const video = document.createElement("video");
    video.preload = "metadata";
    video.src = objectURL;

    const handleLoadedMetadata = () => {
      const duration = video.duration;
      URL.revokeObjectURL(objectURL);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("error", handleError);
      resolve(duration);
    };

    const handleError = (e: Event | string) => {
      URL.revokeObjectURL(objectURL);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("error", handleError);
      reject(new Error("Could not retrieve video duration."));
    };
    
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("error", handleError);
  });
};

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const pad = (num: number) => num.toString().padStart(2, "0");

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;
  }
  return `${pad(minutes)}:${pad(remainingSeconds)}`;
};

export const handleS3VideoUpload = async (file: File): Promise<string> => {
  const res = await MentorAPIMethods.getS3DirectUploadUrl(
    file.name,
    file.type
  );
  
  if (!res.ok || !res.data?.signedUploadUrl || !res.data?.publicVideoUrl) {
    throw new Error(
      res.error?.message || "Failed to get S3 URLs from backend."
    );
  }

  const { signedUploadUrl, publicVideoUrl } = res.data;

  const uploadResponse = await fetch(signedUploadUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });

  if (!uploadResponse.ok) {
    const errorText = await uploadResponse.text();
    throw new Error(
      `Failed to upload file to S3: ${uploadResponse.status} - ${errorText}`
    );
  }
  
  return publicVideoUrl;
};

export const handleS3VideoDelete = async (videoUrl: string): Promise<void> => {
    const deleteResult = await MentorAPIMethods.deleteS3file(videoUrl);

    if (!deleteResult.ok) {
        throw new Error(deleteResult.error?.message || "S3 deletion failed.");
    }
};


const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
  "image/gif",
];

export const handleThumbnailFileChange = (e: React.ChangeEvent<HTMLInputElement>): File | null => {
  const file = e.target.files?.[0];

  if (file) {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      showErrorToast(
        "Please select a valid image file (JPEG, PNG, WEBP, JPG, GIF)"
      );
      return null;
    }
    return file;
  }
  return null;
};