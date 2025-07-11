import RoleBasedNotFoundContent from "../components/role-based-not-found-content"

async function getRandomUnsplashImage() {
  const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY
  if (!accessKey) return "/placeholder.svg?height=400&width=600"

  try {
    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=abstract,error,not-found&orientation=landscape&client_id=${accessKey}`,
      {
        next: { revalidate: 10 },
      }
    )
    if (!response.ok) return "/placeholder.svg?height=400&width=600"

    const data = await response.json()
    return data.urls.regular
  } catch {
    return "/placeholder.svg?height=400&width=600"
  }
}

export default async function NotFound() {
  const randomImageUrl = await getRandomUnsplashImage()

  return (
    <div className="relative min-h-screen text-white flex items-center justify-center p-4">
      <div className="absolute inset-0 -z-10">
        <img
          src={randomImageUrl}
          alt="Background"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>
      <RoleBasedNotFoundContent randomImageUrl={randomImageUrl} />
    </div>
  )
}
