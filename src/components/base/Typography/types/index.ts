export const THEME_COLORS = {
  primary: '#42b983',
  secondary: '#27ae60',
  success: '#27ae60',
  danger: '#e74c3c',
  warning: '#e67e22',
  info: '#3498db',
  muted: '#34495e',
  text: '#ccc',
  textDark: '#0f0f0f',
  bgDark: '#1a1a1a',
  bgDarker: '#0f0f0f',
} as const

export type TColorKey = keyof typeof THEME_COLORS

export interface ITypographyProps {
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span'
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
  bold?: boolean
  color?: TColorKey | string
  align?: 'left' | 'center' | 'right' | 'justify'
}