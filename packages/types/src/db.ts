export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      action_items: {
        Row: {
          created_at: string
          description: string
          id: string
          notes: string | null
          professional_id: string
          responsible: string | null
          skill_id: string | null
          source_skillboard_id: string | null
          status: string
          timeframe: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          notes?: string | null
          professional_id: string
          responsible?: string | null
          skill_id?: string | null
          source_skillboard_id?: string | null
          status?: string
          timeframe?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          notes?: string | null
          professional_id?: string
          responsible?: string | null
          skill_id?: string | null
          source_skillboard_id?: string | null
          status?: string
          timeframe?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'action_items_professional_id_fkey'
            columns: ['professional_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'action_items_skill_id_fkey'
            columns: ['skill_id']
            isOneToOne: false
            referencedRelation: 'skills'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'action_items_source_skillboard_id_fkey'
            columns: ['source_skillboard_id']
            isOneToOne: false
            referencedRelation: 'skillboards'
            referencedColumns: ['id']
          },
        ]
      }
      assessment_assignments: {
        Row: {
          assigned_at: string
          assigned_by: string
          assignee_id: string
          completed_at: string | null
          context_id: string | null
          context_type: string
          created_at: string
          id: string
          skill_id: string
          started_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          assigned_at?: string
          assigned_by: string
          assignee_id: string
          completed_at?: string | null
          context_id?: string | null
          context_type: string
          created_at?: string
          id?: string
          skill_id: string
          started_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string
          assignee_id?: string
          completed_at?: string | null
          context_id?: string | null
          context_type?: string
          created_at?: string
          id?: string
          skill_id?: string
          started_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'assessment_assignments_assigned_by_fkey'
            columns: ['assigned_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'assessment_assignments_assignee_id_fkey'
            columns: ['assignee_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'assessment_assignments_skill_id_fkey'
            columns: ['skill_id']
            isOneToOne: false
            referencedRelation: 'skills'
            referencedColumns: ['id']
          },
        ]
      }
      assigned_skills: {
        Row: {
          assessment_status: string
          assignee_id: string
          assignee_type: string
          category: string | null
          created_at: string
          id: string
          min_level: number | null
          skill_id: string
          source_skillboard_id: string | null
          target_level: number | null
          updated_at: string
        }
        Insert: {
          assessment_status?: string
          assignee_id: string
          assignee_type: string
          category?: string | null
          created_at?: string
          id?: string
          min_level?: number | null
          skill_id: string
          source_skillboard_id?: string | null
          target_level?: number | null
          updated_at?: string
        }
        Update: {
          assessment_status?: string
          assignee_id?: string
          assignee_type?: string
          category?: string | null
          created_at?: string
          id?: string
          min_level?: number | null
          skill_id?: string
          source_skillboard_id?: string | null
          target_level?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'assigned_skills_skill_id_fkey'
            columns: ['skill_id']
            isOneToOne: false
            referencedRelation: 'skills'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'assigned_skills_source_skillboard_id_fkey'
            columns: ['source_skillboard_id']
            isOneToOne: false
            referencedRelation: 'skillboards'
            referencedColumns: ['id']
          },
        ]
      }
      audit_log: {
        Row: {
          action: string
          actor_id: string | null
          actor_role: string | null
          created_at: string
          id: string
          ip: unknown
          metadata: Json
          resource_id: string | null
          resource_type: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          actor_role?: string | null
          created_at?: string
          id?: string
          ip?: unknown
          metadata?: Json
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          actor_role?: string | null
          created_at?: string
          id?: string
          ip?: unknown
          metadata?: Json
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'audit_log_actor_id_fkey'
            columns: ['actor_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      coach_professional_links: {
        Row: {
          accepted_at: string | null
          coach_id: string
          created_at: string
          id: string
          invited_at: string
          professional_id: string
          status: string
          updated_at: string
        }
        Insert: {
          accepted_at?: string | null
          coach_id: string
          created_at?: string
          id?: string
          invited_at?: string
          professional_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          accepted_at?: string | null
          coach_id?: string
          created_at?: string
          id?: string
          invited_at?: string
          professional_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'coach_professional_links_coach_id_fkey'
            columns: ['coach_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'coach_professional_links_professional_id_fkey'
            columns: ['professional_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      development_goals: {
        Row: {
          coach_id: string
          context: string | null
          created_at: string
          description: string | null
          horizon: string | null
          id: string
          priority: number
          professional_id: string
          title: string
          updated_at: string
        }
        Insert: {
          coach_id: string
          context?: string | null
          created_at?: string
          description?: string | null
          horizon?: string | null
          id?: string
          priority?: number
          professional_id: string
          title: string
          updated_at?: string
        }
        Update: {
          coach_id?: string
          context?: string | null
          created_at?: string
          description?: string | null
          horizon?: string | null
          id?: string
          priority?: number
          professional_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'development_goals_coach_id_fkey'
            columns: ['coach_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'development_goals_professional_id_fkey'
            columns: ['professional_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      dimensions: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_archived: boolean
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_archived?: boolean
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_archived?: boolean
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      external_form_links: {
        Row: {
          created_at: string
          created_by: string | null
          expires_at: string
          form_schema: Json
          id: string
          skillboard_id: string
          submitted_data: Json | null
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          expires_at: string
          form_schema: Json
          id?: string
          skillboard_id: string
          submitted_data?: Json | null
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          expires_at?: string
          form_schema?: Json
          id?: string
          skillboard_id?: string
          submitted_data?: Json | null
          token?: string
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'external_form_links_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'external_form_links_skillboard_id_fkey'
            columns: ['skillboard_id']
            isOneToOne: false
            referencedRelation: 'skillboards'
            referencedColumns: ['id']
          },
        ]
      }
      feature_flags: {
        Row: {
          description: string | null
          enabled: boolean
          key: string
          rollout_percentage: number
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          description?: string | null
          enabled?: boolean
          key: string
          rollout_percentage?: number
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          description?: string | null
          enabled?: boolean
          key?: string
          rollout_percentage?: number
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'feature_flags_updated_by_fkey'
            columns: ['updated_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      licenses: {
        Row: {
          created_at: string
          ends_at: string | null
          id: string
          metadata: Json | null
          plan: string
          starts_at: string | null
          status: string
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          ends_at?: string | null
          id?: string
          metadata?: Json | null
          plan: string
          starts_at?: string | null
          status?: string
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          ends_at?: string | null
          id?: string
          metadata?: Json | null
          plan?: string
          starts_at?: string | null
          status?: string
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'licenses_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          link: string | null
          read_at: string | null
          title: string | null
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read_at?: string | null
          title?: string | null
          type: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read_at?: string | null
          title?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'notifications_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      process_candidates: {
        Row: {
          candidate_id: string
          created_at: string
          id: string
          invited_at: string
          process_id: string
          status: string
          updated_at: string
        }
        Insert: {
          candidate_id: string
          created_at?: string
          id?: string
          invited_at?: string
          process_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          candidate_id?: string
          created_at?: string
          id?: string
          invited_at?: string
          process_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'process_candidates_candidate_id_fkey'
            columns: ['candidate_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'process_candidates_process_id_fkey'
            columns: ['process_id']
            isOneToOne: false
            referencedRelation: 'selection_processes'
            referencedColumns: ['id']
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          metadata: Json
          primary_role: string
          status: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          metadata?: Json
          primary_role?: string
          status?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          metadata?: Json
          primary_role?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      selection_processes: {
        Row: {
          context: string | null
          created_at: string
          id: string
          industry: string | null
          role_name: string
          selector_id: string
          seniority: string | null
          status: string
          updated_at: string
        }
        Insert: {
          context?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          role_name: string
          selector_id: string
          seniority?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          context?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          role_name?: string
          selector_id?: string
          seniority?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'selection_processes_selector_id_fkey'
            columns: ['selector_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      skill_levels: {
        Row: {
          created_at: string
          id: string
          level: number
          observable_behaviors: string | null
          skill_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          level: number
          observable_behaviors?: string | null
          skill_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          level?: number
          observable_behaviors?: string | null
          skill_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'skill_levels_skill_id_fkey'
            columns: ['skill_id']
            isOneToOne: false
            referencedRelation: 'skills'
            referencedColumns: ['id']
          },
        ]
      }
      skillboard_outputs: {
        Row: {
          created_at: string
          data: Json
          id: string
          output_type: string
          skillboard_id: string
        }
        Insert: {
          created_at?: string
          data: Json
          id?: string
          output_type: string
          skillboard_id: string
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          output_type?: string
          skillboard_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'skillboard_outputs_skillboard_id_fkey'
            columns: ['skillboard_id']
            isOneToOne: false
            referencedRelation: 'skillboards'
            referencedColumns: ['id']
          },
        ]
      }
      skillboard_participations: {
        Row: {
          created_at: string
          id: string
          inputs: Json
          participant_id: string
          skillboard_id: string
          status: string
          submitted_at: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          inputs?: Json
          participant_id: string
          skillboard_id: string
          status?: string
          submitted_at?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          inputs?: Json
          participant_id?: string
          skillboard_id?: string
          status?: string
          submitted_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'skillboard_participations_participant_id_fkey'
            columns: ['participant_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'skillboard_participations_skillboard_id_fkey'
            columns: ['skillboard_id']
            isOneToOne: false
            referencedRelation: 'skillboards'
            referencedColumns: ['id']
          },
        ]
      }
      skillboard_templates: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          estimated_time: string | null
          id: string
          instructions_md: string | null
          is_active: boolean
          name: string
          output_depth: string | null
          participation_mode: string | null
          process_moment: string | null
          process_type: string | null
          scope: string | null
          template_key: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          estimated_time?: string | null
          id?: string
          instructions_md?: string | null
          is_active?: boolean
          name: string
          output_depth?: string | null
          participation_mode?: string | null
          process_moment?: string | null
          process_type?: string | null
          scope?: string | null
          template_key: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          estimated_time?: string | null
          id?: string
          instructions_md?: string | null
          is_active?: boolean
          name?: string
          output_depth?: string | null
          participation_mode?: string | null
          process_moment?: string | null
          process_type?: string | null
          scope?: string | null
          template_key?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'skillboard_templates_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      skillboards: {
        Row: {
          closed_at: string | null
          created_at: string
          id: string
          owner_id: string
          state: Json
          status: string
          target_id: string
          target_type: string
          template_key: string
          updated_at: string
        }
        Insert: {
          closed_at?: string | null
          created_at?: string
          id?: string
          owner_id: string
          state?: Json
          status?: string
          target_id: string
          target_type: string
          template_key: string
          updated_at?: string
        }
        Update: {
          closed_at?: string | null
          created_at?: string
          id?: string
          owner_id?: string
          state?: Json
          status?: string
          target_id?: string
          target_type?: string
          template_key?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'skillboards_owner_id_fkey'
            columns: ['owner_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'skillboards_template_key_fkey'
            columns: ['template_key']
            isOneToOne: false
            referencedRelation: 'skillboard_templates'
            referencedColumns: ['template_key']
          },
        ]
      }
      skills: {
        Row: {
          created_at: string
          description: string | null
          dimension_id: string
          id: string
          is_archived: boolean
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          dimension_id: string
          id?: string
          is_archived?: boolean
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          dimension_id?: string
          id?: string
          is_archived?: boolean
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'skills_dimension_id_fkey'
            columns: ['dimension_id']
            isOneToOne: false
            referencedRelation: 'dimensions'
            referencedColumns: ['id']
          },
        ]
      }
      user_roles: {
        Row: {
          granted_at: string
          granted_by: string | null
          role: string
          user_id: string
        }
        Insert: {
          granted_at?: string
          granted_by?: string | null
          role: string
          user_id: string
        }
        Update: {
          granted_at?: string
          granted_by?: string | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'user_roles_granted_by_fkey'
            columns: ['granted_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'user_roles_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Database
type DefaultSchema = Database['public']

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never
