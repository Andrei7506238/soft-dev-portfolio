export const requirements = [
  'Streamline menu organization and ordering in a dynamic system.',
  'Keep the architecture modular so plugins can extend the core without friction.',
  'Deliver a modern, cross-platform client with a friendly, customizable UI.',
  'Stay adaptable for different restaurant flows and venues.',
]

export const featureCards = [
  {
    title: 'Plugin system',
    description:
      'Load extensions at runtime to add capabilities without redeploying the server. Contracts keep plugins interoperable.',
    icon: 'https://cdn.icon-icons.com/icons2/1381/PNG/512/preferencesplugin_94219.png',
  },
  {
    title: 'Cross-platform client',
    description:
      'Flutter client ships to Android, iOS and web for a consistent guest and staff experience everywhere.',
    icon: 'https://cdn-icons-png.freepik.com/512/9872/9872430.png',
  },
  {
    title: 'Menu and order management',
    description:
      'Versioned menus, multi-section products and live order editing keep staff productive during service.',
    icon: 'https://cdn-icons-png.freepik.com/512/6868/6868908.png',
  },
]

export const strengths = [
  'Client caching for historic menu versions.',
  'Built-in image management and caching.',
  'Self-hosted by design, no internet required.',
  'Clean architecture and interface-driven contracts.',
  'Customizable orders page and dashboards.',
  'Statistics and insights for managers.',
  'Extensible authentication and permissions.',
  'Entity structure validated by Glovo.',
]

export const projectStats = [
  { value: '340+', label: 'Files with code' },
  { value: '340,000+', label: 'Lines of code' },
  { value: '100+', label: 'Unit tests' },
]

export const architectureSections = [
  {
    title: 'ASP.NET Core server',
    paragraphs: [
      'Controllers, services and repositories are clearly separated and wired through interfaces.',
      'Domain hosts contracts for repositories, services, entities, events and transactions. Plugins depend only on these interfaces.',
      'Implementation covers persistence, controllers, authentication, real-time comms and notifications.',
      'TestImplementation keeps unit coverage focused. Main hosts plugin loading and startup.',
    ],
    image: 'rosPackageDiagram.png',
    caption: 'Server package diagram',
  },
  {
    title: 'Flutter client',
    paragraphs: [
      'Domain defines entities, repositories and messaging contracts in pure Dart.',
      'Implementation contains generated OpenAPI clients plus concrete repos and services.',
      'UI hosts all Flutter widgets, dependency injection framework glue and blocks that connect UI to logic.',
      'Server-driven UI components - simply implement the required interfaces in plugins and the UI will adapt.',
      'Clean architecture with clear boundaries keeps the client adaptable and maintainable as features evolve.',
      'State management driven by Cubit/BLoC pattern for predictable, testable UI behavior.',
    ],
    image: 'rosPackageClient.png',
    caption: 'Client package diagram',
  },
]

export const components = [
  {
    title: 'Controllers',
    description: 'HTTP endpoints lean on a generic controller pattern for reuse and consistency.',
  },
  {
    title: 'AuthService',
    description: 'Handles authentication and authorization, keeping data safe across roles.',
  },
  {
    title: 'Transaction factory',
    description: 'Database transaction wrapper ensures consistency with a clean abstraction.',
  },
  {
    title: 'Mapper',
    description: 'Generic mappers convert between entities and DTOs, reusing definitions across modules.',
  },
  {
    title: 'Event observers',
    description: 'Before/after hooks that validators and notifiers implement; plugins can add new observers.',
  },
  {
    title: 'Persisters',
    description: 'Generic CRUD services that abstract data access for controllers and other services.',
  },
  {
    title: 'Repositories',
    description: 'EF Core-based data layer responsible for querying and persistence.',
  },
]

export const entities = [
  {
    title: 'Menu primitives',
    description:
      'Sections, products, attribute groups and attributes mirror delivery-app schemas for smooth integrations.',
  },
  {
    title: 'Dining topology',
    description: 'Location groups and locations model rooms and tables to match on-the-floor operations.',
  },
  {
    title: 'Orders',
    description:
      'Active orders keep item status flags; finished orders preserve history including cancellations.',
  },
  {
    title: 'Temporal tables',
    description: 'Menu entities use temporal tables so any past state can be queried precisely.',
  },
]
