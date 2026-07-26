import { useEffect, useState } from 'react'
import './BlogSection.css'

type BlogPost = {
  id: string
  title: string
  link: string
  category: string
  excerpt: string
  published: string
  image?: string
}

const FEED_URL = 'https://andrei7506238.github.io/blog/rss.xml'
const MAX_VISIBLE_COMPACT_POSTS = 2
const CACHE_KEY = 'blog-feed-cache-v2'
const ALL_POSTS = 'all'

function stripHtml(htmlText: string): string {
  const plainText = new DOMParser().parseFromString(htmlText, 'text/html').body.textContent ?? ''

  return plainText.replace(/\s+/g, ' ').trim()
}

function pickSummary(item: Element): string {
  const source = item.getElementsByTagName('description')[0]?.textContent?.trim() ?? ''

  if (!source) {
    return 'Open the full article for the complete write-up.'
  }

  const cleaned = stripHtml(source)

  return cleaned.length > 190 ? `${cleaned.slice(0, 187).trimEnd()}...` : cleaned
}

function pickPublishedDate(item: Element): string {
  return item.getElementsByTagName('pubDate')[0]?.textContent?.trim() ?? ''
}

function pickImage(item: Element): string | undefined {
  const mediaNode = Array.from(item.children).find(
    (child) =>
      child.namespaceURI === 'http://search.yahoo.com/mrss/' &&
      (child.localName === 'thumbnail' || child.localName === 'content'),
  )

  const mediaUrl = mediaNode?.getAttribute('url')?.trim()
  if (mediaUrl) {
    return mediaUrl
  }

  const enclosureUrl = item.getElementsByTagName('enclosure')[0]?.getAttribute('url')?.trim()
  if (enclosureUrl) {
    return enclosureUrl
  }

  const htmlSource = item.getElementsByTagName('description')[0]?.textContent?.trim() ?? ''

  if (!htmlSource) {
    return undefined
  }

  return new DOMParser().parseFromString(htmlSource, 'text/html').querySelector('img')?.getAttribute('src') ?? undefined
}

function formatCategoryLabel(category: string): string {
  return category
    .split(/[-\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function formatPublishedDate(value: string): string {
  if (!value) {
    return ''
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return ''
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parsed)
}

function buildMediaStyle(post: BlogPost): React.CSSProperties | undefined {
  if (!post.image) {
    return undefined
  }

  return {
    backgroundImage: `linear-gradient(180deg, rgba(15, 23, 42, 0.08), rgba(15, 23, 42, 0.72)), url(${post.image})`,
  }
}

function pickLink(item: Element): string {
  return (
    item.getElementsByTagName('link')[0]?.textContent?.trim() ??
    item.getElementsByTagName('guid')[0]?.textContent?.trim() ??
    ''
  )
}

function pickCategory(item: Element): string {
  const firstCategory = item.getElementsByTagName('category')[0]

  return firstCategory?.textContent?.trim() || 'Uncategorized'
}

function parseFeed(xmlText: string): BlogPost[] {
  const xml = new DOMParser().parseFromString(xmlText, 'application/xml')
  const entries = Array.from(xml.querySelectorAll('item'))

  return entries
    .map((node, index) => {
      const title = node.getElementsByTagName('title')[0]?.textContent?.trim() ?? ''
      const link = pickLink(node)
      const category = pickCategory(node)
      const image = pickImage(node)

      if (!title || !link) {
        return null
      }

      return {
        id: `${link}-${index}`,
        title,
        link,
        category,
        excerpt: pickSummary(node),
        published: pickPublishedDate(node),
        ...(image ? { image } : {}),
      }
    })
    .filter((post): post is BlogPost => post !== null)
}

function readCachedPosts(): BlogPost[] {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw) as BlogPost[]
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed
      .filter((post) => post && typeof post.title === 'string' && typeof post.link === 'string')
      .map((post) => ({
        id: typeof post.id === 'string' ? post.id : `${post.link}-${post.title}`,
        title: post.title,
        link: post.link,
        category: typeof post.category === 'string' && post.category ? post.category : 'uncategorized',
        excerpt:
          typeof post.excerpt === 'string' && post.excerpt
            ? post.excerpt
            : 'Open the full article for the complete write-up.',
        published: typeof post.published === 'string' ? post.published : '',
        image: typeof post.image === 'string' && post.image ? post.image : undefined,
      }))
  } catch {
    return []
  }
}

function writeCachedPosts(posts: BlogPost[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(posts))
  } catch {
    // Ignore quota/storage errors.
  }
}

