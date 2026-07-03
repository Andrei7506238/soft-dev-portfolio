import { CaseStudyHero } from '../components/case-study/CaseStudyHero'
import { BulletList } from '../components/case-study/BulletList'
import { Section } from '../components/case-study/Section'
import { CardGrid } from '../components/case-study/CardGrid'
import { StatsRow } from '../components/case-study/StatsRow'
import { SplitMediaSection } from '../components/case-study/SplitMediaSection'
import { MediaFigure } from '../components/case-study/MediaFigure'
import { MediaCollage } from '../components/case-study/MediaCollage'
import { CodeBlock } from '../components/case-study/CodeBlock'
import {
  objectives,
  marketGapParagraph,
  highlightCards,
  seeItInActionParagraph,
  bridgeIntro,
  layersBlock,
  panicBlock,
  trampolineBlock,
  codegenBlock,
  missionCode,
  missionIntro,
  missionExplanation,
  engineParagraph,
  mobileParagraph,
  mobileArchitectureParagraph,
  mobileMenuParagraph,
  backendParagraph,
  contentBundleParagraph,
  refreshTokenParagraph,
  statsIntro,
  stats,
} from '../data/luaRover'
import './LuaRover.css'

export function LuaRoverPage() {
  const basePath = import.meta.env.BASE_URL || '/'
  const asset = (file: string) => `${basePath}images/lua-rover/${file}`

  return (
    <div className="cs-page lua-rover-page">
      <CaseStudyHero
        eyebrow="LuaRover"
        title="Teaching real Lua by driving a rover"
        lead="LuaRover is an educational app that sits between block based tools and a bare code editor. A student writes actual Lua and every instruction moves a rover on a grid immediately, with the whole project running locally so it works on an old phone or with no internet connection at all."
        ctas={[
          { label: 'Back to projects', href: `${basePath}#all-projects`, variant: 'ghost' },
        ]}
        image={{ src: asset('hero-menu.jpg'), alt: 'LuaRover main menu' }}
      />

      <BulletList items={objectives} tone="subtle" tight />

      <Section title="Neither blocks nor bare code editors are quite right">
        <p>{marketGapParagraph}</p>
      </Section>

      <Section title="Three components, one experience">
        <CardGrid items={highlightCards} />
      </Section>

      <SplitMediaSection
        layout="stack"
        media={
          <MediaFigure
            src={asset('code-debugger.jpg')}
            alt="LuaRover code editor with the step debugger and sensors panel open"
          />
        }
      >
        <h2 id="see-it-in-action">The editor, the grid and the debugger, side by side</h2>
        <p>{seeItInActionParagraph}</p>
      </SplitMediaSection>

      <Section title="Where the actual engineering happens" lead={bridgeIntro}>
        <div className="cs-block-stack">
          <SplitMediaSection
            title={layersBlock.title}
            media={<MediaFigure src={asset(layersBlock.image)} alt={layersBlock.caption} caption={layersBlock.caption} />}
          >
            {layersBlock.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </SplitMediaSection>

          <SplitMediaSection
            title={panicBlock.title}
            reverse
            media={<MediaFigure src={asset(panicBlock.image)} alt={panicBlock.caption} caption={panicBlock.caption} />}
          >
            {panicBlock.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </SplitMediaSection>

          <SplitMediaSection
            title={trampolineBlock.title}
            media={
              <MediaCollage
                main={{ src: asset(trampolineBlock.registerImage.file), alt: trampolineBlock.registerImage.alt }}
                rows={[[{ src: asset(trampolineBlock.invokeImage.file), alt: trampolineBlock.invokeImage.alt }]]}
              />
            }
          >
            {trampolineBlock.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </SplitMediaSection>

          <SplitMediaSection
            title={codegenBlock.title}
            reverse
            media={<MediaFigure src={asset(codegenBlock.image)} alt={codegenBlock.caption} caption={codegenBlock.caption} />}
          >
            {codegenBlock.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </SplitMediaSection>
        </div>
      </Section>

      <Section title="What a student actually writes">
        <SplitMediaSection media={<MediaFigure src={asset('a_real_mission_sample.jpg')} alt="LuaRover mission grid with sample tiles" />}>
          <p>{missionIntro}</p>
          <CodeBlock code={missionCode} label="Collect Every Sample" />
          <p>{missionExplanation}</p>
        </SplitMediaSection>
      </Section>

      <Section title="A Flutter client that runs everywhere">
        <div className="cs-block-stack">
          <SplitMediaSection
            title="Recording every frame instead of re-running the script"
            media={<MediaFigure src={asset('game-engine.png')} alt="lua_rover game engine class diagram" />}
          >
            <p>{engineParagraph}</p>
          </SplitMediaSection>

          <SplitMediaSection
            title="Cross-platform from one codebase"
            reverse
            media={
              <MediaCollage
                main={{ src: asset('mobile-menu.jpg'), alt: 'LuaRover mobile menu' }}
                rows={[
                  [
                    { src: asset('mobile-code.jpg'), alt: 'LuaRover mobile code editor' },
                    { src: asset('mobile-map.jpg'), alt: 'LuaRover mobile grid map' },
                  ],
                ]}
              />
            }
          >
            <p>{mobileParagraph}</p>
            <p>{mobileArchitectureParagraph}</p>
            <p>{mobileMenuParagraph}</p>
          </SplitMediaSection>
        </div>
      </Section>

      <Section title="What runs on the server" muted>
        <div className="cs-block-stack">
          <SplitMediaSection
            title="Clean Architecture, JWT, and packages generated for offline use"
            media={<MediaFigure src={asset('server-classes.png')} alt="LuaRoverBackend class diagram" />}
          >
            <p>{backendParagraph}</p>
            <p>{contentBundleParagraph}</p>
          </SplitMediaSection>

          <SplitMediaSection
            title="Refresh tokens you can revoke"
            reverse
            media={<MediaFigure src={asset('auth-login-flow.png')} alt="JWT login and refresh token sequence diagram" />}
          >
            <p>{refreshTokenParagraph}</p>
          </SplitMediaSection>
        </div>
      </Section>

      <Section title="What the test suites cover" lead={statsIntro}>
        <StatsRow items={stats} />
      </Section>
    </div>
  )
}

export default LuaRoverPage
