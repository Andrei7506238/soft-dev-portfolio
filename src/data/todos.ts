export type Todo = {
    title: string
    description?: string
    status: 'todo' | 'in-progress' | 'done'
    eta?: string
}

export const todos: Todo[] = [
    {
        title: 'Deploy Interactive Educational Tool',
        description: 'Wrapping up and releasing the Step-by-step Kangaroo game. It teaches children how programs execute step by step through a simple animated character.',
        status: 'todo',
        eta: 'Sep 2026',
    },
    {
        title: 'Research and Ship a New Mobile App',
        description: 'Planning, building and releasing a new mobile app from scratch. This covers everything from architecture to app store submission and early marketing experiments.',
        status: 'todo',
        eta: 'Dec 2026',
    },
    {
        title: 'Explore Other Ecosystems and Frameworks',
        description: 'Going deeper with native and cross-platform ecosystems outside my main stack. The plan is to build small proof-of-concept projects in React Native, Kotlin, or Swift and compare them against what I know.',
        status: 'todo',
        eta: 'Everytime',
    },
]
