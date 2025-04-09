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
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          role: string
          company: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          role?: string
          company?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: string
          company?: string | null
          created_at?: string
        }
      }
      shipments: {
        Row: {
          id: number
          tracking_id: string
          origin: string
          destination: string
          client_id: number
          shipper_id: number | null
          due_date: string
          status: string
          value: number | null
          weight: number | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          tracking_id: string
          origin: string
          destination: string
          client_id: number
          shipper_id?: number | null
          due_date: string
          status?: string
          value?: number | null
          weight?: number | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          tracking_id?: string
          origin?: string
          destination?: string
          client_id?: number
          shipper_id?: number | null
          due_date?: string
          status?: string
          value?: number | null
          weight?: number | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      // Add other tables as needed
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 