import { useState, useEffect } from "react";
import { convertDateFormat } from "@/lib/utils";
import { useDateFilter } from "@/contexts/DateFilterContext";
import { filterDataByDateRange } from "@/lib/dateUtils";

export function useMaquiagemData(allServicesData: any[], categoryProfessionals: string[]) {
  const [maquiagemData, setMaquiagemData] = useState<any[]>([]);
  const { getFilteredDateRange } = useDateFilter();

  const processMaquiagemData = (data: any[]) => {
    if (!Array.isArray(data)) {
      console.error("Invalid maquiagem data:", data);
      setMaquiagemData([]);
      return;
    }

    console.log("Processing maquiagem data:", data.length, "services");

    const professionalPoints = data.reduce((acc: any, service: any) => {
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
        };
      }

      // Pontuação: 1 ponto por cliente único/dia (sem serviço bônus por enquanto)
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
      uniqueClientDays: prof.clientDays.size
    }));

    const sortedData = cleanedData.sort(
      (a: any, b: any) => b.points - a.points
    );

    console.log("Final processed maquiagem data:", sortedData);
    setMaquiagemData(sortedData);
  };

  useEffect(() => {
    if (allServicesData && allServicesData.length > 0 && categoryProfessionals.length > 0) {
      const dateRange = getFilteredDateRange();
      const filteredData = filterDataByDateRange(allServicesData, dateRange);

      // Filter services by professionals in this category
      const categoryServices = filteredData.filter(
        service => categoryProfessionals.includes(service.professional)
      );

      console.log("Maquiagem services found:", categoryServices.length, "from", categoryProfessionals.length, "professionals");

      processMaquiagemData(categoryServices);
    } else {
      setMaquiagemData([]);
    }
  }, [allServicesData, getFilteredDateRange, categoryProfessionals]);

  return maquiagemData;
}
