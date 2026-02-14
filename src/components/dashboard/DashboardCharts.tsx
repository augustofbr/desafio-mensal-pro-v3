
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCurrentMonthName } from "@/lib/utils";
import { EvolutionChartContainer } from "@/components/charts/EvolutionChartContainer";
import { getCategoryDisplayName, CATEGORIES, isCategoryEnabled } from "@/lib/categoryDisplayNames";

interface DashboardChartsProps {
  hairData: any[];
  manicureData: any[];
  esteticaData: any[];
}

export default function DashboardCharts({ hairData, manicureData, esteticaData }: DashboardChartsProps) {
  const [hasData, setHasData] = useState(false);
  const [selectedProfessionals, setSelectedProfessionals] = useState<string[]>([]);
  const currentMonth = getCurrentMonthName();

  // Determinar quais tabs estão habilitadas
  const enabledTabs = [
    isCategoryEnabled(CATEGORIES.HAIR_TREATMENTS) && { key: "hair", category: CATEGORIES.HAIR_TREATMENTS },
    isCategoryEnabled(CATEGORIES.MANICURE_PEDICURE) && { key: "manicure", category: CATEGORIES.MANICURE_PEDICURE },
    isCategoryEnabled(CATEGORIES.ESTETICA) && { key: "estetica", category: CATEGORIES.ESTETICA },
  ].filter(Boolean) as { key: string; category: string }[];

  const [activeTab, setActiveTab] = useState(enabledTabs[0]?.key || "hair");

  useEffect(() => {
    // Check if we have any data to display
    if ((hairData && hairData.length > 0) || (manicureData && manicureData.length > 0) || (esteticaData && esteticaData.length > 0)) {
      setHasData(true);
      // Initialize with all professionals selected
      if (activeTab === "hair" && hairData.length > 0) {
        setSelectedProfessionals(hairData.map(prof => prof.professional));
      } else if (activeTab === "manicure" && manicureData.length > 0) {
        setSelectedProfessionals(manicureData.map(prof => prof.professional));
      } else if (activeTab === "estetica" && esteticaData.length > 0) {
        setSelectedProfessionals(esteticaData.map(prof => prof.professional));
      }
    } else {
      setHasData(false);
    }
  }, [hairData, manicureData, esteticaData, activeTab]);

  const toggleProfessional = (professional: string) => {
    setSelectedProfessionals(prev => {
      if (prev.includes(professional)) {
        return prev.filter(p => p !== professional);
      } else {
        return [...prev, professional];
      }
    });
  };

  const selectAllProfessionals = () => {
    const currentData = activeTab === "hair" ? hairData : activeTab === "manicure" ? manicureData : esteticaData;
    setSelectedProfessionals(currentData.map(prof => prof.professional));
  };

  const clearAllProfessionals = () => {
    setSelectedProfessionals([]);
  };

  if (!hasData) {
    return (
      <Card className="p-6">
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500 text-lg">Nenhum dado disponível para o mês atual</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="w-full overflow-hidden">
          <h3 className="text-lg font-semibold mb-1 text-center">Evolução da Pontuação por Dia</h3>
          <p className="text-sm text-muted-foreground text-center mb-4">
            Evolução acumulada da pontuação dos profissionais ao longo do mês de {currentMonth}
          </p>
          
          <Tabs defaultValue={enabledTabs[0]?.key || "hair"} className="w-full" onValueChange={setActiveTab}>
            <TabsList className={`grid w-full max-w-lg mx-auto mb-6 ${enabledTabs.length === 1 ? 'grid-cols-1' : enabledTabs.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
              {isCategoryEnabled(CATEGORIES.HAIR_TREATMENTS) && (
                <TabsTrigger value="hair">{getCategoryDisplayName(CATEGORIES.HAIR_TREATMENTS)}</TabsTrigger>
              )}
              {isCategoryEnabled(CATEGORIES.MANICURE_PEDICURE) && (
                <TabsTrigger value="manicure">{getCategoryDisplayName(CATEGORIES.MANICURE_PEDICURE)}</TabsTrigger>
              )}
              {isCategoryEnabled(CATEGORIES.ESTETICA) && (
                <TabsTrigger value="estetica">{getCategoryDisplayName(CATEGORIES.ESTETICA)}</TabsTrigger>
              )}
            </TabsList>

            {isCategoryEnabled(CATEGORIES.HAIR_TREATMENTS) && (
              <TabsContent value="hair" className="w-full">
                <EvolutionChartContainer
                  data={hairData}
                  type="hair"
                  selectedProfessionals={selectedProfessionals}
                  onToggleProfessional={toggleProfessional}
                  onSelectAll={selectAllProfessionals}
                  onClearAll={clearAllProfessionals}
                />
              </TabsContent>
            )}

            {isCategoryEnabled(CATEGORIES.MANICURE_PEDICURE) && (
              <TabsContent value="manicure" className="w-full">
                <EvolutionChartContainer
                  data={manicureData}
                  type="manicure"
                  selectedProfessionals={selectedProfessionals}
                  onToggleProfessional={toggleProfessional}
                  onSelectAll={selectAllProfessionals}
                  onClearAll={clearAllProfessionals}
                />
              </TabsContent>
            )}

            {isCategoryEnabled(CATEGORIES.ESTETICA) && (
              <TabsContent value="estetica" className="w-full">
                <EvolutionChartContainer
                  data={esteticaData}
                  type="estetica"
                  selectedProfessionals={selectedProfessionals}
                  onToggleProfessional={toggleProfessional}
                  onSelectAll={selectAllProfessionals}
                  onClearAll={clearAllProfessionals}
                />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}
