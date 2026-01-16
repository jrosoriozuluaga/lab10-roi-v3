import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface ProjectFormData {
  id?: string;
  name: string;
  owner: string;
  status: 'on-track' | 'at-risk' | 'off-track';
  north_star: string;
  roi_percent: number;
  impact_level: 'high' | 'medium' | 'low';
}

interface ProjectFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormData) => void;
  initialData?: ProjectFormData | null;
  isLoading?: boolean;
}

const defaultFormData: ProjectFormData = {
  name: '',
  owner: '',
  status: 'on-track',
  north_star: '',
  roi_percent: 0,
  impact_level: 'medium',
};

export function ProjectFormDialog({ open, onClose, onSubmit, initialData, isLoading }: ProjectFormDialogProps) {
  const [formData, setFormData] = useState<ProjectFormData>(defaultFormData);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(defaultFormData);
    }
  }, [initialData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isEditing = !!initialData?.id;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Proyecto' : 'Agregar Proyecto'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Actualiza los detalles del proyecto.' : 'Ingresa los detalles del nuevo proyecto AI.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Proyecto</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej: Automatización de Reportes"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="owner">Owner</Label>
            <Input
              id="owner"
              value={formData.owner}
              onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
              placeholder="Ej: Ana Martínez"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="north_star">North Star Metric</Label>
            <Input
              id="north_star"
              value={formData.north_star}
              onChange={(e) => setFormData({ ...formData, north_star: e.target.value })}
              placeholder="Ej: Ahorro de Costos"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'on-track' | 'at-risk' | 'off-track') => 
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="on-track">On Track</SelectItem>
                  <SelectItem value="at-risk">At Risk</SelectItem>
                  <SelectItem value="off-track">Off Track</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="impact_level">Impact Level</Label>
              <Select
                value={formData.impact_level}
                onValueChange={(value: 'high' | 'medium' | 'low') => 
                  setFormData({ ...formData, impact_level: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="roi_percent">ROI (%)</Label>
            <Input
              id="roi_percent"
              type="number"
              value={formData.roi_percent}
              onChange={(e) => setFormData({ ...formData, roi_percent: Number(e.target.value) })}
              placeholder="0"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Crear Proyecto'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
