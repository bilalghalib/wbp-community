// Generated types from Supabase schema
// Run: supabase gen types typescript --local > types/database.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          location_city: string | null
          location_region: string | null
          location_country: string | null
          timezone: string | null
          website_url: string | null
          contact_email: string | null
          is_active: boolean
          visibility_level: 'private' | 'network' | 'public'
          created_at: string
          updated_at: string
          created_by_user_id: string | null
          tsv: unknown | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          location_city?: string | null
          location_region?: string | null
          location_country?: string | null
          timezone?: string | null
          website_url?: string | null
          contact_email?: string | null
          is_active?: boolean
          visibility_level?: 'private' | 'network' | 'public'
          created_at?: string
          updated_at?: string
          created_by_user_id?: string | null
          tsv?: unknown | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          location_city?: string | null
          location_region?: string | null
          location_country?: string | null
          timezone?: string | null
          website_url?: string | null
          contact_email?: string | null
          is_active?: boolean
          visibility_level?: 'private' | 'network' | 'public'
          created_at?: string
          updated_at?: string
          created_by_user_id?: string | null
          tsv?: unknown | null
        }
      }
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          avatar_url: string | null
          email_confirmed_at: string | null
          is_active: boolean
          last_login_at: string | null
          created_at: string
          updated_at: string
          failed_login_attempts: number
          locked_until: string | null
        }
        Insert: {
          id: string
          email: string
          full_name: string
          avatar_url?: string | null
          email_confirmed_at?: string | null
          is_active?: boolean
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
          failed_login_attempts?: number
          locked_until?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string | null
          email_confirmed_at?: string | null
          is_active?: boolean
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
          failed_login_attempts?: number
          locked_until?: string | null
        }
      }
      organization_memberships: {
        Row: {
          id: string
          organization_id: string
          user_id: string
          role: 'primary_admin' | 'backup_admin' | 'contributor' | 'viewer'
          permissions: Json
          joined_at: string
          invited_by_user_id: string | null
          invitation_accepted_at: string | null
          is_active: boolean
        }
        Insert: {
          id?: string
          organization_id: string
          user_id: string
          role: 'primary_admin' | 'backup_admin' | 'contributor' | 'viewer'
          permissions?: Json
          joined_at?: string
          invited_by_user_id?: string | null
          invitation_accepted_at?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          organization_id?: string
          user_id?: string
          role?: 'primary_admin' | 'backup_admin' | 'contributor' | 'viewer'
          permissions?: Json
          joined_at?: string
          invited_by_user_id?: string | null
          invitation_accepted_at?: string | null
          is_active?: boolean
        }
      }
      service_providers: {
        Row: {
          id: string
          full_name: string
          email: string | null
          phone: string | null
          website_url: string | null
          photo_url: string | null
          bio: string | null
          specialties: string[]
          modalities: string[]
          languages: string[]
          location_city: string | null
          location_region: string | null
          location_country: string | null
          timezone: string | null
          offers_remote: boolean
          offers_in_person: boolean
          is_accepting_clients: boolean
          is_visible: boolean
          availability_note: string | null
          created_at: string
          updated_at: string
          created_by_user_id: string | null
          last_edited_by_user_id: string | null
          tsv: unknown | null
        }
        Insert: {
          id?: string
          full_name: string
          email?: string | null
          phone?: string | null
          website_url?: string | null
          photo_url?: string | null
          bio?: string | null
          specialties?: string[]
          modalities?: string[]
          languages?: string[]
          location_city?: string | null
          location_region?: string | null
          location_country?: string | null
          timezone?: string | null
          offers_remote?: boolean
          offers_in_person?: boolean
          is_accepting_clients?: boolean
          is_visible?: boolean
          availability_note?: string | null
          created_at?: string
          updated_at?: string
          created_by_user_id?: string | null
          last_edited_by_user_id?: string | null
          tsv?: unknown | null
        }
        Update: {
          id?: string
          full_name?: string
          email?: string | null
          phone?: string | null
          website_url?: string | null
          photo_url?: string | null
          bio?: string | null
          specialties?: string[]
          modalities?: string[]
          languages?: string[]
          location_city?: string | null
          location_region?: string | null
          location_country?: string | null
          timezone?: string | null
          offers_remote?: boolean
          offers_in_person?: boolean
          is_accepting_clients?: boolean
          is_visible?: boolean
          availability_note?: string | null
          created_at?: string
          updated_at?: string
          created_by_user_id?: string | null
          last_edited_by_user_id?: string | null
          tsv?: unknown | null
        }
      }
      service_provider_recommendations: {
        Row: {
          id: string
          service_provider_id: string
          organization_id: string
          recommended_by_user_id: string
          relationship_note: string | null
          would_recommend_for: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          service_provider_id: string
          organization_id: string
          recommended_by_user_id: string
          relationship_note?: string | null
          would_recommend_for?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          service_provider_id?: string
          organization_id?: string
          recommended_by_user_id?: string
          relationship_note?: string | null
          would_recommend_for?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      research_documents: {
        Row: {
          id: string
          organization_id: string
          uploaded_by_user_id: string
          title: string
          description: string | null
          file_url: string
          file_name: string
          file_size_bytes: number | null
          mime_type: string | null
          publication_year: number | null
          authors: string[]
          doi: string | null
          tags: string[]
          topics: string[]
          research_type: string | null
          visibility_level: 'private' | 'network' | 'public'
          is_processed: boolean
          processing_status: 'pending' | 'processing' | 'complete' | 'failed' | null
          embeddings_generated: boolean
          extracted_text: string | null
          created_at: string
          updated_at: string
          tsv: unknown | null
        }
        Insert: {
          id?: string
          organization_id: string
          uploaded_by_user_id: string
          title: string
          description?: string | null
          file_url: string
          file_name: string
          file_size_bytes?: number | null
          mime_type?: string | null
          publication_year?: number | null
          authors?: string[]
          doi?: string | null
          tags?: string[]
          topics?: string[]
          research_type?: string | null
          visibility_level?: 'private' | 'network' | 'public'
          is_processed?: boolean
          processing_status?: 'pending' | 'processing' | 'complete' | 'failed' | null
          embeddings_generated?: boolean
          extracted_text?: string | null
          created_at?: string
          updated_at?: string
          tsv?: unknown | null
        }
        Update: {
          id?: string
          organization_id?: string
          uploaded_by_user_id?: string
          title?: string
          description?: string | null
          file_url?: string
          file_name?: string
          file_size_bytes?: number | null
          mime_type?: string | null
          publication_year?: number | null
          authors?: string[]
          doi?: string | null
          tags?: string[]
          topics?: string[]
          research_type?: string | null
          visibility_level?: 'private' | 'network' | 'public'
          is_processed?: boolean
          processing_status?: 'pending' | 'processing' | 'complete' | 'failed' | null
          embeddings_generated?: boolean
          extracted_text?: string | null
          created_at?: string
          updated_at?: string
          tsv?: unknown | null
        }
      }
      // Add other tables as needed...
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_org_member: {
        Args: {
          org_id: string
          user_id: string
        }
        Returns: boolean
      }
      is_org_admin: {
        Args: {
          org_id: string
          user_id: string
        }
        Returns: boolean
      }
      has_permission: {
        Args: {
          org_id: string
          user_id: string
          permission: string
        }
        Returns: boolean
      }
      is_wbp_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      get_deployment_aggregate_stats: {
        Args: {
          deployment_id: string
        }
        Returns: Json
      }
      generate_slug: {
        Args: {
          name: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
