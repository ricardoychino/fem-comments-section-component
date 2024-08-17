type ImageFormats = 'png' | 'webp'

export type User = {
  username: string,
  image: Record<ImageFormats, string>
}

export type Comment = {
  id: number,
  content: string,
  createdAt: string // Date
  score: number,
  user: User,
  replies: Comment[]
}