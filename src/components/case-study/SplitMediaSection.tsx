import type { ReactNode } from 'react'
import './CaseStudy.css'

type Props = {
  title?: string
  layout?: 'split' | 'stack'
  reverse?: boolean
  variant?: 'card' | 'plain'
  media: ReactNode
  children: ReactNode
}

export function SplitMediaSection({
  title,
  layout = 'split',
  reverse = false,
  variant = 'card',
  media,
  children,
}: Props) {
  const rootClasses = [
    'cs-media-section',
    variant === 'card' ? 'cs-card' : 'cs-media-section--plain',
    layout === 'stack' ? 'cs-media-section--stack' : 'cs-media-section--split',
    reverse ? 'cs-media-section--reverse' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={rootClasses}>
      <div className="cs-media-section__body">
        <div className="cs-media-section__text">
          {title ? <h3>{title}</h3> : null}
          {children}
        </div>
        <div className="cs-media-section__media">{media}</div>
      </div>
    </div>
  )
}
