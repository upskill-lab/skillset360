import type { Tables as TablesHelper } from './db'

export type { Database, Json, Tables, TablesInsert, TablesUpdate, Enums } from './db'

export type UserRole = 'admin' | 'coach' | 'selector' | 'professional_dev' | 'professional_sel'

export type Profile = TablesHelper<'profiles'>
export type UserRoleRow = TablesHelper<'user_roles'>
