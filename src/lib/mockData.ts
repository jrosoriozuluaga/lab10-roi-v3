import { faker } from '@faker-js/faker';

// Seed for consistent data
faker.seed(42);

// ============= Financial Settings (CFO View) =============

export const financialSettings = {
  totalInvestment: 250000,
  fiscalYearStart: '2026-01-01',
  amortizationMonths: 12,
  monthlyAmortized: 20833.33,
};

// NOTE: These mock exports are deprecated. All ROI data should come from roi_calculations table.
// Keeping for backward compatibility but values now align with roi_calculations.cumulative_roi.
export const cashFlowData = [
  { 
    month: 'Mes 0', 
    monthIndex: 0,
    cashOutflow: 250000, 
    amortizedCost: 0, 
    valueRealized: 0,
    cumulativeRoi: -100.0,
    cumulativeValue: 0,
    cumulativePaybackPct: 0,
    adoptionRate: 0,
    activeUsers: 0,
  },
  { 
    month: 'Mes 1', 
    monthIndex: 1,
    cashOutflow: 0, 
    amortizedCost: 20833.33, 
    valueRealized: 1730,
    cumulativeRoi: -91.7,
    cumulativeValue: 1730,
    cumulativePaybackPct: 0.7,
    adoptionRate: 15,
    activeUsers: 77,
  },
  { 
    month: 'Mes 2', 
    monthIndex: 2,
    cashOutflow: 0, 
    amortizedCost: 20833.33, 
    valueRealized: 6050,
    cumulativeRoi: -81.3,
    cumulativeValue: 7780,
    cumulativePaybackPct: 3.1,
    adoptionRate: 35,
    activeUsers: 179,
  },
  { 
    month: 'Mes 3', 
    monthIndex: 3,
    cashOutflow: 0, 
    amortizedCost: 20833.33, 
    valueRealized: 18250,
    cumulativeRoi: -68.7,
    cumulativeValue: 26030,
    cumulativePaybackPct: 10.4,
    adoptionRate: 57,
    activeUsers: 292,
  },
];

// Simple ROI data for CEO/General views (cumulative ROI - J-curve)
export const roiTrendData = cashFlowData.map(d => ({
  month: d.month,
  roi: d.cumulativeRoi,
}));

// ============= API & Infrastructure Consumption =============

export interface APIConsumption {
  provider: string;
  service: string;
  usage: number;
  unit: string;
  cost: number;
  trend: 'up' | 'down' | 'stable';
  trendPercent: number;
}

export interface CloudService {
  name: string;
  usage: string;
  cost: number;
  status: 'healthy' | 'warning' | 'critical';
}

export interface CloudInfrastructure {
  provider: 'AWS' | 'GCP' | 'Azure';
  services: CloudService[];
  totalCost: number;
  monthlyBudget: number;
}

export const apiConsumption: APIConsumption[] = [
  { provider: 'OpenAI', service: 'GPT-4 Turbo', usage: 2450000, unit: 'tokens', cost: 4850, trend: 'up', trendPercent: 15 },
  { provider: 'OpenAI', service: 'GPT-3.5', usage: 8200000, unit: 'tokens', cost: 1640, trend: 'down', trendPercent: 8 },
  { provider: 'OpenAI', service: 'Embeddings', usage: 12500000, unit: 'tokens', cost: 125, trend: 'stable', trendPercent: 2 },
  { provider: 'Anthropic', service: 'Claude 3', usage: 890000, unit: 'tokens', cost: 2670, trend: 'up', trendPercent: 25 },
  { provider: 'Google', service: 'Gemini Pro', usage: 1200000, unit: 'tokens', cost: 960, trend: 'up', trendPercent: 18 },
];

export const cloudInfrastructure: CloudInfrastructure = {
  provider: 'AWS',
  services: [
    { name: 'EC2 (Compute)', usage: '24 instancias', cost: 3200, status: 'healthy' },
    { name: 'Lambda', usage: '1.2M invocaciones', cost: 180, status: 'healthy' },
    { name: 'S3 (Storage)', usage: '850 GB', cost: 45, status: 'healthy' },
    { name: 'RDS (Database)', usage: '2 instancias', cost: 890, status: 'warning' },
    { name: 'SageMaker', usage: '8 endpoints', cost: 2400, status: 'healthy' },
    { name: 'CloudWatch', usage: 'Logs + Metrics', cost: 120, status: 'healthy' },
  ],
  totalCost: 6835,
  monthlyBudget: 8000,
};

