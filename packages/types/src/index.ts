// Shared types — populated starting E3 (schema)

export type UserRole = 'admin' | 'coach' | 'selector' | 'professional_dev' | 'professional_sel'

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]
