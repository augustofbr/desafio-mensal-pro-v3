
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useDateFilter } from "@/contexts/DateFilterContext";
import { filterDataByDateRange } from "@/lib/dateUtils";

interface CronogramaDataProcessorProps {
  loading: boolean;
  onDataProcessed: (data: any[]) => void;
}

export function CronogramaDataProcessor({ loading, onDataProcessed }: CronogramaDataProcessorProps) {
  const { getFilteredDateRange } = useDateFilter();

  // Process Cronograma Capilar sales data
  const processCronogramaData = async () => {
    try {
      // Fetch all Cronograma Capilar services
      const { data: servicesData, error } = await supabase
        .from('trinks_services')
        .select('*')
        .ilike('service_name', '%Cronograma Capilar%pacote%');

      if (error) {
        console.error("Error fetching cronograma data:", error);
        return;
      }

      if (servicesData && servicesData.length > 0) {
        // Get filtered date range from context
        const dateRange = getFilteredDateRange();
        
        // Filter data by date range
        const filteredData = filterDataByDateRange(servicesData, dateRange);

        // Group by professional
        const professionalSales = filteredData.reduce((acc: any, service: any) => {
          const professional = service.professional;
          if (!professional) return acc;

          if (!acc[professional]) {
            acc[professional] = {
              professional,
              quantity: 0
            };
          }

          acc[professional].quantity += 1;

          return acc;
        }, {});

        // Convert to array and sort by quantity
        const sortedData = Object.values(professionalSales).sort(
          (a: any, b: any) => b.quantity - a.quantity
        );

        onDataProcessed(sortedData);
      } else {
        onDataProcessed([]);
      }
    } catch (error) {
      console.error("Error processing cronograma data:", error);
      onDataProcessed([]);
    }
  };

  // Process cronograma data when main data loads or filter changes
  useEffect(() => {
    if (!loading) {
      processCronogramaData();
    }
  }, [loading, getFilteredDateRange]);

  // This component doesn't render anything, it's just for data processing
  return null;
}
