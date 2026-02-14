
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EvolutionChart } from "@/components/charts/EvolutionChart";
import { ComparisonChart } from "@/components/charts/ComparisonChart";
import { DistributionChart } from "@/components/charts/DistributionChart";
import { getCurrentMonthName } from "@/lib/utils";
import { getCategoryDisplayName, PROF_CATEGORIES, isCategoryEnabled } from "@/lib/categoryDisplayNames";

interface PerformanceChartsProps {
  hairData: any[];
  manicureData: any[];
  esteticaData: any[];
  maquiagemData: any[];
}

export function PerformanceCharts({ hairData, manicureData, esteticaData, maquiagemData }: PerformanceChartsProps) {
  const currentMonth = getCurrentMonthName();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Evolução da Pontuação por Dia</CardTitle>
          <CardDescription>
            Evolução acumulada da pontuação dos profissionais ao longo do mês de {currentMonth}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="hair">
            <TabsList className="grid grid-cols-3 w-full max-w-lg mx-auto mb-6">
              {isCategoryEnabled(PROF_CATEGORIES.CABELO) && (
                <TabsTrigger value="hair">{getCategoryDisplayName(PROF_CATEGORIES.CABELO)}</TabsTrigger>
              )}
              {isCategoryEnabled(PROF_CATEGORIES.UNHAS) && (
                <TabsTrigger value="manicure">{getCategoryDisplayName(PROF_CATEGORIES.UNHAS)}</TabsTrigger>
              )}
              {isCategoryEnabled(PROF_CATEGORIES.MAQUIAGEM) && (
                <TabsTrigger value="maquiagem">{getCategoryDisplayName(PROF_CATEGORIES.MAQUIAGEM)}</TabsTrigger>
              )}
              {isCategoryEnabled(PROF_CATEGORIES.ESTETICA) && (
                <TabsTrigger value="estetica">{getCategoryDisplayName(PROF_CATEGORIES.ESTETICA)}</TabsTrigger>
              )}
            </TabsList>

            {isCategoryEnabled(PROF_CATEGORIES.CABELO) && (
              <TabsContent value="hair">
                <EvolutionChart data={hairData} type="hair" />
              </TabsContent>
            )}

            {isCategoryEnabled(PROF_CATEGORIES.UNHAS) && (
              <TabsContent value="manicure">
                <EvolutionChart data={manicureData} type="manicure" />
              </TabsContent>
            )}

            {isCategoryEnabled(PROF_CATEGORIES.MAQUIAGEM) && (
              <TabsContent value="maquiagem">
                <EvolutionChart data={maquiagemData} type="maquiagem" />
              </TabsContent>
            )}

            {isCategoryEnabled(PROF_CATEGORIES.ESTETICA) && (
              <TabsContent value="estetica">
                <EvolutionChart data={esteticaData} type="estetica" />
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ComparisonChart hairData={hairData} manicureData={manicureData} maquiagemData={maquiagemData} esteticaData={esteticaData} />
        <DistributionChart hairData={hairData} />
      </div>
    </div>
  );
}

export default PerformanceCharts;
