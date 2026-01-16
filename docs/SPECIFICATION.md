# Functional Specification and Measurement Framework

This document defines the functional requirements and the mathematical framework used for ROI calculation.

## 1. ROI Measurement Framework

The core functionality of the system is based on an adjusted-for-risk ROI model.

### 1.1 Key Formulas

#### **Net AI Value**
The total economic benefit derived from the AI initiative.
```math
Net AI Value = (Hard Savings + Net Revenue + Cost Avoidance) - Total Costs
```

#### **ROI Percentage**
The efficiency of the investment.
```math
ROI % = (Net AI Value / Total Costs) × 100
```

#### **Payback Period**
Time required to recover the initial investment.
```math
Payback Period (Months) = Total Costs / Average Monthly Net Benefit
```

### 1.2 Component Definitions

#### **A. Costs (Total Costs)**
- **Direct Costs (OpEx):** Monthly recurring costs (Licenses).
- **Implementation Costs (CapEx):** One-time setup and integration fees.
- **Training Costs (CapEx):** One-time value for training sessions.
- **Hidden Costs:** Productivity loss during the learning phase.
  - `Hidden Cost = Users * Learning Hours * Hourly Cost * Learning Penalty (20%)`

#### **B. Benefits**
- **Hard Savings (FTE Savings):** Direct reduction in hours spent on tasks.
  - `Gross Savings = Hours Saved/Week * 52 * Hourly Rate`
  - `Net Savings = Gross Savings * Efficiency Factor (η)`
- **Net Revenue (Revenue Uplift):** Additional income generated.
  - `Net Revenue = Gross Revenue Uplift * Attribution Factor (α)`
- **Cost Avoidance:** Indirect savings from risk mitigation.
  - Sum of: Downtime Reduction, Compliance Savings, Fraud Prevention, Rework Reduction.

### 1.3 Risk Adjustment Factors

To provide a realistic and conservative estimate, the system applies two major factors:

1.  **Efficiency Factor (η - Eta):**
    - Represents the percentage of "saved time" that translates into actual productive work.
    - **Range:** 0.45 (Month 1) to 0.85 (Mature state).
    - **Purpose:** Accounts for context switching, non-linear productivity, and time-wasting.

2.  **Attribution Factor (α - Alpha):**
    - The percentage of revenue growth that can be causally linked to AI.
    - **Range:** 0.20 (Conservative) to 0.50 (Optimistic).
    - **Purpose:** Isolates the AI impact from other market factors.

## 2. System Metrics

The dashboard monitors the following KPIs to validate the ROI model.

| Metric | Definition | Target (M3) | Frequency of Update |
| :--- | :--- | :--- | :--- |
| **Net AI Value** | Total net economic benefit. | > $0 | Monthly |
| **ROI Cumulative** | Total ROI over the project lifecycle. | Break-even | Monthly |
| **Activation Rate** | % of employees who completed training. | > 60% | Weekly |
| **AI MAU** | Monthly Active Users (>1 use/week). | > 50% | Weekly |
| **Power Users** | % of users with >5h usage/week. | > 5% | Monthly |
| **Delivery Rate** | % of projects delivered on time. | > 70% | Bi-weekly |

## 3. Data Sources (Simulated)

The prototype simulates integration with:
- **ERP:** For cost constraints.
- **Usage Logs:** For activity tracking (Token usage).
- **Jira/Linear:** For velocity and delivery tracking.
