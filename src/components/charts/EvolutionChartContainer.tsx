
import { LineChart } from "@/components/ui/line-chart";
import { ChartFilters } from "./ChartFilters";
import { getCurrentMonthName, groupByDay, calculateDailyAccumulated } from "@/lib/utils";
import { useDateFilter } from "@/contexts/DateFilterContext";
import { getCategoryDisplayName, CATEGORIES } from "@/lib/categoryDisplayNames";

interface EvolutionChartContainerProps {
  data: any[];
  type: 'hair' | 'manicure';
  selectedProfessionals: string[];
  onToggleProfessional: (professional: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
}

export function EvolutionChartContainer({
  data,
  type,
  selectedProfessionals,
  onToggleProfessional,
  onSelectAll,
  onClearAll
}: EvolutionChartContainerProps) {
  const { getFilteredDateRange } = useDateFilter();
  const currentMonth = getCurrentMonthName();

  const prepareEvolutionData = () => {
    if (!data || data.length === 0) {
      return { 
        labels: ['No data'], 
        datasets: [{
          label: 'No data',
          data: [0],
          borderColor: 'rgb(200, 200, 200)',
          tension: 0.3,
        }] 
      };
    }

    // Filter data based on selected professionals
    const filteredData = data.filter(prof => 
      selectedProfessionals.includes(prof.professional)
    );

    if (filteredData.length === 0) {
      return { 
        labels: ['No data'], 
        datasets: [{
          label: 'Nenhum profissional selecionado',
          data: [0],
          borderColor: 'rgb(200, 200, 200)',
          tension: 0.3,
        }] 
      };
    }

    // Get filtered date range from context
    const dateRange = getFilteredDateRange();
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    const today = new Date();
    
    // Find the latest date with actual data from all professionals
    let latestDataDate = null;
    filteredData.forEach(prof => {
      if (Array.isArray(prof.services)) {
        prof.services.forEach((service: any) => {
          if (service && service.date) {
            const serviceDate = new Date(service.date);
            if (!latestDataDate || serviceDate > latestDataDate) {
              latestDataDate = serviceDate;
            }
          }
        });
      }
    });
    
    // Use the earlier of: today, endDate, or latestDataDate
    let actualEndDate = endDate;
    if (today < endDate) {
      actualEndDate = today;
    }
    if (latestDataDate && latestDataDate < actualEndDate) {
      actualEndDate = latestDataDate;
    }
    
    // Create range of dates from start to actualEndDate (no future dates)
    const fullDateRange = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= actualEndDate) {
      const formattedDate = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD format
      fullDateRange.push(formattedDate);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    const datasets = filteredData.map((prof, index) => {
      // Ensure prof.services exists and is an array
      const services = Array.isArray(prof.services) ? prof.services : [];
      
      // Create daily points object
      const dailyPoints = groupByDay(services);
      
      // Calculate accumulated points for all dates in range
      const accumulated = calculateDailyAccumulated(dailyPoints, fullDateRange);
      
      // Generate colors for different professionals
      const colors = [
        'rgb(255, 99, 132)',
        'rgb(53, 162, 235)',
        'rgb(75, 192, 192)',
        'rgb(255, 159, 64)',
        'rgb(153, 102, 255)',
        'rgb(201, 203, 207)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)',
        'rgb(255, 99, 71)',
        'rgb(50, 205, 50)',
      ];
      
      const color = colors[index % colors.length];
      
      return {
        label: prof.professional,
        data: fullDateRange.map(date => accumulated[date] || 0),
        borderColor: color,
        tension: 0.3,
      };
    });

    // Format dates for display (just the day part)
    const formattedDates = fullDateRange.map(date => {
      const parts = date.split('-');
      return parts.length === 3 ? parts[2] : date;
    });
    
    return {
      labels: formattedDates.length > 0 ? formattedDates : ['No data'],
      datasets: datasets.length > 0 ? datasets : [{
        label: 'No data',
        data: [0],
        borderColor: 'rgb(200, 200, 200)',
        tension: 0.3,
      }],
    };
  };

  const chartData = prepareEvolutionData();
  const title = type === 'hair' ? 
    `Evolução de Pontos - ${getCategoryDisplayName(CATEGORIES.HAIR_TREATMENTS)}` : 
    `Evolução de Pontos - ${getCategoryDisplayName(CATEGORIES.MANICURE_PEDICURE)}`;

  return (
    <div className="w-full">
      <ChartFilters
        data={data}
        selectedProfessionals={selectedProfessionals}
        onToggleProfessional={onToggleProfessional}
        onSelectAll={onSelectAll}
        onClearAll={onClearAll}
      />
      
      <div className="w-full h-[300px] sm:h-[400px] mt-4">
        <LineChart
          data={chartData}
          showEndLabels={true}
          showEnhancedTooltips={true}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Dia do Período'
                },
                ticks: {
                  maxRotation: 45,
                  minRotation: 0
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'Pontos Acumulados'
                },
                beginAtZero: true
              }
            },
            plugins: {
              legend: {
                position: 'top' as const,
                labels: {
                  boxWidth: 14,
                  font: {
                    size: 13,
                    weight: 'bold'
                  },
                  padding: 12
                }
              },
              title: {
                display: true,
                text: title,
                font: {
                  size: 16,
                  weight: 'bold'
                },
                padding: {
                  bottom: 20
                }
              },
            },
          }}
        />
      </div>
    </div>
  );
}
