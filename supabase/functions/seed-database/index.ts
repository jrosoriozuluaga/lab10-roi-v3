import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Employee {
  name: string;
  email: string;
  department: string;
  role: string;
  usage_level: string;
  weekly_ai_hours: number;
  last_active: string | null;
}

interface Project {
  name: string;
  owner: string;
  status: string;
  north_star: string;
  department: string;
  budget_allocated: number;
  budget_spent: number;
  roi_percent: number;
  impact_level: string;
}

// Spanish names for realistic data
const firstNames = [
  'Carlos', 'María', 'Juan', 'Ana', 'Pedro', 'Laura', 'Miguel', 'Carmen', 'José', 'Sofia',
  'David', 'Elena', 'Fernando', 'Isabel', 'Rafael', 'Patricia', 'Antonio', 'Lucia', 'Manuel', 'Marta',
  'Alejandro', 'Paula', 'Diego', 'Andrea', 'Javier', 'Sara', 'Pablo', 'Cristina', 'Roberto', 'Natalia',
  'Daniel', 'Victoria', 'Sergio', 'Claudia', 'Alberto', 'Monica', 'Raul', 'Teresa', 'Luis', 'Beatriz',
  'Francisco', 'Rosa', 'Guillermo', 'Adriana', 'Eduardo', 'Silvia', 'Andres', 'Marina', 'Gabriel', 'Irene'
];

const lastNames = [
  'García', 'Rodríguez', 'Martínez', 'López', 'González', 'Hernández', 'Pérez', 'Sánchez', 'Ramírez', 'Torres',
  'Flores', 'Rivera', 'Gómez', 'Díaz', 'Vargas', 'Castro', 'Morales', 'Ortiz', 'Ruiz', 'Jiménez',
  'Álvarez', 'Romero', 'Molina', 'Navarro', 'Domínguez', 'Moreno', 'Muñoz', 'Gutiérrez', 'Alonso', 'Suárez'
];

const departmentRoles: Record<string, string[]> = {
  Engineering: ['Software Engineer', 'Senior Engineer', 'Tech Lead', 'DevOps Engineer', 'QA Engineer', 'Frontend Developer', 'Backend Developer', 'Data Engineer'],
  Operations: ['Operations Manager', 'Process Analyst', 'Supply Chain Specialist', 'Logistics Coordinator', 'Quality Analyst', 'Operations Associate'],
  Sales: ['Account Executive', 'Sales Rep', 'Sales Manager', 'Business Development', 'Sales Analyst', 'Customer Success Manager'],
  Marketing: ['Marketing Manager', 'Content Strategist', 'Digital Marketing Specialist', 'Brand Manager', 'Growth Manager', 'Marketing Analyst'],
  Finance: ['Financial Analyst', 'Controller', 'Accountant', 'Treasury Analyst', 'FP&A Analyst', 'Finance Manager'],
  HR: ['HR Manager', 'Recruiter', 'HR Business Partner', 'Training Specialist', 'Compensation Analyst', 'HR Coordinator'],
  Legal: ['Legal Counsel', 'Contract Specialist', 'Paralegal', 'Compliance Officer', 'Legal Analyst']
};

// Department distribution for 512 employees to achieve 57% adoption
const departmentConfig = [
  { name: 'Engineering', total: 120, activeRate: 0.80, powerRate: 0.15, highRate: 0.40, mediumRate: 0.25 },
  { name: 'Operations', total: 95, activeRate: 0.65, powerRate: 0.08, highRate: 0.31, mediumRate: 0.26 },
  { name: 'Sales', total: 90, activeRate: 0.60, powerRate: 0.07, highRate: 0.27, mediumRate: 0.27 },
  { name: 'Marketing', total: 72, activeRate: 0.60, powerRate: 0.07, highRate: 0.28, mediumRate: 0.25 },
  { name: 'Finance', total: 55, activeRate: 0.40, powerRate: 0.04, highRate: 0.18, mediumRate: 0.18 },
  { name: 'HR', total: 45, activeRate: 0.25, powerRate: 0.02, highRate: 0.11, mediumRate: 0.11 },
  { name: 'Legal', total: 35, activeRate: 0.12, powerRate: 0.00, highRate: 0.06, mediumRate: 0.06 }
];

