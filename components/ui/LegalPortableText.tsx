import {PortableText, type PortableTextComponents, type PortableTextBlock} from 'next-sanity'

const components: PortableTextComponents = {
  block: {
    h2: ({children}) => (
      <h2 className="font-bebas text-2xl uppercase tracking-wide text-text-primary mb-3">
        {children}
      </h2>
    ),
    h3: ({children}) => (
      <h3 className="font-bebas text-xl uppercase tracking-wide text-text-primary mb-2">
        {children}
      </h3>
    ),
    normal: ({children}) => <p>{children}</p>,
  },
  list: {
    bullet: ({children}) => <ul className="list-disc pl-6 space-y-1 mt-2">{children}</ul>,
    number: ({children}) => <ol className="list-decimal pl-6 space-y-3 mt-2">{children}</ol>,
  },
  marks: {
    strong: ({children}) => <strong className="text-text-primary">{children}</strong>,
    link: ({children, value}) => (
      <a
        href={value?.href || '#'}
        target={value?.openInNewTab ? '_blank' : undefined}
        rel={value?.openInNewTab ? 'noopener noreferrer' : undefined}
        className="text-accent-primary hover:underline"
      >
        {children}
      </a>
    ),
  },
}

export function LegalPortableText({value}: {value: PortableTextBlock[] | null | undefined}) {
  if (!value?.length) return null
  return (
    <div className="prose-custom space-y-8 text-text-secondary leading-relaxed">
      <PortableText components={components} value={value} />
    </div>
  )
}
