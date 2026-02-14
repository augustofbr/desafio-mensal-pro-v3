
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

    console.log("Processing hair data:", data.length, "services");

    // Group by professional and calculate points with new rules
    const professionalPoints = data.reduce((acc: any, service: any) => {
      const serviceName = service.service_name || '';
      const professional = service.professional;
      const serviceDate = service.service_date;
      const clientName = service.client_name;

      if (isInactiveProfessional(professional)) {
        return acc;
      }

      if (!acc[professional]) {
        acc[professional] = {
          professional,
          points: 0,
          services: [],
          // Track unique clients per day for point calculation
          clientDays: new Set(),
          // Track treatment services count
          treatmentServices: 0
        };
      }

      // Rule 1: Each service in the category = 2 points (treatment bonus)
      acc[professional].points += 2;
      acc[professional].treatmentServices += 1;

      acc[professional].services.push({
        date: convertDateFormat(service.service_date),
        name: service.service_name || "Unknown Service",
        points: 2,
        type: 'treatment'
      });

      // Rule 2: Each unique client per day = 1 point
      // Only count clients with valid names (not null/empty)
      if (clientName && clientName.trim()) {
        const clientDayKey = `${clientName.trim()}-${serviceDate}`;

        // Check if this client+day combination was already counted
        if (!acc[professional].clientDays.has(clientDayKey)) {
          acc[professional].clientDays.add(clientDayKey);
          acc[professional].points += 1;

          acc[professional].services.push({
            date: convertDateFormat(service.service_date),
            name: `Cliente: ${clientName}`,
            points: 1,
            type: 'client',
            clientName: clientName
          });
        }
      }

      return acc;
    }, {});

    // Clean up the data structure for final output (remove Set objects)
    const cleanedData = Object.values(professionalPoints).map((prof: any) => ({
      professional: prof.professional,
      points: prof.points,
      services: prof.services,
      treatmentServices: prof.treatmentServices,
      uniqueClientDays: prof.clientDays.size
    }));

    // Sort by points (descending)
    const sortedData = cleanedData.sort(
      (a: any, b: any) => b.points - a.points
    );

    console.log("Final processed hair data:", sortedData);
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
