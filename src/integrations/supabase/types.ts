export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      employees: {
        Row: {
          created_at: string | null
          department: string
          email: string
          id: string
          last_active: string | null
          name: string
          role: string
          usage_level: string
          weekly_ai_hours: number | null
        }
        Insert: {
          created_at?: string | null
          department: string
          email: string
          id?: string
          last_active?: string | null
          name: string
          role: string
          usage_level?: string
          weekly_ai_hours?: number | null
        }
        Update: {
          created_at?: string | null
          department?: string
          email?: string
          id?: string
          last_active?: string | null
          name?: string
          role?: string
          usage_level?: string
          weekly_ai_hours?: number | null
        }
        Relationships: []
      }
      financial_settings: {
        Row: {
          amortization_months: number
          created_at: string | null
          fiscal_year_start: string
          id: string
          monthly_amortized: number | null
          total_investment: number
        }
        Insert: {
          amortization_months?: number
          created_at?: string | null
          fiscal_year_start?: string
          id?: string
          monthly_amortized?: number | null
          total_investment?: number
        }
        Update: {
          amortization_months?: number
          created_at?: string | null
          fiscal_year_start?: string
          id?: string
          monthly_amortized?: number | null
          total_investment?: number
        }
        Relationships: []
      }
      monthly_metrics: {
        Row: {
          active_users: number
          adoption_rate: number
          amortized_cost: number
          cash_outflow: number
          created_at: string | null
          cumulative_payback_pct: number | null
          cumulative_value: number | null
          id: string
          mau_rate: number | null
          month_index: number
          month_label: string
          monthly_roi: number
          power_users_count: number | null
          value_realized: number
        }
        Insert: {
          active_users?: number
          adoption_rate?: number
          amortized_cost?: number
          cash_outflow?: number
          created_at?: string | null
          cumulative_payback_pct?: number | null
          cumulative_value?: number | null
          id?: string
          mau_rate?: number | null
          month_index: number
          month_label: string
          monthly_roi?: number
          power_users_count?: number | null
          value_realized?: number
        }
        Update: {
          active_users?: number
          adoption_rate?: number
          amortized_cost?: number
          cash_outflow?: number
          created_at?: string | null
          cumulative_payback_pct?: number | null
          cumulative_value?: number | null
          id?: string
          mau_rate?: number | null
          month_index?: number
          month_label?: string
          monthly_roi?: number
          power_users_count?: number | null
          value_realized?: number
        }
        Relationships: []
      }
      projects: {
        Row: {
          budget_allocated: number | null
          budget_spent: number | null
          created_at: string | null
          department: string | null
          id: string
          impact_level: string
          name: string
          north_star: string
          owner: string
          roi_percent: number | null
          status: string
          updated_at: string | null
        }
        Insert: {
          budget_allocated?: number | null
          budget_spent?: number | null
          created_at?: string | null
          department?: string | null
          id?: string
          impact_level?: string
          name: string
          north_star: string
          owner: string
          roi_percent?: number | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          budget_allocated?: number | null
          budget_spent?: number | null
          created_at?: string | null
          department?: string | null
          id?: string
          impact_level?: string
          name?: string
          north_star?: string
          owner?: string
          roi_percent?: number | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      roi_calculations: {
        Row: {
          active_users: number
          attribution_factor_used: number
          compliance_savings: number
          created_at: string | null
          cumulative_costs: number
          cumulative_net_value: number
          cumulative_roi: number
          downtime_reduction: number
          efficiency_factor_used: number
          fraud_prevention: number
          gross_fte_savings: number
          gross_revenue: number
          hidden_costs: number
          id: string
          license_savings: number
          month_index: number
          month_label: string
          monthly_costs: number
          monthly_roi: number
          net_ai_value: number
          net_fte_savings: number
          net_revenue: number
          outsourcing_reduction: number
          rework_reduction: number
          total_benefits: number
          total_cost_avoidance: number
          total_costs: number
          total_hard_savings: number
        }
        Insert: {
          active_users?: number
          attribution_factor_used?: number
          compliance_savings?: number
          created_at?: string | null
          cumulative_costs?: number
          cumulative_net_value?: number
          cumulative_roi?: number
          downtime_reduction?: number
          efficiency_factor_used?: number
          fraud_prevention?: number
          gross_fte_savings?: number
          gross_revenue?: number
          hidden_costs?: number
          id?: string
          license_savings?: number
          month_index: number
          month_label: string
          monthly_costs?: number
          monthly_roi?: number
          net_ai_value?: number
          net_fte_savings?: number
          net_revenue?: number
          outsourcing_reduction?: number
          rework_reduction?: number
          total_benefits?: number
          total_cost_avoidance?: number
          total_costs?: number
          total_hard_savings?: number
        }
        Update: {
          active_users?: number
          attribution_factor_used?: number
          compliance_savings?: number
          created_at?: string | null
          cumulative_costs?: number
          cumulative_net_value?: number
          cumulative_roi?: number
          downtime_reduction?: number
          efficiency_factor_used?: number
          fraud_prevention?: number
          gross_fte_savings?: number
          gross_revenue?: number
          hidden_costs?: number
          id?: string
          license_savings?: number
          month_index?: number
          month_label?: string
          monthly_costs?: number
          monthly_roi?: number
          net_ai_value?: number
          net_fte_savings?: number
          net_revenue?: number
          outsourcing_reduction?: number
          rework_reduction?: number
          total_benefits?: number
          total_cost_avoidance?: number
          total_costs?: number
          total_hard_savings?: number
        }
        Relationships: []
      }
      roi_settings: {
        Row: {
          attribution_factor: number
          avg_hourly_cost: number
          avg_hourly_rate: number
          compliance_savings: number
          created_at: string | null
          downtime_reduction: number
          efficiency_factor: number
          fraud_prevention: number
          hours_saved_per_user_week: number
          id: string
          implementation_cost: number
          learning_curve_hours: number
          learning_curve_penalty: number
          license_savings: number
          monthly_licenses: number
          monthly_revenue_uplift: number
          outsourcing_reduction: number
          rework_reduction: number
          training_budget: number
          updated_at: string | null
        }
        Insert: {
          attribution_factor?: number
          avg_hourly_cost?: number
          avg_hourly_rate?: number
          compliance_savings?: number
          created_at?: string | null
          downtime_reduction?: number
          efficiency_factor?: number
          fraud_prevention?: number
          hours_saved_per_user_week?: number
          id?: string
          implementation_cost?: number
          learning_curve_hours?: number
          learning_curve_penalty?: number
          license_savings?: number
          monthly_licenses?: number
          monthly_revenue_uplift?: number
          outsourcing_reduction?: number
          rework_reduction?: number
          training_budget?: number
          updated_at?: string | null
        }
        Update: {
          attribution_factor?: number
          avg_hourly_cost?: number
          avg_hourly_rate?: number
          compliance_savings?: number
          created_at?: string | null
          downtime_reduction?: number
          efficiency_factor?: number
          fraud_prevention?: number
          hours_saved_per_user_week?: number
          id?: string
          implementation_cost?: number
          learning_curve_hours?: number
          learning_curve_penalty?: number
          license_savings?: number
          monthly_licenses?: number
          monthly_revenue_uplift?: number
          outsourcing_reduction?: number
          rework_reduction?: number
          training_budget?: number
          updated_at?: string | null
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
