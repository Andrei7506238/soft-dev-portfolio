import { CaseStudyHero } from '../components/case-study/CaseStudyHero'
import { BulletList } from '../components/case-study/BulletList'
import { Section } from '../components/case-study/Section'
import { CardGrid } from '../components/case-study/CardGrid'
import { StatsRow } from '../components/case-study/StatsRow'
import { SplitMediaSection } from '../components/case-study/SplitMediaSection'
import { MediaFigure } from '../components/case-study/MediaFigure'
import { MediaCollage } from '../components/case-study/MediaCollage'
import {
  requirements,
  featureCards,
  strengths,
  projectStats,
  architectureSections,
  components,
  entities,
} from '../data/restaurantOrderingSystem'

export function RestaurantOrderingSystemPage() {
  const basePath = import.meta.env.BASE_URL || '/'
  const asset = (file: string) => `${basePath}images/restaurant-ordering-system/${file}`

  return (
    <div className="cs-page">
      <CaseStudyHero
        eyebrow="Restaurant Ordering System"
        title="Modular ordering for busy restaurants"
        lead="A plugin-ready platform with a Flutter client and ASP.NET Core backend. Built to keep menus flexible, orders reliable and integrations open."
        ctas={[
          { label: 'Watch the demo', href: 'https://youtu.be/WKDwvteNCFw', external: true },
          { label: 'Back to projects', href: `${basePath}#all-projects`, variant: 'ghost' },
        ]}
      />

      <BulletList items={requirements} tone="subtle" tight />

      <SplitMediaSection
        layout="stack"
        media={
          <div className="cs-video-frame">
            <iframe
              src="https://www.youtube.com/embed/WKDwvteNCFw"
              title="Restaurant Ordering System demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
              allowFullScreen
            />
          </div>
        }
      >
        <h2>See the flow in action</h2>
        <p>
          Orders, menu edits and plugin-driven options remain responsive with offline-friendly caching and
          real-time updates.
        </p>
      </SplitMediaSection>

      <Section
        eyebrow="Highlights"
        title="Built for flexibility"
        lead="Runtime plugins, multi-platform delivery and operational tooling keep the system adaptable."
      >
        <CardGrid items={featureCards} />
      </Section>

      <Section
        eyebrow="Operational strength"
        title="Resilient during rush hours"
        lead="Caching, self-hosting and guardrails keep service smooth when the restaurant is busiest."
        muted
      >
        <BulletList items={strengths} tone="plain" />
      </Section>

      <Section
        eyebrow="Architecture"
        title="Clean boundaries, shared contracts"
        lead="Server and client mirror the same modular principles for easier evolution."
      >
        <div className="cs-block-stack">
          {architectureSections.map((block) => (
            <SplitMediaSection
              key={block.title}
              media={<MediaFigure src={asset(block.image)} alt={block.caption} caption={block.caption} />}
            >
              <h3>{block.title}</h3>
              {block.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </SplitMediaSection>
          ))}
        </div>
      </Section>

      <StatsRow items={projectStats} />

      <Section
        eyebrow="Server components"
        title="Interlocking building blocks"
        lead="Each layer stays small and swappable, keeping plugins first-class citizens."
        muted
      >
        <SplitMediaSection
          variant="plain"
          reverse
          media={
            <MediaCollage
              main={{ src: asset('rosComponents.png'), alt: 'Server communication diagram' }}
              rows={[
                [
                  { src: asset('rosMappers.png'), alt: 'Mappers class diagram' },
                  { src: asset('rosEvents.png'), alt: 'Events class diagram' },
                ],
                [{ src: asset('rosPersister.png'), alt: 'Persister class diagram' }],
              ]}
            />
          }
        >
          <CardGrid items={components} layout="list" />
        </SplitMediaSection>
      </Section>

      <Section
        eyebrow="Plugin architecture"
        title="Runtime extensions without redeploys"
        lead="DLL-based plugins register services through a simple injector contract so new capabilities ship independently."
      >
        <SplitMediaSection
          layout="stack"
          media={
            <MediaFigure
              src={asset('rosActions.png')}
              alt="Dynamic options provided by plugins"
              caption="Dynamic client options injected by server plugins"
            />
          }
        >
          <p>
            The server scans a plugin directory, loads DLLs via Assembly and instantiates classes implementing
            an <em>IInjector</em> interface. Plugins receive the IServiceCollection, registering their own
            services: mappers, persisters, controllers, event observers and more.
          </p>
          <p>
            Client-side, modules expose options rendered in the UI; triggering an option calls the server to
            execute the linked action. That keeps integrations discoverable without bloating the core.
          </p>
        </SplitMediaSection>
      </Section>

      <Section
        eyebrow="Entities"
        title="Modeled for restaurant realities"
        lead="Menu, rooms and orders match how teams operate while staying integration-friendly."
        muted
      >
        <SplitMediaSection
          media={
            <MediaFigure src={asset('rosDatabase.png')} alt="Database ER diagram" caption="ER diagram for the database" />
          }
        >
          <CardGrid items={entities} layout="list" />
        </SplitMediaSection>
      </Section>
    </div>
  )
}

export default RestaurantOrderingSystemPage
