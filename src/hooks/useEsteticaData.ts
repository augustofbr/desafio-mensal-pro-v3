import { useState, useEffect } from "react";
import { convertDateFormat } from "@/lib/utils";
import { useDateFilter } from "@/contexts/DateFilterContext";
import { filterDataByDateRange } from "@/lib/dateUtils";

export function useEsteticaData(allServicesData: any[], categoryProfessionals: string[]) {
  const [esteticaData, setEsteticaData] = useState<any[]>([]);
  const { getFilteredDateRange } = useDateFilter();

  const processEsteticaData = (data: any[]) => {
    if (!Array.isArray(data)) {
      console.error("Invalid estética data:", data);
      setEsteticaData([]);
      return;
    }

    console.log("Processing estética data:", data.length, "services");

    const professionalPoints = data.reduce((acc: any, service: any) => {
      const serviceName = service.service_name || '';
      const professional = service.professional;
      const serviceDate = service.service_date;
      const clientName = service.client_name;

      if (!professional) return acc;

      if (!acc[professional]) {
        acc[professional] = {
          professional,
          points: 0,
          services: [],
          clientDays: new Set(),
          sobrancelhaServices: 0
        };
      }

      // Rule 1: "Sobrancelha (Design*)" services = 1.5 points each
      const isSobrancelha = serviceName.toLowerCase().startsWith("design");
      if (isSobrancelha) {
        acc[professional].points += 1.5;
        acc[professional].sobrancelhaServices += 1;

        acc[professional].services.push({
          date: convertDateFormat(service.service_date),
          name: service.service_name,
          points: 1.5,
          type: 'sobrancelha'
        });
      }

      // Rule 2: Each unique client per day = 1 point
      if (clientName && clientName.trim()) {
        const clientDayKey = `${clientName.trim()}-${serviceDate}`;

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

    const cleanedData = Object.values(professionalPoints).map((prof: any) => ({
      professional: prof.professional,
      points: prof.points,
      services: prof.services,
      sobrancelhaServices: prof.sobrancelhaServices,
      uniqueClientDays: prof.clientDays.size
    }));

    const sortedData = cleanedData.sort(
      (a: any, b: any) => b.points - a.points
    );

    console.log("Final processed estética data:", sortedData);
    setEsteticaData(sortedData);
  };

  useEffect(() => {
    if (allServicesData && allServicesData.length > 0 && categoryProfessionals.length > 0) {
      const dateRange = getFilteredDateRange();
      const filteredData = filterDataByDateRange(allServicesData, dateRange);

      // Filter services by professionals in this category
      const categoryServices = filteredData.filter(
        service => categoryProfessionals.includes(service.professional)
      );

      console.log("Estética services found:", categoryServices.length, "from", categoryProfessionals.length, "professionals");

      processEsteticaData(categoryServices);
    } else {
      setEsteticaData([]);
    }
  }, [allServicesData, getFilteredDateRange, categoryProfessionals]);

  return esteticaData;
}
