import seedData from './seed.json'

export interface FrameworkDimension {
  slug: string
  name: string
  sort_order: number
  description: string
}

export interface FrameworkSkill {
  slug: string
  name: string
  dimension: string
  description: string
}

export interface FrameworkData {
  dimensions: FrameworkDimension[]
  skills: FrameworkSkill[]
}

export const FRAMEWORK_VERSION = '0.1.0-placeholder'

export const framework = seedData as FrameworkData
export const { dimensions, skills } = framework
