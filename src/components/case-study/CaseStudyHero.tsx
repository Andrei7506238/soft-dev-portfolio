import { ButtonLink } from '../ui/ButtonLink'
import './CaseStudy.css'

type Cta = {
  label: string
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'ghost'
  external?: boolean
}

type Props = {
  eyebrow: string
  title: string
  lead: string
  ctas: Cta[]
  image?: { src: string; alt: string }
}

export function CaseStudyHero({ eyebrow, title, lead, ctas, image }: Props) {
  const heroClasses = ['cs-hero', image ? 'cs-hero--with-media' : ''].filter(Boolean).join(' ')

  return (
    <section className={heroClasses}>
      <div className="cs-hero__content">
        <p className="cs-eyebrow">{eyebrow}</p>
        <h1 className="cs-title">{title}</h1>
        <p className="cs-lead">{lead}</p>
        <div className="cs-cta-row">
          {ctas.map((cta) =>
            cta.href ? (
              <ButtonLink
                key={cta.label}
                href={cta.href}
                variant={cta.variant ?? 'primary'}
                target={cta.external ? '_blank' : undefined}
                rel={cta.external ? 'noreferrer' : undefined}
              >
                {cta.label}
              </ButtonLink>
            ) : (
              <button
                key={cta.label}
                type="button"
                className={`btn ${cta.variant ?? 'primary'}`}
                onClick={cta.onClick}
              >
                {cta.label}
              </button>
            ),
          )}
        </div>
      </div>
      {image ? (
        <div className="cs-hero__media">
          <img className="cs-hero__image" src={image.src} alt={image.alt} />
        </div>
      ) : null}
    </section>
  )
}
