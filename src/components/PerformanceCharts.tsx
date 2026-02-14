
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EvolutionChart } from "@/components/charts/EvolutionChart";
import { ComparisonChart } from "@/components/charts/ComparisonChart";
import { DistributionChart } from "@/components/charts/DistributionChart";
import { getCurrentMonthName } from "@/lib/utils";
import { getCategoryDisplayName, CATEGORIES } from "@/lib/categoryDisplayNames";

interface PerformanceChartsProps {
  hairData: any[];
  manicureData: any[];
  esteticaData: any[];
}

export function PerformanceCharts({ hairData, manicureData, esteticaData }: PerformanceChartsProps) {
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
              <TabsTrigger value="hair">{getCategoryDisplayName(CATEGORIES.HAIR_TREATMENTS)}</TabsTrigger>
              <TabsTrigger value="manicure">{getCategoryDisplayName(CATEGORIES.MANICURE_PEDICURE)}</TabsTrigger>
              <TabsTrigger value="estetica">{getCategoryDisplayName(CATEGORIES.ESTETICA)}</TabsTrigger>
            </TabsList>

            <TabsContent value="hair">
              <EvolutionChart data={hairData} type="hair" />
            </TabsContent>

            <TabsContent value="manicure">
              <EvolutionChart data={manicureData} type="manicure" />
            </TabsContent>

            <TabsContent value="estetica">
              <EvolutionChart data={esteticaData} type="estetica" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ComparisonChart hairData={hairData} manicureData={manicureData} esteticaData={esteticaData} />
        <DistributionChart hairData={hairData} />
      </div>
    </div>
  );
}

export default PerformanceCharts;
