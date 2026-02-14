
import { LineChart } from "@/components/ui/line-chart";
import { getCurrentMonthName, groupByDay, calculateDailyAccumulated } from "@/lib/utils";
import { getCategoryDisplayName, PROF_CATEGORIES } from "@/lib/categoryDisplayNames";

interface EvolutionChartProps {
  data: any[];
  type: 'hair' | 'manicure' | 'maquiagem' | 'estetica';
}

export function EvolutionChart({ data, type }: EvolutionChartProps) {
  const currentMonth = getCurrentMonthName();
  
  const prepareEvolutionData = (categoryData: any[]) => {
    if (!categoryData || categoryData.length === 0) {
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

    const datasets = categoryData.map((prof, index) => {
      // Ensure prof.services exists and is an array
      const services = Array.isArray(prof.services) ? prof.services : [];
      
      // Log the services to debug
      console.log(`Services for ${prof.professional}:`, services);
      
      // Filter services to only include dates up to today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const filteredServices = services.filter((service: any) => {
        if (service && service.date) {
          const serviceDate = new Date(service.date);
          serviceDate.setHours(0, 0, 0, 0);
          return serviceDate <= today;
        }
        return false;
      });
      
      // Create daily points object from filtered services
      const dailyPoints = groupByDay(filteredServices);
      
      console.log(`Daily points for ${prof.professional}:`, dailyPoints);
      
      // Calculate accumulated points using only filtered dates
      const accumulated = calculateDailyAccumulated(dailyPoints, sortedDates);
      
      console.log(`Accumulated points for ${prof.professional}:`, accumulated);
      
      // Generate a consistent color based on index
      const color = generateConsistentColor(index);
      
      return {
        label: prof.professional,
        data: sortedDates.map(date => accumulated[date] || 0),
        borderColor: color,
        tension: 0.3,
      };
    });

    // Get all possible dates from all professionals
    const allDates = new Set<string>();
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
    
    categoryData.forEach(prof => {
      if (Array.isArray(prof.services)) {
        prof.services.forEach((service: any) => {
          if (service && service.date) {
            const serviceDate = new Date(service.date);
            serviceDate.setHours(0, 0, 0, 0);
            
            // Only include dates that are today or in the past
            if (serviceDate <= today) {
              allDates.add(service.date);
            }
          }
        });
      }
    });
    
    // Convert to array, sort, and format for display
    const sortedDates = Array.from(allDates).sort();
    const formattedDates = sortedDates.map(date => {
      // Extract the day part - handles both YYYY-MM-DD format
      const parts = date.split('-');
      return parts.length === 3 ? parts[2] : date;
    });
    
    console.log("Chart dates:", formattedDates);
    console.log("Chart datasets:", datasets);
    
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

  function generateConsistentColor(index: number) {
    const colors = [
      'rgb(255, 99, 132)',   // Red
      'rgb(53, 162, 235)',   // Blue
      'rgb(75, 192, 192)',   // Teal
      'rgb(255, 159, 64)',   // Orange
      'rgb(153, 102, 255)',  // Purple
      'rgb(255, 99, 71)',    // Tomato
      'rgb(50, 205, 50)',    // Lime Green
      'rgb(255, 205, 86)',   // Yellow
      'rgb(201, 203, 207)',  // Gray
      'rgb(54, 162, 235)',   // Light Blue
    ];
    
    // Return color based on index to ensure consistency
    return colors[index % colors.length];
  }

  const evolutionData = prepareEvolutionData(data);
  const categoryMap: Record<string, string> = {
    hair: PROF_CATEGORIES.CABELO,
    manicure: PROF_CATEGORIES.UNHAS,
    maquiagem: PROF_CATEGORIES.MAQUIAGEM,
    estetica: PROF_CATEGORIES.ESTETICA,
  };
  const title = `Evolução de Pontos - ${getCategoryDisplayName(categoryMap[type] || type)} (${currentMonth})`;

  return (
    <div className="h-[280px] sm:h-[320px] md:h-[350px] lg:h-[400px] mt-4 w-full overflow-hidden">
      <LineChart
        data={evolutionData}
        showEndLabels={true}
        showEnhancedTooltips={true}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Dia do Mês'
              },
              ticks: {
                maxRotation: 90,
                minRotation: 45,
                font: {
                  size: 8
                }
              }
            },
            y: {
              title: {
                display: true,
                text: 'Pontos Acumulados'
              },
              beginAtZero: true,
              ticks: {
                font: {
                  size: 8
                }
              }
            }
          },
          plugins: {
            legend: {
              position: 'top' as const,
              labels: {
                boxWidth: 10,
                font: {
                  size: 10,
                  weight: 'bold'
                },
                padding: 10
              }
            },
            title: {
              display: true,
              text: title,
              font: {
                size: 12,
                weight: 'bold'
              },
              padding: {
                bottom: 15
              }
            },
          },
        }}
      />
    </div>
  );
}
