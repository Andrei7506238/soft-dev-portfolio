import './CaseStudy.css'

type Stat = {
  value: string
  label: string
}

type Props = {
  items: Stat[]
}

export function StatsRow({ items }: Props) {
  return (
    <div className="cs-stats">
      {items.map((stat) => (
        <div key={stat.label} className="cs-stat">
          <h3>{stat.value}</h3>
          <p>{stat.label}</p>
        </div>
      ))}
    </div>
  )
}