function getRandomName(): { first: string; last: string } {
  const first = firstNames[Math.floor(Math.random() * firstNames.length)];
  const last = lastNames[Math.floor(Math.random() * lastNames.length)];
  return { first, last };
}

function generateEmail(first: string, last: string, index: number): string {
  return `${first.toLowerCase()}.${last.toLowerCase()}${index}@company.com`;
}

function getRandomRole(department: string): string {
  const roles = departmentRoles[department] || ['Associate'];
  return roles[Math.floor(Math.random() * roles.length)];
}

function getRandomDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date.toISOString().split('T')[0];
}

function generateEmployees(): Employee[] {
  const employees: Employee[] = [];
  let employeeIndex = 0;

  for (const dept of departmentConfig) {
    const activeCount = Math.floor(dept.total * dept.activeRate);
    const powerCount = Math.floor(dept.total * dept.powerRate);
    const highCount = Math.floor(dept.total * dept.highRate);
    const mediumCount = Math.floor(dept.total * dept.mediumRate);
    const lowCount = activeCount - powerCount - highCount - mediumCount;
    const inactiveCount = dept.total - activeCount;

    // Power users
    for (let i = 0; i < powerCount; i++) {
      const { first, last } = getRandomName();
      employees.push({
        name: `${first} ${last}`,
        email: generateEmail(first, last, employeeIndex++),
        department: dept.name,
        role: getRandomRole(dept.name),
        usage_level: 'power',
        weekly_ai_hours: 15 + Math.floor(Math.random() * 10),
        last_active: getRandomDate(3),
      });
    }

    // High users
    for (let i = 0; i < highCount; i++) {
      const { first, last } = getRandomName();
      employees.push({
        name: `${first} ${last}`,
        email: generateEmail(first, last, employeeIndex++),
        department: dept.name,
        role: getRandomRole(dept.name),
        usage_level: 'high',
        weekly_ai_hours: 8 + Math.floor(Math.random() * 7),
        last_active: getRandomDate(5),
      });
    }

    // Medium users
    for (let i = 0; i < mediumCount; i++) {
      const { first, last } = getRandomName();
      employees.push({
        name: `${first} ${last}`,
        email: generateEmail(first, last, employeeIndex++),
        department: dept.name,
        role: getRandomRole(dept.name),
        usage_level: 'medium',
        weekly_ai_hours: 4 + Math.floor(Math.random() * 4),
        last_active: getRandomDate(7),
      });
    }

    // Low users
    for (let i = 0; i < lowCount; i++) {
      const { first, last } = getRandomName();
      employees.push({
        name: `${first} ${last}`,
        email: generateEmail(first, last, employeeIndex++),
        department: dept.name,
        role: getRandomRole(dept.name),
        usage_level: 'low',
        weekly_ai_hours: 1 + Math.floor(Math.random() * 3),
        last_active: getRandomDate(14),
      });
    }

    // Inactive users
    for (let i = 0; i < inactiveCount; i++) {
      const { first, last } = getRandomName();
      employees.push({
        name: `${first} ${last}`,
        email: generateEmail(first, last, employeeIndex++),
        department: dept.name,
        role: getRandomRole(dept.name),
        usage_level: 'inactive',
        weekly_ai_hours: 0,
        last_active: Math.random() > 0.5 ? getRandomDate(60) : null,
      });
    }
  }

  return employees;
}

