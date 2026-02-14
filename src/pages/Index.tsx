
import { Card } from "@/components/ui/card";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DataRankings from "@/components/dashboard/DataRankings";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import PremiacaoPanel from "@/components/PremiacaoPanel";
import DateFilter from "@/components/DateFilter";
import MonthProgress from "@/components/dashboard/MonthProgress";
import { EdgeFunctionProcessor } from "@/components/dashboard/EdgeFunctionProcessor";
import { DateFilterProvider, useDateFilter } from "@/contexts/DateFilterContext";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useMonthProgress } from "@/hooks/useMonthProgress";
import { useEffect, useState } from "react";

function DashboardContent() {
  const {
    hairData,
    manicureData,
    esteticaData,
    maquiagemData,
    lastUpdate,
    lastServiceDate,
    loading,
    refreshData,
    selectProfessional,
    professionalDetails
  } = useDashboardData();

  const { workedDays, remainingDays, totalDays } = useMonthProgress();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const { getFilteredDateRange } = useDateFilter();

  useEffect(() => {
    setShowDetails(!!professionalDetails);
  }, [professionalDetails]);

  const handleSelectProfessional = (professional: string, category: string) => {
    setSelectedCategory(category);
    selectProfessional(professional, category);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    selectProfessional(null, null);
  };

  const getDataPeriodFromFilter = (): string => {
    const range = getFilteredDateRange();
    if (!range.startDate || !range.endDate) {
      return "Período não disponível";
    }

    const formatDate = (dateStr: string) => {
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
    };

    return `De ${formatDate(range.startDate)} até ${formatDate(range.endDate)}`;
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <EdgeFunctionProcessor
        refreshData={refreshData}
      />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-6">
          <img
            src="/lovable-uploads/0cb6b226-2d51-4078-9b78-b6565c728721.png"
            alt="Studio X - Salão de Beleza & Estética"
            className="h-24 md:h-28 mb-2"
          />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center">Desafio do Profissional Parceiro - V3</h1>
          <p className="text-lg md:text-xl text-gray-600 text-center mt-2">
            {getDataPeriodFromFilter()}
          </p>
        </div>

        <DateFilter />

        <MonthProgress
          workedDays={workedDays}
          remainingDays={remainingDays}
          totalDays={totalDays}
          className="mb-6"
        />

        <DashboardHeader
          lastUpdate={lastUpdate}
          loading={loading}
        />

        <PremiacaoPanel
          hairData={hairData}
          manicureData={manicureData}
          esteticaData={esteticaData}
          maquiagemData={maquiagemData}
          loading={loading}
        />

        <div className="grid grid-cols-1 gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-6">
              <DataRankings
                hairData={hairData}
                manicureData={manicureData}
                esteticaData={esteticaData}
                maquiagemData={maquiagemData}
                loading={loading}
                onSelectProfessional={handleSelectProfessional}
                professionalDetails={professionalDetails}
                selectedCategory={selectedCategory || ""}
                showDetails={showDetails}
                onCloseDetails={handleCloseDetails}
              />
            </div>

            <div className="lg:col-span-2">
              {loading ? (
                <Card className="p-6">
                  <div className="flex justify-center items-center h-64">
                    <p className="text-gray-500 text-lg">Carregando dados...</p>
                  </div>
                </Card>
              ) : (
                <DashboardCharts
                  hairData={hairData}
                  manicureData={manicureData}
                  esteticaData={esteticaData}
                  maquiagemData={maquiagemData}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Index = () => {
  return (
    <DateFilterProvider>
      <DashboardContent />
    </DateFilterProvider>
  );
}

export default Index;
