export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      airport_imports: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          imported_count: number | null
          status: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          imported_count?: number | null
          status: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          imported_count?: number | null
          status?: string
        }
        Relationships: []
      }
      airports: {
        Row: {
          city: string | null
          country: string | null
          created_at: string
          iata_code: string
          id: string
          latitude: number | null
          longitude: number | null
          name: string
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string
          iata_code: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string
          iata_code?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
        }
        Relationships: []
      }
      api_credentials: {
        Row: {
          api_key: string
          created_at: string
          id: string
          provider: string
        }
        Insert: {
          api_key: string
          created_at?: string
          id?: string
          provider: string
        }
        Update: {
          api_key?: string
          created_at?: string
          id?: string
          provider?: string
        }
        Relationships: []
      }
      booking_addons: {
        Row: {
          booking_id: string
          created_at: string
          description: string | null
          id: string
          name: string
          price: number
          status: string | null
          type: Database["public"]["Enums"]["booking_addon_type"]
          updated_at: string
        }
        Insert: {
          booking_id: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          price: number
          status?: string | null
          type: Database["public"]["Enums"]["booking_addon_type"]
          updated_at?: string
        }
        Update: {
          booking_id?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          price?: number
          status?: string | null
          type?: Database["public"]["Enums"]["booking_addon_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_addons_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_payments: {
        Row: {
          amount: number
          base_amount: number
          booking_id: string
          created_at: string
          currency: string
          duffel_payment_id: string | null
          fees_amount: number
          id: string
          payment_method: string | null
          status: Database["public"]["Enums"]["payment_status"]
          taxes_amount: number
          updated_at: string
        }
        Insert: {
          amount: number
          base_amount: number
          booking_id: string
          created_at?: string
          currency?: string
          duffel_payment_id?: string | null
          fees_amount?: number
          id?: string
          payment_method?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          taxes_amount?: number
          updated_at?: string
        }
        Update: {
          amount?: number
          base_amount?: number
          booking_id?: string
          created_at?: string
          currency?: string
          duffel_payment_id?: string | null
          fees_amount?: number
          id?: string
          payment_method?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          taxes_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          booking_reference: string | null
          cabin_class: string
          created_at: string
          departure_date: string
          destination: string
          duffel_booking_id: string | null
          duffel_offer_id: string | null
          id: string
          origin: string
          passengers: number
          return_date: string | null
          status: Database["public"]["Enums"]["booking_status"]
          total_price: number
          updated_at: string
          user_id: string
        }
        Insert: {
          booking_reference?: string | null
          cabin_class: string
          created_at?: string
          departure_date: string
          destination: string
          duffel_booking_id?: string | null
          duffel_offer_id?: string | null
          id?: string
          origin: string
          passengers?: number
          return_date?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          total_price: number
          updated_at?: string
          user_id: string
        }
        Update: {
          booking_reference?: string | null
          cabin_class?: string
          created_at?: string
          departure_date?: string
          destination?: string
          duffel_booking_id?: string | null
          duffel_offer_id?: string | null
          id?: string
          origin?: string
          passengers?: number
          return_date?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          total_price?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      client_analysis: {
        Row: {
          description: string | null
          file_name: string
          file_path: string
          file_size: number
          id: string
          uploaded_at: string | null
          user_id: string | null
        }
        Insert: {
          description?: string | null
          file_name: string
          file_path: string
          file_size: number
          id?: string
          uploaded_at?: string | null
          user_id?: string | null
        }
        Update: {
          description?: string | null
          file_name?: string
          file_path?: string
          file_size?: number
          id?: string
          uploaded_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      deals: {
        Row: {
          category: Database["public"]["Enums"]["deal_category"]
          created_at: string
          description: string
          destination: string
          discount: string
          id: string
          image_url: string
          original_price: number
          price: number
          title: string
          updated_at: string
          valid_until: string
        }
        Insert: {
          category: Database["public"]["Enums"]["deal_category"]
          created_at?: string
          description: string
          destination: string
          discount: string
          id?: string
          image_url: string
          original_price: number
          price: number
          title: string
          updated_at?: string
          valid_until: string
        }
        Update: {
          category?: Database["public"]["Enums"]["deal_category"]
          created_at?: string
          description?: string
          destination?: string
          discount?: string
          id?: string
          image_url?: string
          original_price?: number
          price?: number
          title?: string
          updated_at?: string
          valid_until?: string
        }
        Relationships: []
      }
      passenger_details: {
        Row: {
          booking_id: string
          created_at: string
          date_of_birth: string
          email: string | null
          first_name: string
          gender: string | null
          id: string
          last_name: string
          passenger_id: string | null
          passport_number: string | null
          phone_number: string | null
          title: string | null
        }
        Insert: {
          booking_id: string
          created_at?: string
          date_of_birth: string
          email?: string | null
          first_name: string
          gender?: string | null
          id?: string
          last_name: string
          passenger_id?: string | null
          passport_number?: string | null
          phone_number?: string | null
          title?: string | null
        }
        Update: {
          booking_id?: string
          created_at?: string
          date_of_birth?: string
          email?: string | null
          first_name?: string
          gender?: string | null
          id?: string
          last_name?: string
          passenger_id?: string | null
          passport_number?: string | null
          phone_number?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "passenger_details_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      price_markup_settings: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          markup_type: Database["public"]["Enums"]["markup_type"]
          markup_value: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          markup_type?: Database["public"]["Enums"]["markup_type"]
          markup_value?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          markup_type?: Database["public"]["Enums"]["markup_type"]
          markup_value?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_login: string | null
          last_name: string | null
          status: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          last_login?: string | null
          last_name?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_login?: string | null
          last_name?: string | null
          status?: string | null
        }
        Relationships: []
      }
      support_chat_messages: {
        Row: {
          created_at: string
          id: string
          message: string
          sender_type: string
          support_message_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          sender_type: string
          support_message_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          sender_type?: string
          support_message_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_chat_messages_support_message_id_fkey"
            columns: ["support_message_id"]
            isOneToOne: false
            referencedRelation: "support_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      support_messages: {
        Row: {
          admin_notes: string | null
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          status: Database["public"]["Enums"]["support_message_status"] | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: Database["public"]["Enums"]["support_message_status"] | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: Database["public"]["Enums"]["support_message_status"] | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      system_metrics: {
        Row: {
          created_at: string
          id: string
          metric_type: Database["public"]["Enums"]["system_metric_type"]
          value: number
        }
        Insert: {
          created_at?: string
          id?: string
          metric_type: Database["public"]["Enums"]["system_metric_type"]
          value: number
        }
        Update: {
          created_at?: string
          id?: string
          metric_type?: Database["public"]["Enums"]["system_metric_type"]
          value?: number
        }
        Relationships: []
      }
      travel_stats: {
        Row: {
          created_at: string
          total_bookings: number | null
          total_miles: number | null
          updated_at: string
          user_id: string
          visited_destinations: number | null
        }
        Insert: {
          created_at?: string
          total_bookings?: number | null
          total_miles?: number | null
          updated_at?: string
          user_id: string
          visited_destinations?: number | null
        }
        Update: {
          created_at?: string
          total_bookings?: number | null
          total_miles?: number | null
          updated_at?: string
          user_id?: string
          visited_destinations?: number | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      booking_addon_type:
        | "baggage"
        | "meal"
        | "seat"
        | "cancellation"
        | "change"
      booking_status: "pending" | "confirmed" | "cancelled" | "draft"
      deal_category: "weekend" | "seasonal" | "business" | "all"
      markup_type: "percentage" | "fixed"
      payment_status: "pending" | "processing" | "completed" | "failed" | "held"
      support_message_status: "new" | "in_progress" | "resolved" | "closed"
      system_metric_type: "server" | "database" | "cpu"
      user_role: "user" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
