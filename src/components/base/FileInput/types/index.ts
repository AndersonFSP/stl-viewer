
export type ButtonType = 'primary' | 'secondary' | 'danger' | 'warning' | 'info' | 'muted'
export type ButtonSize = 'sm' | 'base' | 'lg'

export interface IFileInputProps {
  accept?: string
  buttonText?: string
  loadingText?: string
  buttonType?: ButtonType
  buttonSize?: ButtonSize
  loading?: boolean
  disabled?: boolean
}
