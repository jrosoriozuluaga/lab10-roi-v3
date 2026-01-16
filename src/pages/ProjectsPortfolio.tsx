import { useState, useMemo } from 'react';
import { Search, ArrowUpDown, Users, Calendar, TrendingUp, Percent, AlertTriangle, FolderKanban, CheckCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { projects, AIProject } from '@/lib/mockData';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

function StatusBadge({ status }: { status: AIProject['status'] }) {
  const config = {
    'on-track': { label: 'On Track', className: 'border-success text-success bg-success/10' },
    'at-risk': { label: 'At Risk', className: 'border-warning text-warning bg-warning/10' },
    'off-track': { label: 'Off Track', className: 'border-destructive text-destructive bg-destructive/10' },
  };

  return (
    <Badge variant="outline" className={config[status].className}>
      {config[status].label}
    </Badge>
  );
}

function ImpactBadge({ impact }: { impact: AIProject['impact'] }) {
  const config = {
    high: 'bg-primary/20 text-primary border-primary',
    medium: 'bg-lilac/20 text-lilac border-lilac',
    low: 'bg-muted text-muted-foreground border-border',
  };

  return (
    <Badge variant="outline" className={config[impact]}>
      {impact.charAt(0).toUpperCase() + impact.slice(1)}
    </Badge>
  );
}

function ProjectDetailSheet({ project, open, onClose }: { project: AIProject | null; open: boolean; onClose: () => void }) {
  if (!project) return null;

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-6 border-b border-border">
          <div className="flex items-start justify-between">
            <div>
              <SheetTitle className="text-2xl font-bold text-foreground">{project.name}</SheetTitle>
              <p className="text-muted-foreground mt-1">{project.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <StatusBadge status={project.status} />
            <ImpactBadge impact={project.impact} />
          </div>
        </SheetHeader>

        {/* Header Stats */}
        <div className="grid grid-cols-3 gap-4 py-6 border-b border-border">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <Percent className="w-4 h-4" />
              <span className="text-xs">ROI Actual</span>
            </div>
            <span className={`text-2xl font-bold ${project.currentROI >= 0 ? 'text-success' : 'text-destructive'}`}>
              {project.currentROI > 0 ? '+' : ''}{project.currentROI}%
            </span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-xs">Tiempo</span>
            </div>
            <span className="text-2xl font-bold text-foreground">{project.timeElapsed}</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs">Presupuesto</span>
            </div>
            <span className={`text-2xl font-bold ${project.budgetUsed > 80 ? 'text-destructive' : 'text-foreground'}`}>
              {project.budgetUsed}%
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="py-6 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Progreso del Proyecto</span>
            <span className="text-sm text-muted-foreground">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2" />
        </div>

        {/* Owner */}
        <div className="py-6 border-b border-border">
          <h4 className="text-sm font-medium text-foreground mb-3">Owner</h4>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={project.owner.avatar} alt={project.owner.name} />
              <AvatarFallback>{project.owner.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-foreground">{project.owner.name}</p>
              <p className="text-sm text-muted-foreground">{project.owner.department}</p>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="py-6 border-b border-border">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-muted-foreground" />
            <h4 className="text-sm font-medium text-foreground">Equipo ({project.team.length})</h4>
          </div>
          <div className="flex items-center">
            <div className="flex -space-x-2">
              {project.team.slice(0, 5).map((member, i) => (
                <Avatar key={i} className="h-9 w-9 border-2 border-background">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            {project.team.length > 5 && (
              <span className="ml-2 text-sm text-muted-foreground">+{project.team.length - 5} más</span>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="py-6 border-b border-border">
          <h4 className="text-sm font-medium text-foreground mb-4">Actividad Reciente</h4>
          <div className="space-y-3">
            {project.recentActivity.map((activity, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(activity.date, { addSuffix: true, locale: es })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action */}
        <div className="pt-6">
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            Editar Proyecto
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function ProjectsPortfolio() {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<'name' | 'status' | 'impact'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedProject, setSelectedProject] = useState<AIProject | null>(null);

  const filteredProjects = useMemo(() => {
    let result = [...projects];

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.owner.name.toLowerCase().includes(searchLower) ||
        p.northStar.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'status') {
        const statusOrder = { 'off-track': 0, 'at-risk': 1, 'on-track': 2 };
        comparison = statusOrder[a.status] - statusOrder[b.status];
      } else if (sortField === 'impact') {
        const impactOrder = { high: 0, medium: 1, low: 2 };
        comparison = impactOrder[a.impact] - impactOrder[b.impact];
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [search, sortField, sortDirection]);

  const toggleSort = (field: 'name' | 'status' | 'impact') => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Calculate summary stats
  const totalProjects = projects.length;
  const onTrackCount = projects.filter(p => p.status === 'on-track').length;
  const atRiskCount = projects.filter(p => p.status === 'at-risk' || p.status === 'off-track').length;
  const deliveryRate = Math.round((onTrackCount / totalProjects) * 100);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Portafolio de Iniciativas AI</h1>
            <p className="text-muted-foreground mt-1">
              {projects.length} proyectos activos • {onTrackCount} on track
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar proyecto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          {/* Total Projects */}
          <div className="p-5 rounded-xl bg-card border border-border text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <FolderKanban className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Total Proyectos</p>
            </div>
            <p className="text-3xl font-bold text-foreground">{totalProjects}</p>
          </div>
          
          {/* Delivery Rate */}
          <div className="p-5 rounded-xl bg-card border border-border text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Delivery Rate</p>
            </div>
            <p className="text-3xl font-bold text-primary">{deliveryRate}%</p>
            <p className="text-xs text-muted-foreground mt-1">
              {onTrackCount} de {totalProjects} on track
            </p>
          </div>
          
          {/* At Risk */}
          <div className="p-5 rounded-xl bg-card border border-border text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">En Riesgo</p>
            </div>
            <p className="text-3xl font-bold text-warning">{atRiskCount}</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="w-[35%]">
                  <Button variant="ghost" size="sm" onClick={() => toggleSort('name')} className="hover:bg-transparent -ml-3">
                    Proyecto
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>North Star</TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => toggleSort('status')} className="hover:bg-transparent -ml-3">
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => toggleSort('impact')} className="hover:bg-transparent -ml-3">
                    Impact
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow 
                  key={project.id} 
                  className="cursor-pointer hover:bg-muted/50 border-border"
                  onClick={() => setSelectedProject(project)}
                >
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{project.name}</p>
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={project.owner.avatar} alt={project.owner.name} />
                        <AvatarFallback>{project.owner.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-foreground">{project.owner.name.split(' ')[0]}</p>
                        <p className="text-xs text-muted-foreground">{project.owner.department}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{project.northStar}</span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={project.status} />
                  </TableCell>
                  <TableCell>
                    <ImpactBadge impact={project.impact} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredProjects.length === 0 && (
            <div className="text-center py-16">
              <div className="mx-auto w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {search ? 'Sin resultados' : 'Todo en orden'}
              </h3>
              <p className="text-muted-foreground">
                {search 
                  ? 'No se encontraron proyectos con esos criterios'
                  : 'No hay proyectos en riesgo. ¡Excelente trabajo!'}
              </p>
            </div>
          )}
        </div>

        {/* Detail Sheet */}
        <ProjectDetailSheet 
          project={selectedProject} 
          open={!!selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      </div>
    </DashboardLayout>
  );
}