// New projects to add (22 new ones to reach 27 total)
const newProjects: Project[] = [
  { name: 'DevOps Pipeline Automation', owner: 'Ricardo Vega', status: 'on-track', north_star: 'Deploy time -50%', department: 'Engineering', budget_allocated: 45000, budget_spent: 28000, roi_percent: 32, impact_level: 'high' },
  { name: 'Bug Prediction System', owner: 'Andrea Torres', status: 'on-track', north_star: 'Reduce bugs 25%', department: 'Engineering', budget_allocated: 35000, budget_spent: 20000, roi_percent: 18, impact_level: 'medium' },
  { name: 'Code Review Assistant', owner: 'Miguel Sánchez', status: 'at-risk', north_star: 'Review time -40%', department: 'Engineering', budget_allocated: 40000, budget_spent: 38000, roi_percent: -8, impact_level: 'high' },
  { name: 'Lead Scoring AI', owner: 'Laura Mendez', status: 'on-track', north_star: 'Conversion +15%', department: 'Sales', budget_allocated: 50000, budget_spent: 35000, roi_percent: 45, impact_level: 'high' },
  { name: 'Sales Forecast Model', owner: 'Carlos Ruiz', status: 'on-track', north_star: 'Accuracy >90%', department: 'Sales', budget_allocated: 30000, budget_spent: 22000, roi_percent: 28, impact_level: 'medium' },
  { name: 'Customer Sentiment Analysis', owner: 'Sofia García', status: 'on-track', north_star: 'NPS insight real-time', department: 'Sales', budget_allocated: 25000, budget_spent: 18000, roi_percent: 22, impact_level: 'medium' },
  { name: 'Contract Risk Assessment', owner: 'Daniel Moreno', status: 'at-risk', north_star: 'Risk detection +60%', department: 'Legal', budget_allocated: 55000, budget_spent: 52000, roi_percent: -5, impact_level: 'high' },
  { name: 'Process Mining Automation', owner: 'Patricia Flores', status: 'on-track', north_star: 'Efficiency +30%', department: 'Operations', budget_allocated: 38000, budget_spent: 25000, roi_percent: 25, impact_level: 'medium' },
  { name: 'Inventory Optimization', owner: 'Roberto Jiménez', status: 'on-track', north_star: 'Stock waste -20%', department: 'Operations', budget_allocated: 42000, budget_spent: 30000, roi_percent: 38, impact_level: 'high' },
  { name: 'Quality Control AI', owner: 'Elena Castro', status: 'on-track', north_star: 'Defect rate -35%', department: 'Operations', budget_allocated: 35000, budget_spent: 28000, roi_percent: 20, impact_level: 'medium' },
  { name: 'Social Media Monitoring', owner: 'Pablo Rivera', status: 'on-track', north_star: 'Response time -60%', department: 'Marketing', budget_allocated: 28000, budget_spent: 20000, roi_percent: 15, impact_level: 'medium' },
  { name: 'A/B Test Optimization', owner: 'Marta Gómez', status: 'on-track', north_star: 'Test velocity +100%', department: 'Marketing', budget_allocated: 32000, budget_spent: 22000, roi_percent: 42, impact_level: 'high' },
  { name: 'Content Personalization', owner: 'Diego Hernández', status: 'off-track', north_star: 'Engagement +25%', department: 'Marketing', budget_allocated: 45000, budget_spent: 48000, roi_percent: -15, impact_level: 'medium' },
  { name: 'Invoice Processing AI', owner: 'Isabel López', status: 'on-track', north_star: 'Processing time -70%', department: 'Finance', budget_allocated: 40000, budget_spent: 28000, roi_percent: 55, impact_level: 'high' },
  { name: 'Expense Categorization', owner: 'Fernando Ortiz', status: 'on-track', north_star: 'Accuracy >95%', department: 'Finance', budget_allocated: 20000, budget_spent: 15000, roi_percent: 12, impact_level: 'low' },
  { name: 'Talent Acquisition AI', owner: 'Carmen Díaz', status: 'on-track', north_star: 'Time-to-hire -30%', department: 'HR', budget_allocated: 35000, budget_spent: 25000, roi_percent: 28, impact_level: 'medium' },
  { name: 'Employee Analytics', owner: 'Javier Vargas', status: 'at-risk', north_star: 'Turnover prediction', department: 'HR', budget_allocated: 30000, budget_spent: 32000, roi_percent: -3, impact_level: 'low' },
  { name: 'Compliance Monitoring', owner: 'Rosa Martínez', status: 'on-track', north_star: 'Audit prep -50%', department: 'Legal', budget_allocated: 48000, budget_spent: 35000, roi_percent: 35, impact_level: 'high' },
  { name: 'Data Classification AI', owner: 'Alberto Navarro', status: 'on-track', north_star: 'PII detection >99%', department: 'Engineering', budget_allocated: 38000, budget_spent: 28000, roi_percent: 22, impact_level: 'medium' },
  { name: 'Predictive Maintenance', owner: 'Sergio Romero', status: 'on-track', north_star: 'Downtime -40%', department: 'Operations', budget_allocated: 55000, budget_spent: 40000, roi_percent: 48, impact_level: 'high' },
  { name: 'Email Response Assistant', owner: 'Lucia Alonso', status: 'on-track', north_star: 'Response time -50%', department: 'Sales', budget_allocated: 22000, budget_spent: 18000, roi_percent: 18, impact_level: 'low' },
  { name: 'Knowledge Base AI', owner: 'Monica Suárez', status: 'at-risk', north_star: 'Search relevance +40%', department: 'Operations', budget_allocated: 40000, budget_spent: 42000, roi_percent: -2, impact_level: 'medium' },
];

