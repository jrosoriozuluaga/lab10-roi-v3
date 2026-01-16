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

// Pre-generate data
export const employees = generateEmployees();
export const departmentStats = calculateDepartmentStats(employees);
export const monthlyMetrics = generateMonthlyMetrics();
export const projects = generateProjects();
export const alerts = generateAlerts();

// Helper to count critical alerts
export const criticalAlertCount = alerts.filter(a => a.severity === 'critical').length;