export function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState(ALL_POSTS)

  useEffect(() => {
    const controller = new AbortController()
    const cachedPosts = readCachedPosts()

    if (cachedPosts.length > 0) {
      setPosts(cachedPosts)
      setLoading(false)
    }

    async function loadFeed() {
      try {
        const response = await fetch(FEED_URL, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error('Unable to load blog feed')
        }

        const xmlText = await response.text()
        const parsedPosts = parseFeed(xmlText)
        setPosts(parsedPosts)
        writeCachedPosts(parsedPosts)
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          if (cachedPosts.length === 0) {
            setPosts([])
          }
        }
      } finally {
        setLoading(false)
      }
    }

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(() => {
        void loadFeed()
      })

      return () => {
        controller.abort()
        window.cancelIdleCallback(idleId)
      }
    }

    const timeoutId = setTimeout(() => {
      void loadFeed()
    }, 80)

    return () => {
      controller.abort()
      clearTimeout(timeoutId)
    }
  }, [])

  const categories = [
    ALL_POSTS,
    ...Array.from(new Set(posts.map((post) => post.category.toLowerCase()))),
  ]

  const selectedCategory = categories.includes(activeCategory) ? activeCategory : ALL_POSTS
  const visiblePosts =
    selectedCategory === ALL_POSTS
      ? posts
      : posts.filter((post) => post.category.toLowerCase() === selectedCategory)

  const featuredPost = visiblePosts[0]
  const compactPosts = visiblePosts.slice(1, MAX_VISIBLE_COMPACT_POSTS + 1)

  return (
    <section className="section blog-section" id="blog" aria-labelledby="blog-title">
      <div className="section-header blog-section-header">
        <div>
          <h2 id="blog-title">Technical blog</h2>
          <p className="section-subtitle">Latest essays, engineering notes and longer-form thinking.</p>
        </div>
        <a
          className="blog-archive-link"
          href="https://andrei7506238.github.io/blog/"
          target="_blank"
          rel="noreferrer"
        >
          View archive
        </a>
      </div>

      {loading ? (
        <p className="blog-feed-state">Loading latest posts...</p>
      ) : posts.length === 0 ? (
        <p className="blog-feed-state">No posts found right now.</p>
      ) : (
        <>
          <div className="blog-filters" role="tablist" aria-label="Blog categories">
            {categories.map((category) => {
              const isActive = category === selectedCategory

              return (
                <button
                  key={category}
                  type="button"
                  className={`blog-filter-chip${isActive ? ' is-active' : ''}`}
                  onClick={() => setActiveCategory(category)}
                  role="tab"
                  aria-selected={isActive}
                >
                  {category === ALL_POSTS ? 'All posts' : formatCategoryLabel(category)}
                </button>
              )
            })}
          </div>

          {featuredPost ? (
            <>
              <div className="blog-layout">
                <a
                  className="blog-featured-card"
                  href={featuredPost.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="blog-featured-media" style={buildMediaStyle(featuredPost)} aria-hidden="true" />
                  <div className="blog-featured-overlay">
                    <h3 className="blog-featured-title">{featuredPost.title}</h3>
                    <p className="blog-featured-excerpt">{featuredPost.excerpt}</p>
                    <div className="blog-featured-footer">
                      <span className="blog-read-link">Read article</span>
                    </div>
                  </div>
                </a>

                <div className="blog-side-rail">
                  {compactPosts.map((post) => (
                    <a
                      className="blog-compact-card"
                      key={post.id}
                      href={post.link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <div className="blog-compact-body">
                        <p className="blog-category">{formatCategoryLabel(post.category)}</p>
                        <h3 className="blog-title">{post.title}</h3>
                        <p className="blog-compact-date">{formatPublishedDate(post.published)}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <p className="blog-feed-state">No posts found for this category.</p>
          )}
        </>
      )}
    </section>
  )
}
