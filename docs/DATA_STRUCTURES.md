# Data Structures and Schema Documentation

This document outlines the core data structures and database schema used in the ROI Calculator application.

## 1. Database Schema (Supabase/PostgreSQL)

The application uses a relational database hosted on Supabase. The schema is defined primarily in SQL migrations.

### 1.1 `roi_settings` Table

Stores the global configuration parameters for the ROI calculation methodology. These settings drive the calculator's logic.

| Column Name | Type | Key | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | PK | `gen_random_uuid()` | Unique identifier for the settings record. |
| `efficiency_factor` | `numeric` | | `0.55` | Global efficiency factor (Eta) applied to time savings. |
| `attribution_factor` | `numeric` | | `0.30` | Attribution factor (Alpha) for revenue uplift. |
| `avg_hourly_rate` | `numeric` | | `45` | Average hourly rate of employees (for savings calculation). |
| `avg_hourly_cost` | `numeric` | | `35` | Average hourly cost of employees. |
| `hours_saved_per_user_week` | `numeric` | | `2.5` | Estimated hours saved per user per week. |
| `learning_curve_penalty` | `numeric` | | `0.20` | Penalty factor for initial learning curve. |
| `monthly_licenses` | `numeric` | | `8500` | Recurring monthly cost for AI tool licenses. |
| `implementation_cost` | `numeric` | | `15000` | One-time implementation cost (CapEx). |
| `training_budget` | `numeric` | | `12000` | One-time training budget (CapEx). |
| `learning_curve_hours` | `numeric` | | `20` | Est. hours spent learning per user (Hidden Cost). |
| `monthly_revenue_uplift` | `numeric` | | `25000` | Est. monthly revenue increase enabled by AI. |
| `license_savings` | `numeric` | | `2000` | Monthly savings from consolidated licenses. |
| `outsourcing_reduction` | `numeric` | | `3500` | Monthly savings from reduced outsourcing. |
| `downtime_reduction` | `numeric` | | `1500` | Monthly cost avoidance from reduced downtime. |
| `compliance_savings` | `numeric` | | `800` | Monthly cost avoidance from compliance. |
| `fraud_prevention` | `numeric` | | `500` | Monthly cost avoidance from fraud prevention. |
| `rework_reduction` | `numeric` | | `1200` | Monthly cost avoidance from reduced rework. |
| `created_at` | `timestamptz` | | `now()` | Timestamp of creation. |
| `updated_at` | `timestamptz` | | `now()` | Timestamp of last update. |

### 1.2 `roi_calculations` Table

Stores the pre-calculated or snapshotted ROI metrics for specific time periods (months). This allows for historical tracking and trend analysis.

| Column Name | Type | Key | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | PK | Unique identifier. |
| `month_index` | `integer` | Unique | Sequential index of the month (e.g., 1, 2, 3). |
| `month_label` | `text` | | Display label for the month (e.g., 'M1', 'Jan'). |
| `active_users` | `integer` | | Number of active users in that month. |
| `efficiency_factor_used` | `numeric` | | The specific Eta factor used for this month's calculation. |
| `attribution_factor_used` | `numeric` | | The specific Alpha factor used for this month's calculation. |
| `gross_fte_savings` | `numeric` | | Raw value of time saved converted to currency. |
| `net_fte_savings` | `numeric` | | FTE savings after applying efficiency factor. |
| `total_hard_savings` | `numeric` | | Sum of Net FTE Savings + License Savings + Outsourcing Reduction. |
| `gross_revenue` | `numeric` | | Raw revenue uplift. |
| `net_revenue` | `numeric` | | Revenue uplift after applying attribution factor. |
| `total_cost_avoidance` | `numeric` | | Sum of all risk mitigation values. |
| `total_benefits` | `numeric` | | Sum of Hard Savings + Net Revenue + Cost Avoidance. |
| `monthly_costs` | `numeric` | | OpEx for the month. |
| `hidden_costs` | `numeric` | | Calculated hidden costs (e.g., learning curve impact). |
| `total_costs` | `numeric` | | Sum of Monthly Costs + Hidden Costs (+ prorated CapEx if applicable). |
| `net_ai_value` | `numeric` | | `Total Benefits - Total Costs`. |
| `monthly_roi` | `numeric` | | ROI percentage for the specific month. |
| `cumulative_net_value` | `numeric` | | Running total of Net AI Value. |
| `cumulative_roi` | `numeric` | | Cumulative ROI percentage over the timeline. |
| `cumulative_costs` | `numeric` | | Running total of costs. |

## 2. TypeScript Interfaces

The frontend uses TypeScript interfaces that mirror these database structures, typically generated or defined in `src/integrations/supabase/types.ts`.

### Key Types

**`RoiSettings`**
Matches the fields in the `roi_settings` table. Used in `Settings.tsx` form handling.

**`RoiCalculation`**
Matches the fields in the `roi_calculations` table. Used in `Dashboard.tsx` and `ChatChart.tsx` for visualizations.

## 3. Relationships

- **Single Record Configuration**: The `roi_settings` table is designed to hold a single "active" configuration row (or one per tenant in a multi-tenant scenario), which drives the parameters for calculations.
- **Time-Series Data**: `roi_calculations` represents a time-series derived from the `roi_settings` and dynamic inputs like `active_users`.
