import Image from "next/image"
import { getRandomUnsplashImage } from "../utils/unsplash"
import RoleBasedNotFoundContent from "../components/Role-based-not-found-content"
import { WithTooltip } from "@/src/hooks/UseTooltipProps" 

export default async function NotFound() {
  const randomImageUrl = await getRandomUnsplashImage()

  return (
    <div className="relative min-h-screen text-white flex items-center justify-center p-4">
      <div className="absolute inset-0 -z-10">
        <WithTooltip content="Random background from Unsplash 🌄">
          <Image
            src={randomImageUrl}
            alt="Background"
            fill
            priority
            sizes="100vw"
            className="object-cover w-full h-full"
          />
        </WithTooltip>

        <div className="absolute inset-0 bg-black/70" />
      </div>

      <WithTooltip content="This page doesn’t exist or you don’t have access 🚫">
        <RoleBasedNotFoundContent randomImageUrl={randomImageUrl} />
      </WithTooltip>
    </div>
  )
}