export const infrastructureTrend = [
  { month: 'Ene', api: 7200, cloud: 5800, total: 13000 },
  { month: 'Feb', api: 8100, cloud: 6100, total: 14200 },
  { month: 'Mar', api: 10245, cloud: 6835, total: 17080 },
];

export const aiToolsDistribution = [
  { name: 'GPT-4 Turbo', value: 45, fill: 'hsl(var(--chart-1))' },
  { name: 'GPT-3.5', value: 30, fill: 'hsl(var(--chart-2))' },
  { name: 'Claude 3', value: 15, fill: 'hsl(var(--chart-3))' },
  { name: 'Gemini Pro', value: 10, fill: 'hsl(var(--chart-4))' },
];

// Total API cost calculation
export const totalAPICost = apiConsumption.reduce((sum, api) => sum + api.cost, 0);
export const totalInfraCost = cloudInfrastructure.totalCost;
export const totalMonthlyBudget = 20000;
export const budgetUtilization = ((totalAPICost + totalInfraCost) / totalMonthlyBudget) * 100;

// ============= Employee & Department Types =============

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
  // J-Curve data for 12 months (2026) - Investment → Break-even → Growth
  const jCurveData: MonthlyMetric[] = [
    // Investment Phase (Months 1-3): Negative values
    { month: 'Ene', netAIValue: -45000, roi: -78, activationRate: 15, mauRate: 25, powerUsersRate: 2 },
    { month: 'Feb', netAIValue: -28000, roi: -52, activationRate: 22, mauRate: 31, powerUsersRate: 4 },
    { month: 'Mar', netAIValue: -12000, roi: -25, activationRate: 29, mauRate: 37, powerUsersRate: 6 },
    // Break-even (Month 4)
    { month: 'Abr', netAIValue: 2000, roi: 3, activationRate: 36, mauRate: 43, powerUsersRate: 8 },
    // Growth Phase (Months 5-12): Exponential growth
    { month: 'May', netAIValue: 18000, roi: 15, activationRate: 43, mauRate: 49, powerUsersRate: 10 },
    { month: 'Jun', netAIValue: 35000, roi: 28, activationRate: 50, mauRate: 55, powerUsersRate: 12 },
    { month: 'Jul', netAIValue: 52000, roi: 42, activationRate: 57, mauRate: 61, powerUsersRate: 14 },
    { month: 'Ago', netAIValue: 72000, roi: 58, activationRate: 64, mauRate: 67, powerUsersRate: 16 },
    { month: 'Sep', netAIValue: 95000, roi: 76, activationRate: 71, mauRate: 73, powerUsersRate: 18 },
    { month: 'Oct', netAIValue: 115000, roi: 92, activationRate: 78, mauRate: 79, powerUsersRate: 20 },
    { month: 'Nov', netAIValue: 135000, roi: 108, activationRate: 85, mauRate: 85, powerUsersRate: 22 },
    { month: 'Dic', netAIValue: 158000, roi: 127, activationRate: 92, mauRate: 91, powerUsersRate: 24 },
  ];

  return jCurveData;
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
  hoursSavedPerWeek: 0.5,
  avgHourlyRate: 55,
  efficiencyFactor: 0.50,
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

// ============= AI Projects =============

export interface AIProject {
  id: string;
  name: string;
  description: string;
  owner: { name: string; avatar: string; department: Department };
  northStar: string;
  status: 'on-track' | 'at-risk' | 'off-track';
  impact: 'high' | 'medium' | 'low';
  currentROI: number;
  timeElapsed: string;
  budgetUsed: number;
  progress: number;
  team: { name: string; avatar: string }[];
  recentActivity: { action: string; date: Date }[];
  startDate: Date;
}

const projectTemplates = [
  { name: 'Automatización de Reportes Financieros', northStar: 'Ahorro de Costos', department: 'Finance' as Department },
  { name: 'Chatbot de Soporte al Cliente', northStar: 'Satisfacción del Cliente', department: 'Operations' as Department },
  { name: 'Predicción de Churn', northStar: 'Tasa de Retención', department: 'Sales' as Department },
  { name: 'Asistente de Ventas AI', northStar: 'Revenue Lift', department: 'Sales' as Department },
  { name: 'Análisis de Contratos Legal', northStar: 'Reducción de Riesgo', department: 'Legal' as Department },
  { name: 'Optimización de Campañas Marketing', northStar: 'ROAS', department: 'Marketing' as Department },
  { name: 'Automatización de Onboarding HR', northStar: 'Time-to-Productivity', department: 'HR' as Department },
  { name: 'Detección de Anomalías en Producción', northStar: 'Uptime', department: 'Engineering' as Department },
  { name: 'Generación de Contenido Marketing', northStar: 'Engagement Rate', department: 'Marketing' as Department },
  { name: 'Asistente de Código AI', northStar: 'Velocidad de Desarrollo', department: 'Engineering' as Department },
];

