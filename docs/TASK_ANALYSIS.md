# Task Analysis and User Workflows

This document breaks down the user tasks supported by the application, analyzing the workflow, goals, and interactions for each.

## 1. User Roles

- **Administrator / AI Lead**: Responsible for configuring the system, setting global parameters, and monitoring overall adoption.
- **Financial Stakeholder (CFO)**: Interested in the bottom line, ROI verification, and hard savings.
- **Operational Manager**: Focused on project delivery rates and team efficiency.

## 2. Core Task Flows

### 2.1 Configuring System Settings
**Goal:** Establish the baseline constraints and assumptions for the ROI model.
**User Role:** Administrator

**Workflow:**
1.  Navigate to the **Settings** page via the sidebar.
2.  **General Parameters:**
    - Input `Average Hourly Rate` and `Average Hourly Cost`.
    - Define expected `Hours Saved per User/Week`.
3.  **Investment & Costs:**
    - Enter `Monthly License Costs` (OpEx).
    - Enter one-time `Implementation Cost` and `Training Budget` (CapEx).
4.  **Risk Calibration:**
    - Adjust the `Efficiency Factor (η)` slider (e.g., 0.55).
    - Adjust the `Attribution Factor (α)` slider (e.g., 0.30).
5.  **Save:** Click "Save Configuration" to update the global state (`roi_settings` table).

### 2.2 Monitoring Executive Dashboard
**Goal:** Get a high-level view of the AI initiative's health and economic impact.
**User Role:** All Roles

**Workflow:**
1.  Navigate to the **Dashboard** (Home).
2.  **Quick Scan:** Review Top Cards for `Net AI Value`, `ROI`, `Payback Period`, and `Active Users`.
3.  **Trend Analysis:**
    - View the **Net AI Value Trend** chart to see the projection vs. actuals over time.
    - View the **Cost vs. Benefit** chart to understand the break-even trajectory.
4.  **Adoption Check:**
    - Review the **Adoption Heatmap** to see usage intensity.
    - Check the **Activation Rate** gauge.

### 2.3 Analyzing ROI Details
**Goal:** Understand the "Why" behind the numbers (Audit Traceability).
**User Role:** Financial Stakeholder

**Workflow:**
1.  Navigate to the **ROI Analysis** page.
2.  **Calculator Interaction:**
    - Use the interactive sliders to perform "What-If" scenarios (e.g., "What if Adoption drops to 40%?").
    - Observe the real-time recalibration of the `Net Present Value (NPV)` and `ROI`.
3.  **Breakdown Review:**
    - Inspect the **Hard Savings** vs. **Recycled Time** breakdown.
    - Check the **Cost Avoidance** table for specific risk mitigation values.

### 2.4 Managing Projects
**Goal:** Track specific AI-driven projects and their delivery status.
**User Role:** Operational Manager

**Workflow:**
1.  Navigate to the **Projects** page.
2.  **Portfolio View:** View the list of active AI initiatives.
3.  **Status Check:** Identify projects "At Risk" or "Delayed".
4.  **Impact Correlation:**Correlate project success with the general `Delivery Rate` metric.

### 2.5 Handling Alerts
**Goal:** React to urgent issues that threaten ROI (e.g., cost spikes, adoption blocks).
**User Role:** Administrator

**Workflow:**
1.  Navigate to the **Active Alerts** page.
2.  **Triage:** Review the list of high-priority alerts (e.g., "API Usage Spike", "Low Activation").
3.  **Action:**
    - Acknowledge the alert.
    - Trigger a predefined action (e.g., "Send Training Reminder", "Optimize Token Usage").
