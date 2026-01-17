import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, ArrowUpDown, AlertTriangle, FolderKanban, CheckCircle, Plus, Percent } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { ProjectFormDialog, ProjectFormData } from '@/components/ProjectFormDialog';
import { toast } from 'sonner';
import { generateProjects } from '@/lib/mockData';

interface Project {
  id: string;
  name: string;
  owner: string;
  status: 'on-track' | 'at-risk' | 'off-track';
  north_star: string;
  roi_percent: number;
  impact_level: 'high' | 'medium' | 'low';
  created_at: string;
  updated_at: string;
}

function StatusBadge({ status }: { status: Project['status'] }) {
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

function ImpactBadge({ impact }: { impact: Project['impact_level'] }) {
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

function ProjectDetailSheet({
  project,
  open,
  onClose,
  onEdit
}: {
  project: Project | null;
  open: boolean;
  onClose: () => void;
  onEdit: (project: Project) => void;
}) {
  if (!project) return null;

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-6 border-b border-border">
          <div className="flex items-start justify-between">
            <div>
              <SheetTitle className="text-2xl font-bold text-foreground">{project.name}</SheetTitle>
              <p className="text-muted-foreground mt-1">Owner: {project.owner}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <StatusBadge status={project.status} />
            <ImpactBadge impact={project.impact_level} />
          </div>
        </SheetHeader>

        {/* Header Stats */}
        <div className="grid grid-cols-2 gap-4 py-6 border-b border-border">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <Percent className="w-4 h-4" />
              <span className="text-xs">ROI Actual</span>
            </div>
            <span className={`text-2xl font-bold ${project.roi_percent >= 0 ? 'text-success' : 'text-destructive'}`}>
              {project.roi_percent > 0 ? '+' : ''}{project.roi_percent}%
            </span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <FolderKanban className="w-4 h-4" />
              <span className="text-xs">North Star</span>
            </div>
            <span className="text-lg font-medium text-foreground">{project.north_star}</span>
          </div>
        </div>

        {/* Action */}
        <div className="pt-6">
          <Button
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => onEdit(project)}
          >
            Editar Proyecto
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function ProjectsPortfolio() {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<'name' | 'status' | 'impact_level'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectFormData | null>(null);

  const queryClient = useQueryClient();

  import { generateProjects } from '@/lib/mockData';

  // Fetch projects from Supabase or Fallback
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        // If we have data, use it
        if (!error && data && data.length > 0) {
          return data as Project[];
        }

        // If error or empty, use Mock Data Fallback
        console.log('Using fallback mock data for projects');
        const mockProjects = generateProjects();

        return mockProjects.map(mp => ({
          id: mp.id,
          name: mp.name,
          owner: mp.owner.name,
          status: mp.status,
          north_star: mp.northStar,
          roi_percent: mp.currentROI,
          impact_level: mp.impact,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })) as Project[];

      } catch (e) {
        console.warn("Supabase fetch failed, using fallback", e);
        // Same fallback logic on crash
        return generateProjects().map(mp => ({
          id: mp.id,
          name: mp.name,
          owner: mp.owner.name,
          status: mp.status,
          north_star: mp.northStar,
          roi_percent: mp.currentROI,
          impact_level: mp.impact,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })) as Project[];
      }
    }
  });

  // Insert mutation
  const insertMutation = useMutation({
    mutationFn: async (project: Omit<ProjectFormData, 'id'>) => {
      const { error } = await supabase.from('projects').insert(project);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Proyecto creado exitosamente');
      setIsFormOpen(false);
    },
    onError: (error) => {
      toast.error('Error al crear proyecto: ' + error.message);
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: ProjectFormData) => {
      const { error } = await supabase
        .from('projects')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Proyecto actualizado');
      setIsFormOpen(false);
      setSelectedProject(null);
    },
    onError: (error) => {
      toast.error('Error al actualizar proyecto: ' + error.message);
    }
  });

  const handleFormSubmit = (data: ProjectFormData) => {
    if (data.id) {
      updateMutation.mutate(data);
    } else {
      const { id, ...insertData } = data;
      insertMutation.mutate(insertData);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject({
      id: project.id,
      name: project.name,
      owner: project.owner,
      status: project.status,
      north_star: project.north_star,
      roi_percent: project.roi_percent,
      impact_level: project.impact_level,
    });
    setSelectedProject(null);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingProject(null);
    setIsFormOpen(true);
  };

  const filteredProjects = useMemo(() => {
    let result = [...projects];

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.owner.toLowerCase().includes(searchLower) ||
        p.north_star.toLowerCase().includes(searchLower)
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
      } else if (sortField === 'impact_level') {
        const impactOrder = { high: 0, medium: 1, low: 2 };
        comparison = impactOrder[a.impact_level] - impactOrder[b.impact_level];
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [projects, search, sortField, sortDirection]);

  const toggleSort = (field: 'name' | 'status' | 'impact_level') => {
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
  const deliveryRate = totalProjects > 0 ? Math.round((onTrackCount / totalProjects) * 100) : 0;

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
          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar proyecto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={handleAddNew} className="shrink-0">
              <Plus className="w-4 h-4 mr-2" />
              Agregar
            </Button>
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
        <div className="bg-card border border-border rounded-xl overflow-hidden overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="w-[30%]">
                  <Button variant="ghost" size="sm" onClick={() => toggleSort('name')} className="hover:bg-transparent -ml-3">
                    Proyecto
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>North Star</TableHead>
                <TableHead>ROI</TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => toggleSort('status')} className="hover:bg-transparent -ml-3">
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => toggleSort('impact_level')} className="hover:bg-transparent -ml-3">
                    Impact
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                  </TableRow>
                ))
              ) : (
                filteredProjects.map((project) => (
                  <TableRow
                    key={project.id}
                    className="cursor-pointer hover:bg-muted/50 border-border"
                    onClick={() => setSelectedProject(project)}
                  >
                    <TableCell>
                      <p className="font-medium text-foreground">{project.name}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-foreground">{project.owner}</p>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{project.north_star}</span>
                    </TableCell>
                    <TableCell>
                      <span className={`text-sm font-medium ${project.roi_percent >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {project.roi_percent > 0 ? '+' : ''}{project.roi_percent}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={project.status} />
                    </TableCell>
                    <TableCell>
                      <ImpactBadge impact={project.impact_level} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {!isLoading && filteredProjects.length === 0 && (
            <div className="text-center py-16">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <FolderKanban className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {search ? 'Sin resultados' : 'No hay proyectos'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {search
                  ? 'No se encontraron proyectos con esos criterios'
                  : 'Agrega tu primer proyecto AI para comenzar'}
              </p>
              {!search && (
                <Button onClick={handleAddNew}>
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Proyecto
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Detail Sheet */}
        <ProjectDetailSheet
          project={selectedProject}
          open={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          onEdit={handleEdit}
        />

        {/* Add/Edit Form Dialog */}
        <ProjectFormDialog
          open={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingProject(null);
          }}
          onSubmit={handleFormSubmit}
          initialData={editingProject}
          isLoading={insertMutation.isPending || updateMutation.isPending}
        />
      </div>
    </DashboardLayout>
  );
}