export function generateProjects(): AIProject[] {
  // Ensure specific statuses: 2 at-risk, 1 off-track, rest on-track
  const statuses: ('on-track' | 'at-risk' | 'off-track')[] = [
    'on-track', 'at-risk', 'off-track', 'on-track', 'at-risk', 
    'on-track', 'on-track', 'on-track', 'on-track', 'on-track'
  ];

  return projectTemplates.map((template, index) => {
    const status = statuses[index];
    const weeksAgo = faker.number.int({ min: 2, max: 16 });
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (weeksAgo * 7));

    // Generate progress and ROI based on status
    let progress: number, currentROI: number, budgetUsed: number;
    
    if (status === 'on-track') {
      progress = faker.number.int({ min: 40, max: 85 });
      currentROI = faker.number.int({ min: 15, max: 120 });
      budgetUsed = faker.number.int({ min: 30, max: 70 });
    } else if (status === 'at-risk') {
      progress = faker.number.int({ min: 25, max: 50 });
      currentROI = faker.number.int({ min: -10, max: 25 });
      budgetUsed = faker.number.int({ min: 60, max: 85 });
    } else {
      progress = faker.number.int({ min: 10, max: 30 });
      currentROI = faker.number.int({ min: -40, max: 0 });
      budgetUsed = faker.number.int({ min: 80, max: 100 });
    }

    const teamSize = faker.number.int({ min: 2, max: 6 });
    const team = Array.from({ length: teamSize }, () => ({
      name: faker.person.fullName(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${faker.string.alphanumeric(8)}`,
    }));

    const activityCount = faker.number.int({ min: 3, max: 6 });
    const activities = [
      'Despliegue V2 completado',
      'Testing QA finalizado',
      'Revisión de stakeholders',
      'Integración API completada',
      'Sprint planning realizado',
      'Demo al equipo ejecutivo',
      'Ajuste de modelo ML',
      'Migración de datos exitosa',
    ];
    
    const recentActivity = faker.helpers.arrayElements(activities, activityCount).map((action, i) => ({
      action,
      date: faker.date.recent({ days: 7 + i * 5 }),
    })).sort((a, b) => b.date.getTime() - a.date.getTime());

    return {
      id: faker.string.uuid(),
      name: template.name,
      description: faker.company.catchPhrase(),
      owner: {
        name: faker.person.fullName(),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${faker.string.alphanumeric(8)}`,
        department: template.department,
      },
      northStar: template.northStar,
      status,
      impact: faker.helpers.arrayElement(['high', 'medium', 'low']) as 'high' | 'medium' | 'low',
      currentROI,
      timeElapsed: `${weeksAgo} semanas`,
      budgetUsed,
      progress,
      team,
      recentActivity,
      startDate,
    };
  });
}

// ============= System Alerts =============

export interface SystemAlert {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'opportunity';
  department?: Department;
  project?: string;
  metric?: string;
  value?: string;
  threshold?: string;
  createdAt: Date;
  isActionable: boolean;
}

const alertTemplates: Omit<SystemAlert, 'id' | 'createdAt'>[] = [
  // Critical
  { title: 'Costo de Tokens > Presupuesto', description: 'El gasto en API de OpenAI ha superado el presupuesto mensual en un 23%. Se requiere revisión inmediata.', severity: 'critical', metric: 'Token Spend', value: '$15,300', threshold: '$12,000', isActionable: true },
  { title: 'Proyecto Predicción de Churn Off-Track', description: 'El proyecto ha excedido el timeline en 4 semanas y el ROI proyectado es negativo.', severity: 'critical', project: 'Predicción de Churn', isActionable: true },
  { title: 'Seguridad: Acceso no autorizado detectado', description: 'Se detectaron 3 intentos de acceso a la API desde IPs no autorizadas.', severity: 'critical', isActionable: true },
  // Warning
  { title: 'Adopción Baja en Legal', description: 'El departamento Legal tiene solo 20% de activación, muy por debajo del objetivo del 40%.', severity: 'warning', department: 'Legal', metric: 'Activation Rate', value: '20%', threshold: '40%', isActionable: true },
  { title: 'Licencias sin uso detectadas', description: '45 licencias de Copilot no han sido utilizadas en los últimos 30 días.', severity: 'warning', metric: 'License Usage', value: '45 unused', isActionable: true },
  { title: 'HR por debajo del benchmark', description: 'El equipo de HR tiene una tasa MAU del 28%, 22 puntos por debajo del target.', severity: 'warning', department: 'HR', metric: 'MAU Rate', value: '28%', threshold: '50%', isActionable: true },
  { title: 'Latencia elevada en API interna', description: 'El tiempo de respuesta promedio ha aumentado a 2.3 segundos.', severity: 'warning', metric: 'API Latency', value: '2.3s', threshold: '1s', isActionable: true },
  // Opportunity
  { title: 'Equipo Marketing listo para fase 2', description: 'Marketing ha alcanzado 85% de adopción. Considerar expansión de herramientas.', severity: 'opportunity', department: 'Marketing', isActionable: true },
  { title: 'ROI positivo en Asistente de Ventas', description: 'El proyecto ha alcanzado ROI del +67% en solo 8 semanas. Considerar escalar.', severity: 'opportunity', project: 'Asistente de Ventas AI', metric: 'ROI', value: '+67%', isActionable: true },
  { title: 'Power Users identificados en Engineering', description: '28 empleados en Engineering califican como Power Users. Potencial para programa de embajadores.', severity: 'opportunity', department: 'Engineering', isActionable: true },
  { title: 'Nuevo modelo GPT-4 Turbo disponible', description: 'OpenAI lanzó GPT-4 Turbo con 3x mejor rendimiento. Evaluar migración.', severity: 'opportunity', isActionable: false },
];

export function generateAlerts(): SystemAlert[] {
  return alertTemplates.map(template => ({
    ...template,
    id: faker.string.uuid(),
    createdAt: faker.date.recent({ days: 14 }),
  })).sort((a, b) => {
    // Sort by severity priority, then by date
    const severityOrder = { critical: 0, warning: 1, opportunity: 2 };
    if (severityOrder[a.severity] !== severityOrder[b.severity]) {
      return severityOrder[a.severity] - severityOrder[b.severity];
    }
    return b.createdAt.getTime() - a.createdAt.getTime();
  });
}

// ============= Data Integrations =============

export interface DataIntegration {
  id: string;
  name: string;
  category: string;
  description: string;
  status: 'connected' | 'syncing' | 'stale';
  lastSync?: Date;
  dataTypes: string[];
  icon: 'users' | 'workflow' | 'code' | 'briefcase' | 'clipboard';
}

export const integrations: DataIntegration[] = [
  {
    id: 'hris-workday',
    name: 'Workday',
    category: 'HRIS',
    description: 'Sistema de gestión de recursos humanos',
    status: 'connected',
    dataTypes: ['Headcount', 'Roles', 'Departamentos'],
    icon: 'users',
  },
  {
    id: 'automation-n8n',
    name: 'n8n',
    category: 'Automation',
    description: 'Plataforma de automatización de workflows',
    status: 'connected',
    dataTypes: ['Workflow Executions', 'Success Rate'],
    icon: 'workflow',
  },
  {
    id: 'coding-github',
    name: 'Cursor / GitHub',
    category: 'Coding',
    description: 'Métricas de uso de herramientas de desarrollo',
    status: 'connected',
    dataTypes: ['Usage Metrics', 'Lines of Code', 'Completions'],
    icon: 'code',
  },
  {
    id: 'crm-salesforce',
    name: 'Salesforce',
    category: 'CRM',
    description: 'Sistema de gestión de relaciones con clientes',
    status: 'syncing',
    dataTypes: ['Revenue Attribution', 'Deal Velocity'],
    icon: 'briefcase',
  },
  {
    id: 'surveys-typeform',
    name: 'Typeform',
    category: 'Surveys',
    description: 'Encuestas de satisfacción y feedback',
    status: 'stale',
    lastSync: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    dataTypes: ['NPS', 'Satisfaction Score'],
    icon: 'clipboard',
  },
];

// Pre-generate data
export const employees = generateEmployees();
export const departmentStats = calculateDepartmentStats(employees);
export const monthlyMetrics = generateMonthlyMetrics();
export const projects = generateProjects();
export const alerts = generateAlerts();

// Helper to count critical alerts
export const criticalAlertCount = alerts.filter(a => a.severity === 'critical').length;
