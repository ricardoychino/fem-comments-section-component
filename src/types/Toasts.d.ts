

export type ToastThemes = 'neutral' | 'primary' | 'success' | 'danger'

export type Toast = {
  theme: ToastThemes,
  text: string,
  closable: boolean,
  handleClose?: () => void,
  key?: string | number
}