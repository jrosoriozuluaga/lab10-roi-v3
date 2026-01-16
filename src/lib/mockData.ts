import { faker } from '@faker-js/faker';

// Seed for consistent data
faker.seed(42);

export type Department = 'Engineering' | 'Sales' | 'Operations' | 'Marketing' | 'Finance' | 'HR' | 'Legal';

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: Department;
  role: string;
  isActive: boolean;
  weeklyAIHours: number;
  toolsUsed: string[];
  joinedAI: Date;
  lastActive: Date;
}

export interface DepartmentStats {
  name: Department;
  totalUsers: number;
  activeUsers: number;
  activationRate: number;
  mauRate: number;
  powerUsers: number;
  avgWeeklyHours: number;
  status: 'on-track' | 'at-risk' | 'critical';
}

export interface MonthlyMetric {
  month: string;
  activationRate: number;
  mauRate: number;
  powerUsersRate: number;
  netAIValue: number;
  roi: number;
}

const departments: Department[] = ['Engineering', 'Sales', 'Operations', 'Marketing', 'Finance', 'HR', 'Legal'];

const departmentDistribution: Record<Department, number> = {
  'Engineering': 120,
  'Sales': 100,
  'Operations': 90,
  'Marketing': 70,
  'Finance': 50,
  'HR': 40,
  'Legal': 30,
};

const aiTools = ['n8n', 'Cursor', 'Gemini', 'ChatGPT', 'Copilot'];

// Base adoption rates by department (higher for tech teams)
const baseAdoptionRates: Record<Department, number> = {
  'Engineering': 0.65,
  'Sales': 0.45,
  'Operations': 0.35,
  'Marketing': 0.50,
  'Finance': 0.30,
  'HR': 0.25,
  'Legal': 0.20,
};

export function generateEmployees(): Employee[] {
  const employees: Employee[] = [];
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  for (const [dept, count] of Object.entries(departmentDistribution)) {
    const department = dept as Department;
    const adoptionRate = baseAdoptionRates[department];

    for (let i = 0; i < count; i++) {
      const isActive = Math.random() < adoptionRate;
      const isPowerUser = isActive && Math.random() < 0.15;
      
      employees.push({
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        department,
        role: faker.person.jobTitle(),
        isActive,
        weeklyAIHours: isActive 
          ? isPowerUser 
            ? faker.number.float({ min: 8, max: 20, fractionDigits: 1 })
            : faker.number.float({ min: 1, max: 8, fractionDigits: 1 })
          : 0,
        toolsUsed: isActive 
          ? faker.helpers.arrayElements(aiTools, { min: isPowerUser ? 2 : 1, max: isPowerUser ? 4 : 2 })
          : [],
        joinedAI: isActive 
          ? faker.date.between({ from: threeMonthsAgo, to: new Date() })
          : threeMonthsAgo,
        lastActive: isActive
          ? faker.date.recent({ days: 7 })
          : faker.date.past({ years: 0.25 }),
      });
    }
  }

  return employees;
}

export function calculateDepartmentStats(employees: Employee[]): DepartmentStats[] {
  return departments.map(dept => {
    const deptEmployees = employees.filter(e => e.department === dept);
    const totalUsers = deptEmployees.length;
    const activeUsers = deptEmployees.filter(e => e.isActive).length;
    const recentActive = deptEmployees.filter(e => {
      const daysSinceActive = (Date.now() - e.lastActive.getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceActive <= 30;
    }).length;
    const powerUsers = deptEmployees.filter(e => e.weeklyAIHours >= 8 && e.toolsUsed.length >= 2).length;
    
    const activationRate = (activeUsers / totalUsers) * 100;
    const mauRate = (recentActive / totalUsers) * 100;
    const avgWeeklyHours = activeUsers > 0 
      ? deptEmployees.reduce((sum, e) => sum + e.weeklyAIHours, 0) / activeUsers
      : 0;

    let status: 'on-track' | 'at-risk' | 'critical' = 'on-track';
    if (activationRate < 25) status = 'critical';
    else if (activationRate < 40) status = 'at-risk';

    return {
      name: dept,
      totalUsers,
      activeUsers,
      activationRate,
      mauRate,
      powerUsers,
      avgWeeklyHours,
      status,
    };
  });
}

export function generateMonthlyMetrics(): MonthlyMetric[] {
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const currentMonth = new Date().getMonth();
  
  // We're at Month 3, so show realistic growth from Month 0
  return months.slice(0, currentMonth + 1).map((month, index) => {
    // Gradual growth curve
    const progress = index / 12;
    const baseActivation = 10 + (progress * 55);
    const baseMau = 20 + (progress * 50);
    const basePowerUsers = 1 + (progress * 17);
    
    // ROI starts negative and trends positive
    const baseROI = -80 + (progress * 180);
    const netValue = -50000 + (progress * 150000);

    return {
      month,
      activationRate: Math.min(baseActivation + faker.number.float({ min: -5, max: 5 }), 100),
      mauRate: Math.min(baseMau + faker.number.float({ min: -5, max: 5 }), 100),
      powerUsersRate: Math.min(basePowerUsers + faker.number.float({ min: -2, max: 2 }), 25),
      netAIValue: netValue + faker.number.int({ min: -5000, max: 5000 }),
      roi: baseROI + faker.number.float({ min: -10, max: 10 }),
    };
  });
}

// ROI Calculator defaults (Month 3 scenario)
export const defaultROIInputs = {
  // Costs
  monthlyLicenses: 12000,
  implementationCost: 50000,
  trainingBudget: 15000,
  learningCurveHours: 8,
  avgHourlyCost: 45,
  numberOfUsers: 500,
  
  // Savings
  hoursSavedPerWeek: 3,
  avgHourlyRate: 55,
  efficiencyFactor: 0.55,
  licenseSavings: 3000,
  outsourcingReduction: 5000,
  
  // Revenue
  monthlyRevenueUplift: 25000,
  attributionFactor: 0.25,
  
  // Cost Avoidance
  downtimeReduction: 2000,
  complianceSavings: 1500,
  fraudPrevention: 3000,
  reworkReduction: 4000,
};

// Benchmarks for Month 3
export const m3Benchmarks = {
  activationRate: { min: 35, max: 45, target: 40 },
  mauRate: { min: 50, max: 60, target: 55 },
  powerUsers: { min: 4, max: 6, target: 5 },
  deliveryRate: { min: 40, max: 55, target: 48 },
  paybackMonths: { target: 12, warning: 18 },
};

// Pre-generate data
export const employees = generateEmployees();
export const departmentStats = calculateDepartmentStats(employees);
export const monthlyMetrics = generateMonthlyMetrics();
