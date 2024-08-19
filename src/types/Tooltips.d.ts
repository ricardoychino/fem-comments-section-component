

export type TooltipThemes = 'neutral' | 'primary' | 'success' | 'danger'

export type Tooltip = {
  theme: TooltipThemes,
  text: string,
  closable: boolean,
  handleClose?: () => void,
  key?: string | number
}