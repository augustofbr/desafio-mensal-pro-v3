
import { Button } from "@/components/ui/button";

interface ChartFiltersProps {
  data: any[];
  selectedProfessionals: string[];
  onToggleProfessional: (professional: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
}

export function ChartFilters({
  data,
  selectedProfessionals,
  onToggleProfessional,
  onSelectAll,
  onClearAll
}: ChartFiltersProps) {
  return (
    <div className="mb-4">
      <div className="flex flex-wrap gap-2 mb-3">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={onSelectAll}
        >
          Selecionar Todos
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={onClearAll}
        >
          Limpar Seleção
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {data.map((prof) => (
          <Button
            key={prof.professional}
            size="sm"
            variant={selectedProfessionals.includes(prof.professional) ? "default" : "outline"}
            onClick={() => onToggleProfessional(prof.professional)}
            className="text-xs"
          >
            {prof.professional}
          </Button>
        ))}
      </div>
    </div>
  );
}
