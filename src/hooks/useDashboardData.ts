
import { useEffect } from "react";
import { useServicesData } from "./useServicesData";
import { useHairTreatmentData } from "./useHairTreatmentData";
import { useManicurePedicureData } from "./useManicurePedicureData";
import { useEsteticaData } from "./useEsteticaData";
import { useProfessionalDetails } from "./useProfessionalDetails";

export function useDashboardData() {
  const {
    loading: servicesLoading,
    lastUpdate,
    lastServiceDate,
    allServicesData,
    fetchServicesData
  } = useServicesData();

  const hairData = useHairTreatmentData(allServicesData);
  const manicureData = useManicurePedicureData(allServicesData);
  const esteticaData = useEsteticaData(allServicesData);

  const {
    selectedProfessional,
    selectedCategory,
    professionalDetails,
    loading: detailsLoading,
    selectProfessional
  } = useProfessionalDetails();

  // Fetch data on initial load
  useEffect(() => {
    fetchServicesData();
  }, [fetchServicesData]);

  // Combined loading state
  const loading = servicesLoading || detailsLoading;

  return {
    loading,
    lastUpdate,
    lastServiceDate,
    hairData,
    manicureData,
    esteticaData,
    refreshData: fetchServicesData,
    selectedProfessional,
    professionalDetails,
    selectProfessional
  };
}
