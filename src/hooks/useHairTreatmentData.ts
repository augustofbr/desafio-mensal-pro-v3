
import { useState, useEffect } from "react";
import { convertDateFormat } from "@/lib/utils";
import { useDateFilter } from "@/contexts/DateFilterContext";
import { filterDataByDateRange } from "@/lib/dateUtils";
import { isInactiveProfessional } from "@/lib/constants";

export function useHairTreatmentData(allServicesData: any[]) {
  const [hairData, setHairData] = useState<any[]>([]);
  const { getFilteredDateRange } = useDateFilter();

  const processHairTreatmentData = (data: any[]) => {
    if (!Array.isArray(data)) {
      console.error("Invalid hair treatment data:", data);
      setHairData([]);
      return;
    }
    
    // Group by professional and calculate points
    const professionalPoints = data.reduce((acc: any, service: any) => {
      const professional = service.professional;
    if (isInactiveProfessional(professional)) {
      return acc;
    }

      
      if (!acc[professional]) {
        acc[professional] = { professional, points: 0, services: [] };
      }
      
      // Check if it's a "Cronograma Capilar [pacote]" 
      const isCapilarPackage = service.service_name && 
                              service.service_name.includes("Cronograma Capilar") && 
                              service.service_name.includes("pacote");
      
      // Add points based on the service: 5 points for Cronograma Capilar [pacote], 1 point for others
      const pointValue = isCapilarPackage ? 5 : 1;
      acc[professional].points += pointValue;
      
      // Add service to the list with standardized date format
      acc[professional].services.push({
        date: convertDateFormat(service.service_date),
        name: service.service_name || "Unknown Service",
        points: pointValue
      });
      
      return acc;
    }, {});
    
    // Convert to array and sort by points
    const sortedData = Object.values(professionalPoints).sort(
      (a: any, b: any) => b.points - a.points
    );
    
    console.log("Processed hair data:", sortedData);
    setHairData(sortedData);
  };

  useEffect(() => {
    if (allServicesData && allServicesData.length > 0) {
      // Get filtered date range from context
      const dateRange = getFilteredDateRange();
      
      // Filter data by date range
      const filteredData = filterDataByDateRange(allServicesData, dateRange);
      
      // Separate data by category
      const hairTreatments = filteredData.filter(
        service => service.category === "Tratamentos para Cabelo"
      );
      
      console.log("Hair treatments found:", hairTreatments.length);
      processHairTreatmentData(hairTreatments);
    } else {
      setHairData([]);
    }
  }, [allServicesData, getFilteredDateRange]);

  return hairData;
}
