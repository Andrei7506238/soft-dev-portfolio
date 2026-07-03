import './CaseStudy.css'

type Props = {
  code: string
  label?: string
}

export function CodeBlock({ code, label }: Props) {
  return (
    <div className="cs-code-block">
      {label ? <p className="cs-code-block__label">{label}</p> : null}
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  )
}
