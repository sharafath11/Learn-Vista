export async function getRandomUnsplashImage() {
  const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
  if (!accessKey) return "/placeholder.svg?height=400&width=600";

  try {
    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=abstract,error,not-found&orientation=landscape&client_id=${accessKey}`,
      {
        cache: "no-store",
      }
    );
    if (!response.ok) return "/images/randomImage.jpg";

    const data = await response.json();
    return data.urls?.regular || "/images/randomImage.jpg";
  } catch {
    return "/images/randomImage.jpg";
  }
}
