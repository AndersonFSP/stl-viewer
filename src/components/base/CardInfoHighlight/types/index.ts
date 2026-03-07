import type { Component } from 'vue'

interface ICardInfoHighlightPropsListItem {
  label: string
  value: string | number
}

export interface ICardInfoHighlightProps {
  title: string
  icon: Component
  details: ICardInfoHighlightPropsListItem[]
}
