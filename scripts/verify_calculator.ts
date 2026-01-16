
import { calculateROI, settingsToInputs, ROIInputs } from '../src/lib/roiCalculations';

// Mock settings to create base inputs
const mockSettings = {
    id: 'test',
    efficiency_factor: 0.55,
    attribution_factor: 0.30,
    avg_hourly_rate: 45,
    avg_hourly_cost: 35,
    hours_saved_per_user_week: 2.5,
    learning_curve_penalty: 0.20,
    monthly_licenses: 8500,
    implementation_cost: 15000,
    training_budget: 12000,
    learning_curve_hours: 20,
    monthly_revenue_uplift: 25000,
    license_savings: 2000,
    outsourcing_reduction: 3500,
    downtime_reduction: 1500,
    compliance_savings: 800,
    fraud_prevention: 500,
    rework_reduction: 1200,
};

const baseInputs = settingsToInputs(mockSettings as any, 292);

console.log('--- STARTING CALCULATOR VERIFICATION ---\n');

// Test Case 1: Manual Verification of a simple flow
console.log('Test 1: Base Realistic Scenario');
const result = calculateROI(baseInputs);

// Expected calculations based on logic:
// Hard Savings = (292 * 2.5 * 52 * 45 * 0.55) + (2000 * 12) + (3500 * 12)
//              = (37960 * 45 * 0.55) + 24000 + 42000
//              = (1,708,200 * 0.55) + 66000
//              = 939,510 + 66000 = 1,005,510
const expectedHardSavings = 1005510;

// Costs = (8500 * 12) + (15000 + 12000) + HiddenCosts
// Hidden = 292 * 20 * 35 * 0.20 = 40,880
// Annualized = 102,000 + 27,000 + 40,880 = 169,880
const expectedAnnualizedCosts = 169880;

console.log(`Expected Hard Savings: ~${expectedHardSavings}`);
console.log(`Actual Hard Savings:   ${Math.round(result.totalHardSavings)}`);
console.log(`Diff: ${Math.abs(expectedHardSavings - result.totalHardSavings)}`);

if (Math.abs(expectedHardSavings - result.totalHardSavings) < 5) {
    console.log('✅ Hard Savings Calculation is CORRECT');
} else {
    console.error('❌ Hard Savings Calculation MISMATCH');
}

if (Math.abs(expectedAnnualizedCosts - result.annualizedCosts) < 5) {
    console.log('✅ Annualized Costs Calculation is CORRECT');
} else {
    console.error('❌ Annualized Costs Calculation MISMATCH');
}


// Test Case 2: Zero Inputs (Edge Case)
console.log('\nTest 2: Zero Inputs (Edge Case)');
const zeroInputs: ROIInputs = {
    ...baseInputs,
    numberOfUsers: 0,
    monthlyLicenses: 0,
    implementationCost: 0,
    trainingBudget: 0,
    // Zero out benefits too to ensure 0 ROI
    monthlyRevenueUplift: 0,
    licenseSavings: 0,
    outsourcingReduction: 0,
    downtimeReduction: 0,
    complianceSavings: 0,
    fraudPrevention: 0,
    reworkReduction: 0,
    hoursSavedPerWeek: 0
};
const zeroResult = calculateROI(zeroInputs);

if (zeroResult.netAIValue === 0 && zeroResult.roi === 0) {
    console.log('✅ Zero Input correctly results in 0 ROI');
} else {
    console.error(`❌ Zero Input failed. NetValue: ${zeroResult.netAIValue}, ROI: ${zeroResult.roi}`);
}

console.log('\n--- VERIFICATION COMPLETE ---');
