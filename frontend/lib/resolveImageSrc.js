export default function resolveImageSrc(image) {
  if (!image) return null;
  return image.startsWith("http")
    ? image
    : `${process.env.NEXT_PUBLIC_API_URL}${image}`;
}
