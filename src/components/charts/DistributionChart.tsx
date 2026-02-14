
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart } from "@/components/ui/pie-chart";
import { getCurrentMonthName } from "@/lib/utils";
import { getCategoryDisplayName, getServiceTypeDisplayName, CATEGORIES } from "@/lib/categoryDisplayNames";

interface DistributionChartProps {
  hairData: any[];
}

export function DistributionChart({ hairData }: DistributionChartProps) {
  const currentMonth = getCurrentMonthName();
  
  const prepareHairPieData = () => {
    // Count points from regular services vs Cronograma Capilar
    let cronogramaPoints = 0;
    let otherPoints = 0;

    hairData.forEach(prof => {
      (prof.services || []).forEach((service: any) => {
        if (service.name.includes("Cronograma Capilar") && service.name.includes("pacote")) {
          cronogramaPoints += service.points;
        } else {
          otherPoints += service.points;
        }
      });
    });

    return {
      labels: ['Cronograma Capilar [pacote]', getServiceTypeDisplayName('Outros Serviços')],
      datasets: [
        {
          data: [cronogramaPoints, otherPoints],
          backgroundColor: [
            'rgba(255, 159, 64, 0.7)',
            'rgba(75, 192, 192, 0.7)',
          ],
        },
      ],
    };
  };

  const hairPieData = prepareHairPieData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição de Pontos por Serviço</CardTitle>
        <CardDescription>
          Proporção de pontos por tipo de serviço na categoria {getCategoryDisplayName(CATEGORIES.HAIR_TREATMENTS)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          {hairData.length > 0 ? (
            <PieChart
              data={hairPieData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                  title: {
                    display: true,
                    text: `Distribuição de Pontos - ${getCategoryDisplayName(CATEGORIES.HAIR_TREATMENTS)} (${currentMonth})`,
                  },
                },
              }}
            />
          ) : (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500">Nenhum dado disponível para exibir</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
