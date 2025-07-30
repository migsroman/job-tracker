import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          avatarUrl: string | null
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          avatarUrl?: string | null
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatarUrl?: string | null
          createdAt?: string
          updatedAt?: string
        }
      }
      job_applications: {
        Row: {
          id: string
          userId: string
          jobTitle: string
          companyName: string
          location: string
          status: string
          applicationDate: string
          jobUrl: string | null
          notes: string | null
          salaryRange: string | null
          priority: string
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          userId: string
          jobTitle: string
          companyName: string
          location: string
          status?: string
          applicationDate?: string
          jobUrl?: string | null
          notes?: string | null
          salaryRange?: string | null
          priority?: string
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          userId?: string
          jobTitle?: string
          companyName?: string
          location?: string
          status?: string
          applicationDate?: string
          jobUrl?: string | null
          notes?: string | null
          salaryRange?: string | null
          priority?: string
          createdAt?: string
          updatedAt?: string
        }
      }
      user_settings: {
        Row: {
          id: string
          userId: string
          preferredView: string
          emailNotifications: boolean
          theme: string
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          userId: string
          preferredView?: string
          emailNotifications?: boolean
          theme?: string
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          userId?: string
          preferredView?: string
          emailNotifications?: boolean
          theme?: string
          createdAt?: string
          updatedAt?: string
        }
      }
    }
  }
}