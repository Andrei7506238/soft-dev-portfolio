import './CaseStudy.css'

type Props = {
  src: string
  alt: string
  caption?: string
}

export function MediaFigure({ src, alt, caption }: Props) {
  return (
    <figure className="cs-figure">
      <img src={src} alt={alt} />
      {caption ? <figcaption className="cs-caption">{caption}</figcaption> : null}
    </figure>
  )
}
