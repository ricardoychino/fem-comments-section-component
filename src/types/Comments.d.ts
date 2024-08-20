type ImageFormats = 'png' | 'webp'

export type User = {
  username: string,
  image: Record<ImageFormats, string>
}

export type Comment = {
  id: number,
  content: string,
  createdAt: number | string
  score: number,
  user: User | null,
  replyingTo?: string | number,
  replies?: Comment[],
  removed?: boolean
}