
import { useState, useEffect } from "react";
import { convertDateFormat } from "@/lib/utils";
import { useDateFilter } from "@/contexts/DateFilterContext";
import { filterDataByDateRange } from "@/lib/dateUtils";
import { isInactiveProfessional } from "@/lib/constants";

export function useManicurePedicureData(allServicesData: any[]) {
  const [manicureData, setManicureData] = useState<any[]>([]);
  const { getFilteredDateRange } = useDateFilter();

  const processManicurePedicureData = (data: any[]) => {
    if (!Array.isArray(data)) {
      console.error("Invalid manicure data:", data);
      setManicureData([]);
      return;
    }
    
    console.log("Processing manicure data:", data.length, "services");
    
    // Group by professional and calculate points with new rules
    const professionalPoints = data.reduce((acc: any, service: any) => {
      const serviceName = service.service_name || '';
      const professional = service.professional;
      const serviceDate = service.service_date;
      const clientName = service.client_name;
      
      console.log("Analyzing service:", {
        name: service.service_name,
        professional: service.professional,
        client: service.client_name,
        date: service.service_date
      });
      
      if (isInactiveProfessional(professional)) {
        console.warn("Service missing professional or professional is inactive:", service);
        return acc;
      }
      
      if (!acc[professional]) {
        acc[professional] = { 
          professional, 
          points: 0, 
          services: [],
          // Track unique clients per day for point calculation
          clientDays: new Set(),
          // Track SPA dos Pés services
          spaServices: 0
        };
      }
      
      // Rule 1: "SPA dos Pés" = 1.5 points each
      const isSpaDosPes = serviceName === "SPA dos Pés";
      if (isSpaDosPes) {
        console.log("✅ FOUND SPA dos Pes service:", {
          name: service.service_name,
          professional: service.professional
        });
        
        acc[professional].points += 1.5;
        acc[professional].spaServices += 1;
        
        console.log("Added 1.5 points for SPA dos Pés to", professional, "- total points:", acc[professional].points);
        
        acc[professional].services.push({
          date: convertDateFormat(service.service_date),
          name: service.service_name,
          points: 1.5,
          type: 'spa'
        });
      }
      
      // Rule 2: Each unique client per day = 1 point
      // Only count clients with valid names (not null/empty)
      if (clientName && clientName.trim()) {
        const clientDayKey = `${clientName.trim()}-${serviceDate}`;
        
        // Check if this client+day combination was already counted
        if (!acc[professional].clientDays.has(clientDayKey)) {
          acc[professional].clientDays.add(clientDayKey);
          acc[professional].points += 1;
          
          console.log("Added 1 point for unique client", clientName, "on", serviceDate, "to", professional);
          
          acc[professional].services.push({
            date: convertDateFormat(service.service_date),
            name: `Cliente: ${clientName}`,
            points: 1,
            type: 'client',
            clientName: clientName
          });
        } else {
          console.log("Client", clientName, "already counted for", professional, "on", serviceDate);
        }
      }
      
      return acc;
    }, {});
    
    // Clean up the data structure for final output (remove Set objects)
    const cleanedData = Object.values(professionalPoints).map((prof: any) => ({
      professional: prof.professional,
      points: prof.points,
      services: prof.services,
      spaServices: prof.spaServices,
      uniqueClientDays: prof.clientDays.size
    }));
    
    // Sort by points (descending)
    const sortedData = cleanedData.sort(
      (a: any, b: any) => b.points - a.points
    );
    
    console.log("Final processed manicure data:", sortedData);
    console.log("Professional points summary:", professionalPoints);
    setManicureData(sortedData);
  };

  useEffect(() => {
    if (allServicesData && allServicesData.length > 0) {
      // Get filtered date range from context
      const dateRange = getFilteredDateRange();
      
      // Filter data by date range
      const filteredData = filterDataByDateRange(allServicesData, dateRange);
      
      const manicurePedicure = filteredData.filter(
        service => service.category === "Manicure e Pedicure"
      );
      
      console.log("Manicure services found:", manicurePedicure.length);
      
      // Debug: Log all unique service names in manicure category
      const uniqueManicureServices = [...new Set(manicurePedicure.map(s => s.service_name))];
      console.log("Unique manicure service names:", uniqueManicureServices);
      
      processManicurePedicureData(manicurePedicure);
    } else {
      setManicureData([]);
    }
  }, [allServicesData, getFilteredDateRange]);

  return manicureData;
}
