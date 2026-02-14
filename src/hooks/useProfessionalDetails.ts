
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { convertDateFormat } from "@/lib/utils";
import { useDateFilter } from "@/contexts/DateFilterContext";
import { filterDataByDateRange } from "@/lib/dateUtils";

export function useProfessionalDetails() {
  const [selectedProfessional, setSelectedProfessional] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [professionalDetails, setProfessionalDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { getFilteredDateRange } = useDateFilter();

  const fetchProfessionalDetails = useCallback(async (professional: string, category: string | null) => {
    if (!professional) {
      setProfessionalDetails(null);
      return;
    }

    try {
      setLoading(true);
      
      // Fetch all services data for this professional
      const { data: servicesData, error: servicesError } = await supabase
        .from('trinks_services')
        .select('*')
        .eq('professional', professional);

      if (servicesError) {
        console.error("Error fetching professional services:", servicesError);
        throw servicesError;
      }

      if (servicesData && servicesData.length > 0) {
        // Get filtered date range from context
        const dateRange = getFilteredDateRange();
        
        // Filter data by date range and correct category
        let filteredData = filterDataByDateRange(servicesData, dateRange);
        
        if (category) {
          if (category === "Serviços de estética facial.") {
            // For estética category, include facial, corporal, depilation and eyebrow services
            filteredData = filteredData.filter(service => {
              const serviceCategory = service.category?.toLowerCase() || '';
              return serviceCategory.includes('depilação') || 
                     serviceCategory.includes('estética corporal') || 
                     serviceCategory.includes('estética facial') ||
                     serviceCategory.includes('sobrancelha');
            });
          } else {
            filteredData = filteredData.filter(service => service.category === category);
          }
        }

        console.log(`Filtered services for ${professional} in category ${category}:`, filteredData.length);

        // Create raw services data for chart
        let rawServices: any[] = [];
        
        if (category === "Tratamentos para Cabelo") {
          // Process hair data with new scoring rules (same pattern as manicure)
          const professionalData = {
            clientDays: new Set(),
            services: []
          };

          filteredData.forEach(service => {
            const serviceName = service.service_name || '';
            const serviceDate = service.service_date;
            const clientName = service.client_name;

            // Rule 1: Each service = 2 points (treatment bonus)
            rawServices.push({
              date: convertDateFormat(service.service_date),
              name: service.service_name || "Unknown Service",
              points: 2,
              type: 'treatment'
            });

            // Rule 2: Each unique client per day = 1 point
            if (clientName && clientName.trim()) {
              const clientDayKey = `${clientName.trim()}-${serviceDate}`;

              if (!professionalData.clientDays.has(clientDayKey)) {
                professionalData.clientDays.add(clientDayKey);
                rawServices.push({
                  date: convertDateFormat(service.service_date),
                  name: `Cliente: ${clientName}`,
                  points: 1,
                  type: 'client',
                  clientName: clientName
                });
              }
            }
          });
        } else if (category === "Manicure e Pedicure") {
          // Process manicure data with scoring rules
          const professionalData = {
            clientDays: new Set(),
            services: []
          };

          filteredData.forEach(service => {
            const serviceName = service.service_name || '';
            const serviceDate = service.service_date;
            const clientName = service.client_name;

            // Rule 1: "SPA dos Pés" = 2 points each
            if (serviceName === "SPA dos Pés") {
              rawServices.push({
                date: convertDateFormat(service.service_date),
                name: service.service_name,
                points: 2,
                type: 'spa'
              });
            }

            // Rule 2: Each unique client per day = 1 point
            if (clientName && clientName.trim()) {
              const clientDayKey = `${clientName.trim()}-${serviceDate}`;

              if (!professionalData.clientDays.has(clientDayKey)) {
                professionalData.clientDays.add(clientDayKey);
                rawServices.push({
                  date: convertDateFormat(service.service_date),
                  name: `Cliente: ${clientName}`,
                  points: 1,
                  type: 'client',
                  clientName: clientName
                });
              }
            }
          });
        } else if (category === "Serviços de estética facial.") {
          // Process estética data with new scoring rules
          const professionalData = { 
            clientDays: new Set(),
            services: []
          };
          
          filteredData.forEach(service => {
            const serviceName = service.service_name || '';
            const serviceDate = service.service_date;
            const clientName = service.client_name;
            
            // Rule 1: "Sobrancelha (Design*)" services = 1.5 points each
            const isSobrancelha = serviceName.toLowerCase().startsWith("design");
            if (isSobrancelha) {
              rawServices.push({
                date: convertDateFormat(service.service_date),
                name: service.service_name,
                points: 1.5,
                type: 'sobrancelha'
              });
            }
            
            // Rule 2: Each unique client per day = 1 point
            if (clientName && clientName.trim()) {
              const clientDayKey = `${clientName.trim()}-${serviceDate}`;
              
              if (!professionalData.clientDays.has(clientDayKey)) {
                professionalData.clientDays.add(clientDayKey);
                rawServices.push({
                  date: convertDateFormat(service.service_date),
                  name: `Cliente: ${clientName}`,
                  points: 1,
                  type: 'client',
                  clientName: clientName
                });
              }
            }
          });
        } else {
          // Hair treatment category logic remains unchanged
          rawServices = filteredData.map(service => ({
            date: convertDateFormat(service.service_date),
            name: service.service_name || "Unknown Service",
            points: category === "Tratamentos para Cabelo" && 
                    service.service_name && 
                    service.service_name.includes("Cronograma Capilar") && 
                    service.service_name.includes("pacote") ? 5 : 1
          }));
        }

        // Group services by name with new manicure rules
        let serviceSummary: any = {};
        let totalPoints = 0;
        
        if (category === "Tratamentos para Cabelo") {
          // Use the same logic as useHairTreatmentData for consistency
          const professionalData = {
            clientDays: new Set(),
            treatmentServices: 0,
            points: 0
          };

          filteredData.forEach(service => {
            const serviceName = service.service_name || "Unknown Service";
            const serviceDate = service.service_date;
            const clientName = service.client_name;

            // Rule 1: Each service = 2 points (treatment bonus)
            if (!serviceSummary[serviceName]) {
              serviceSummary[serviceName] = {
                name: serviceName,
                count: 0,
                points: 0,
                pointsPerService: 2
              };
            }
            serviceSummary[serviceName].count++;
            serviceSummary[serviceName].points += 2;
            professionalData.points += 2;
            professionalData.treatmentServices++;

            // Rule 2: Each unique client per day = 1 point
            if (clientName && clientName.trim()) {
              const clientDayKey = `${clientName.trim()}-${serviceDate}`;

              if (!professionalData.clientDays.has(clientDayKey)) {
                professionalData.clientDays.add(clientDayKey);

                const clientServiceName = `Cliente: ${clientName}`;
                if (!serviceSummary[clientServiceName]) {
                  serviceSummary[clientServiceName] = {
                    name: clientServiceName,
                    count: 0,
                    points: 0,
                    pointsPerService: 1
                  };
                }
                serviceSummary[clientServiceName].count++;
                serviceSummary[clientServiceName].points += 1;
                professionalData.points += 1;
              }
            }
          });

          totalPoints = professionalData.points;
        } else if (category === "Manicure e Pedicure") {
          // Use the same logic as useManicurePedicureData for consistency
          const professionalData = {
            clientDays: new Set(),
            spaServices: 0,
            points: 0
          };

          filteredData.forEach(service => {
            const serviceName = service.service_name || '';
            const serviceDate = service.service_date;
            const clientName = service.client_name;

            // Rule 1: "SPA dos Pés" = 2 points each
            if (serviceName === "SPA dos Pés") {
              if (!serviceSummary[serviceName]) {
                serviceSummary[serviceName] = {
                  name: serviceName,
                  count: 0,
                  points: 0,
                  pointsPerService: 2
                };
              }
              serviceSummary[serviceName].count++;
              serviceSummary[serviceName].points += 2;
              professionalData.points += 2;
              professionalData.spaServices++;
            }

            // Rule 2: Each unique client per day = 1 point
            if (clientName && clientName.trim()) {
              const clientDayKey = `${clientName.trim()}-${serviceDate}`;

              if (!professionalData.clientDays.has(clientDayKey)) {
                professionalData.clientDays.add(clientDayKey);

                const clientServiceName = `Cliente: ${clientName}`;
                if (!serviceSummary[clientServiceName]) {
                  serviceSummary[clientServiceName] = {
                    name: clientServiceName,
                    count: 0,
                    points: 0,
                    pointsPerService: 1
                  };
                }
                serviceSummary[clientServiceName].count++;
                serviceSummary[clientServiceName].points += 1;
                professionalData.points += 1;
              }
            }
          });

          totalPoints = professionalData.points;
        } else if (category === "Serviços de estética facial.") {
          // Use the same logic as useEsteticaData for consistency
          const professionalData = { 
            clientDays: new Set(),
            sobrancelhaServices: 0,
            points: 0
          };
          
          filteredData.forEach(service => {
            const serviceName = service.service_name || '';
            const serviceDate = service.service_date;
            const clientName = service.client_name;
            
            // Rule 1: "Sobrancelha (Design*)" services = 1.5 points each
            const isSobrancelha = serviceName.toLowerCase().startsWith("design");
            if (isSobrancelha) {
              if (!serviceSummary[serviceName]) {
                serviceSummary[serviceName] = { 
                  name: serviceName,
                  count: 0,
                  points: 0,
                  pointsPerService: 1.5
                };
              }
              serviceSummary[serviceName].count++;
              serviceSummary[serviceName].points += 1.5;
              professionalData.points += 1.5;
              professionalData.sobrancelhaServices++;
            }
            
            // Rule 2: Each unique client per day = 1 point
            if (clientName && clientName.trim()) {
              const clientDayKey = `${clientName.trim()}-${serviceDate}`;
              
              if (!professionalData.clientDays.has(clientDayKey)) {
                professionalData.clientDays.add(clientDayKey);
                
                const clientServiceName = `Cliente: ${clientName}`;
                if (!serviceSummary[clientServiceName]) {
                  serviceSummary[clientServiceName] = { 
                    name: clientServiceName,
                    count: 0,
                    points: 0,
                    pointsPerService: 1
                  };
                }
                serviceSummary[clientServiceName].count++;
                serviceSummary[clientServiceName].points += 1;
                professionalData.points += 1;
              }
            }
          });
          
          totalPoints = professionalData.points;
        } else {
          // Fallback for unknown categories
          serviceSummary = filteredData.reduce((acc: any, service: any) => {
            const serviceName = service.service_name || "Unknown Service";

            if (!acc[serviceName]) {
              acc[serviceName] = {
                name: serviceName,
                count: 0,
                points: 0,
                pointsPerService: 1,
                services: []
              };
            }

            acc[serviceName].count++;
            acc[serviceName].points += acc[serviceName].pointsPerService;

            return acc;
          }, {});

          totalPoints = Object.values(serviceSummary).reduce((sum: number, service: any) => sum + service.points, 0);
        }

        // Convert to array and sort by count
        const servicesArray = Object.values(serviceSummary)
          .filter((service: any) => service.pointsPerService > 0)  // Only include services that contribute points
          .sort((a: any, b: any) => b.count - a.count);
        
        // Calculate category-specific summary data
        let summaryData = {};
        
        if (category === "Tratamentos para Cabelo") {
          // Hair treatment summary - treatments + unique clients
          const treatmentServices = servicesArray.filter(s => !s.name.startsWith("Cliente:"));
          const clientServices = servicesArray.filter(s => s.name.startsWith("Cliente:"));

          summaryData = {
            treatmentCount: treatmentServices.reduce((sum: number, s: any) => sum + s.count, 0),
            treatmentPoints: treatmentServices.reduce((sum: number, s: any) => sum + s.points, 0),
            hairUniqueClients: clientServices.length,
            hairClientPoints: clientServices.reduce((sum: number, s: any) => sum + s.points, 0)
          };
        } else if (category === "Manicure e Pedicure") {
          // Manicure summary
          const spaServices = servicesArray.find(s => s.name === "SPA dos Pés");
          const clientServices = servicesArray.filter(s => s.name.startsWith("Cliente:"));
          
          summaryData = {
            spaCount: spaServices?.count || 0,
            spaPoints: spaServices?.points || 0,
            manicureUniqueClients: clientServices.length,
            manicureClientPoints: clientServices.reduce((sum, s) => sum + s.points, 0)
          };
        } else if (category === "Serviços de estética facial.") {
          // Estética summary
          const sobrancelhaServices = servicesArray.filter(s => 
            s.name.toLowerCase().startsWith("design")
          );
          const clientServices = servicesArray.filter(s => s.name.startsWith("Cliente:"));
          
          summaryData = {
            sobrancelhaCount: sobrancelhaServices.reduce((sum, s) => sum + s.count, 0),
            sobrancelhaPoints: sobrancelhaServices.reduce((sum, s) => sum + s.points, 0),
            esteticaUniqueClients: clientServices.length,
            esteticaClientPoints: clientServices.reduce((sum, s) => sum + s.points, 0)
          };
        }

        const details = {
          professional,
          services: servicesArray,
          rawServices: rawServices,  // Add raw services for chart
          totalServices: servicesArray.reduce((sum: number, service: any) => sum + service.count, 0),
          totalPoints: totalPoints,
          category: category,
          summary: summaryData
        };

        console.log("Professional details:", details);
        setProfessionalDetails(details);
      } else {
        setProfessionalDetails({
          professional,
          services: [],
          rawServices: [],
          totalServices: 0,
          totalPoints: 0,
          category: category,
          summary: {}
        });
      }
    } catch (error: any) {
      console.error("Error fetching professional details:", error);
      toast({
        title: "Erro ao carregar detalhes",
        description: "Não foi possível recuperar informações do profissional.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast, getFilteredDateRange]);

  const selectProfessional = useCallback((professional: string | null, category: string | null) => {
    setSelectedProfessional(professional);
    setSelectedCategory(category);
    if (professional) {
      fetchProfessionalDetails(professional, category);
    } else {
      setProfessionalDetails(null);
    }
  }, [fetchProfessionalDetails]);

  return {
    selectedProfessional,
    selectedCategory,
    professionalDetails,
    loading,
    selectProfessional
  };
}