// Updates for existing 5 projects
const existingProjectUpdates = [
  { name: 'Predicción de Churn', department: 'Customer Success', budget_allocated: 60000, budget_spent: 45000 },
  { name: 'Automatización Legal', department: 'Legal', budget_allocated: 50000, budget_spent: 55000 },
  { name: 'AI Customer Support', department: 'Support', budget_allocated: 75000, budget_spent: 50000 },
  { name: 'Sales Forecasting', department: 'Sales', budget_allocated: 45000, budget_spent: 35000 },
  { name: 'HR Analytics', department: 'HR', budget_allocated: 35000, budget_spent: 28000 },
];

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 Starting database seeding...');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Seed employees
    console.log('📊 Generating 512 employees...');
    const employees = generateEmployees();
    console.log(`Generated ${employees.length} employees`);

    // Check if employees already exist
    const { count: existingEmployees } = await supabase
      .from('employees')
      .select('*', { count: 'exact', head: true });

    if (existingEmployees && existingEmployees > 0) {
      console.log(`⚠️ ${existingEmployees} employees already exist. Skipping employee seeding.`);
    } else {
      // Insert in batches of 100
      const batchSize = 100;
      for (let i = 0; i < employees.length; i += batchSize) {
        const batch = employees.slice(i, i + batchSize);
        const { error } = await supabase.from('employees').insert(batch);
        if (error) {
          console.error(`Error inserting employee batch ${i / batchSize + 1}:`, error);
          throw error;
        }
        console.log(`✅ Inserted employee batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(employees.length / batchSize)}`);
      }
      console.log('✅ All employees inserted successfully');
    }

    // 2. Insert new projects
    console.log('📁 Inserting 22 new projects...');
    const { count: existingProjects } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true });

    if (existingProjects && existingProjects >= 27) {
      console.log(`⚠️ ${existingProjects} projects already exist. Skipping project seeding.`);
    } else {
      const { error: projectError } = await supabase.from('projects').insert(newProjects);
      if (projectError) {
        console.error('Error inserting projects:', projectError);
        throw projectError;
      }
      console.log('✅ New projects inserted successfully');

      // 3. Update existing projects with department and budget
      console.log('🔄 Updating existing projects with department and budget data...');
      for (const update of existingProjectUpdates) {
        const { error } = await supabase
          .from('projects')
          .update({
            department: update.department,
            budget_allocated: update.budget_allocated,
            budget_spent: update.budget_spent,
          })
          .eq('name', update.name);
        
        if (error) {
          console.log(`Note: Could not update project "${update.name}":`, error.message);
        }
      }
      console.log('✅ Existing projects updated');
    }

    // Calculate final stats
    const { count: finalEmployees } = await supabase
      .from('employees')
      .select('*', { count: 'exact', head: true });

    const { count: finalProjects } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true });

    const { data: activeEmployees } = await supabase
      .from('employees')
      .select('id')
      .neq('usage_level', 'inactive');

    const activationRate = finalEmployees ? ((activeEmployees?.length || 0) / finalEmployees * 100).toFixed(1) : 0;

    const result = {
      success: true,
      stats: {
        employees: finalEmployees || 0,
        projects: finalProjects || 0,
        activeEmployees: activeEmployees?.length || 0,
        activationRate: `${activationRate}%`,
      },
      message: 'Database seeded successfully!',
    };

    console.log('🎉 Seeding complete:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Seeding error:', error);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
