export type TButtonType =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'warning'
  | 'info'
  | 'muted'
  | 'success'
  | 'light'
export type TButtonSize = 'sm' | 'base' | 'lg'

export interface IButtonProps {
  type?: TButtonType
  size?: TButtonSize
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
}
