// Skill framework placeholder — 3 dimensions, 10 skills (E5 populates this)

export const FRAMEWORK_VERSION = '0.1.0-placeholder'

export const dimensions = [
  { slug: 'inner-compass', name: 'Inner Compass' },
  { slug: 'collaborative-synergy', name: 'Collaborative Synergy' },
  { slug: 'impactful-leadership', name: 'Impactful Leadership' },
] as const

export const skills = [
  { slug: 'self-awareness', name: 'Self Awareness', dimension: 'inner-compass' },
  { slug: 'resilience', name: 'Resilience', dimension: 'inner-compass' },
  { slug: 'active-listening', name: 'Active Listening', dimension: 'collaborative-synergy' },
  { slug: 'conflict-resolution', name: 'Conflict Resolution', dimension: 'collaborative-synergy' },
  { slug: 'trust-building', name: 'Trust Building', dimension: 'collaborative-synergy' },
  { slug: 'vision-setting', name: 'Vision Setting', dimension: 'impactful-leadership' },
  { slug: 'decision-making', name: 'Decision Making', dimension: 'impactful-leadership' },
  { slug: 'accountability', name: 'Accountability', dimension: 'impactful-leadership' },
  { slug: 'coaching-mindset', name: 'Coaching Mindset', dimension: 'impactful-leadership' },
  { slug: 'feedback-culture', name: 'Feedback Culture', dimension: 'impactful-leadership' },
] as const
