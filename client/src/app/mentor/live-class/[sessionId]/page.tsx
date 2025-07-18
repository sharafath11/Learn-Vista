"use client";

import { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Video, Radio } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { MentorAPIMethods } from "@/src/services/APImethods";
import { showInfoToast, showSuccessToast } from "@/src/utils/Toast";

interface DeviceInfo {
  deviceId: string;
  label: string;
}

export default function LiveStarterPage() {
  const router = useRouter();
  const webcamRef = useRef<Webcam>(null);
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const handleDevices = (mediaDevices: MediaDeviceInfo[]) => {
    const videoDevices = mediaDevices
      .filter(({ kind }) => kind === "videoinput")
      .map((device) => ({
        deviceId: device.deviceId,
        label: device.label || `Camera ${devices.length + 1}`,
      }));
    setDevices(videoDevices);
    if (videoDevices.length > 0) {
      setSelectedDevice(videoDevices[0].deviceId);
    }
    setIsLoading(false);
  };
  const params = useParams();
  const courseId = params?.sessionId as string;
  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices);
  }, []);

  const startLiveStream = async () => {
    const liveId=localStorage.getItem("liveId")
    if (liveId) {
      router.push(`/mentor/live/${liveId}`);
      return 
    }
    const res = await MentorAPIMethods.startLiveSession(courseId);

    if (res.ok) {
      showSuccessToast(res.msg);
      localStorage.setItem("liveId", res.data.liveId);
      const liveId=res.data.liveId
      router.push(`/mentor/live/${liveId}`);
    } else {
      console.error("Failed to start live stream:", res.message || "Unknown error");
      showInfoToast("Failed to start the live stream. Please try again.");
    }
  };

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user", 
    deviceId: selectedDevice,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white">
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
        {/* Main Content */}
        <Card className="w-full max-w-2xl bg-gray-800/50 backdrop-blur-md border-gray-700 overflow-hidden">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-violet-200">
              Ready to Go Live?
            </CardTitle>
            <p className="mt-2 text-gray-300">
              Start streaming to your audience in just one click
            </p>
          </CardHeader>

          <CardContent className="flex flex-col md:flex-row gap-4 justify-center p-6">
            {/* Start Live Button */}
            <Button
              onClick={startLiveStream}
              className="h-16 px-8 text-lg gap-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
            >
              <Radio className="w-6 h-6" />
              Start Live Stream
            </Button>

            {/* Camera Preview Button */}
            <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="h-16 px-8 text-lg gap-3 bg-gray-700/50 hover:bg-gray-600/50 border-gray-600 hover:border-gray-500 transition-all duration-300 transform hover:scale-105"
                >
                  <Video className="w-6 h-6" />
                  Camera Preview
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl bg-gray-800 border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">
                    Camera Preview
                  </DialogTitle>
                </DialogHeader>
                <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black">
                  {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-pulse text-gray-400">
                        Loading camera...
                      </div>
                    </div>
                  ) : (
                    <Webcam
                      ref={webcamRef}
                      audio={false}
                      videoConstraints={videoConstraints}
                      className="w-full h-full object-cover transform scale-x-[-1]" // Flip horizontally
                    />
                  )}
                </div>
                {devices.length > 1 && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Select Camera
                    </label>
                    <select
                      value={selectedDevice}
                      onChange={(e) => setSelectedDevice(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                    >
                      {devices.map((device) => (
                        <option key={device.deviceId} value={device.deviceId}>
                          {device.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="flex justify-start gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsPreviewOpen(false)}
                    className="border-gray-600 hover:bg-gray-700"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={startLiveStream}
                    className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                  >
                    Go Live Now
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full max-w-4xl">
          <FeatureCard
            icon={<Mic className="w-8 h-8" />}
            title="High Quality Audio"
            description="Crystal clear sound with noise cancellation"
          />
          <FeatureCard
            icon={<Video className="w-8 h-8" />}
            title="HD Video"
            description="Stream in up to 1080p resolution"
          />
          <FeatureCard
            icon={<Radio className="w-8 h-8" />}
            title="Live Interaction"
            description="Engage with your audience in real-time"
          />
        </div>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="bg-gray-800/50 backdrop-blur-md border-gray-700 hover:border-violet-500 transition-all duration-300">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <div className="p-3 rounded-full bg-violet-500/20 text-violet-400">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400">{description}</p>
      </CardContent>
    </Card>
  );
}
