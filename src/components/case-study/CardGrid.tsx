import './CaseStudy.css'

type Card = {
  title: string
  description: string
  icon?: string
}

type Props = {
  items: Card[]
  layout?: 'grid' | 'list'
}

export function CardGrid({ items, layout = 'grid' }: Props) {
  const classes = ['cs-card-grid', layout === 'list' ? 'cs-card-grid--list' : ''].filter(Boolean).join(' ')

  return (
    <div className={classes}>
      {items.map((item) => (
        <div key={item.title} className="cs-card-grid__item">
          {item.icon ? <img src={item.icon} alt="" className="cs-card-grid__icon" /> : null}
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  )
}
