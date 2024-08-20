export type ApiResponse<T> = {
  status: number,
  data?: T,
  message: string
}

export type Data<T> = {
  row: T,
  pos: number,
  parent: number
}