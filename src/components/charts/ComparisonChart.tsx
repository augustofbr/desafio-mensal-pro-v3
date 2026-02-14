
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "@/components/ui/bar-chart";
import { getCurrentMonthName } from "@/lib/utils";
import { getCategoryDisplayName, CATEGORIES } from "@/lib/categoryDisplayNames";

interface ComparisonChartProps {
  hairData: any[];
  manicureData: any[];
}

export function ComparisonChart({ hairData, manicureData }: ComparisonChartProps) {
  const currentMonth = getCurrentMonthName();
  
  const prepareBarChartData = () => {
    const allProfessionals = new Set([
      ...hairData.map(item => item.professional),
      ...manicureData.map(item => item.professional)
    ]);

    const labels = Array.from(allProfessionals);
    
    const hairPoints = labels.map(professional => {
      const prof = hairData.find(p => p.professional === professional);
      return prof ? prof.points : 0;
    });

    const manicurePoints = labels.map(professional => {
      const prof = manicureData.find(p => p.professional === professional);
      return prof ? prof.points : 0;
    });

    return {
      labels,
      datasets: [
        {
          label: getCategoryDisplayName(CATEGORIES.HAIR_TREATMENTS),
          data: hairPoints,
          backgroundColor: 'rgba(53, 162, 235, 0.7)',
        },
        {
          label: getCategoryDisplayName(CATEGORIES.MANICURE_PEDICURE),
          data: manicurePoints,
          backgroundColor: 'rgba(255, 99, 132, 0.7)',
        },
      ],
    };
  };

  const barChartData = prepareBarChartData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pontuação Total por Categoria</CardTitle>
        <CardDescription>
          Comparação da pontuação de cada profissional nas diferentes categorias
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          {(hairData.length > 0 || manicureData.length > 0) ? (
            <BarChart
              data={barChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Pontos'
                    }
                  }
                },
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                  title: {
                    display: true,
                    text: `Pontuação Total por Categoria (${currentMonth})`,
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
