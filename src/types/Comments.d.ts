type ImageFormats = 'png' | 'webp'
export type User = {
  username: string,
  image: Record<ImageFormats, string>
}