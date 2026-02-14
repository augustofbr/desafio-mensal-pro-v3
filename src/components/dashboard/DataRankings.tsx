
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProfessionalRanking from "@/components/ProfessionalRanking";
import { getCategoryDisplayName, PROF_CATEGORIES, isCategoryEnabled } from "@/lib/categoryDisplayNames";

interface DataRankingsProps {
  hairData: any[];
  manicureData: any[];
  esteticaData: any[];
  maquiagemData: any[];
  loading: boolean;
  onSelectProfessional: (professional: string, category: string) => void;
  professionalDetails: any;
  selectedCategory: string;
  showDetails: boolean;
  onCloseDetails: () => void;
}

export default function DataRankings({
  hairData,
  manicureData,
  esteticaData,
  maquiagemData,
  loading,
  onSelectProfessional,
  professionalDetails,
  selectedCategory,
  showDetails,
  onCloseDetails
}: DataRankingsProps) {
  return (
    <div className="space-y-6">
      {isCategoryEnabled(PROF_CATEGORIES.CABELO) && (
        <Card>
          <CardHeader>
            <CardTitle>{getCategoryDisplayName(PROF_CATEGORIES.CABELO)}</CardTitle>
            <CardDescription>
              Pontuação: Tratamentos = 2 pontos + 1 ponto por cliente única atendida por dia
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <p className="text-gray-500 text-lg">Carregando dados...</p>
              </div>
            ) : (
              <ProfessionalRanking
                data={hairData}
                onSelectProfessional={(professional) => onSelectProfessional(professional, PROF_CATEGORIES.CABELO)}
                professionalDetails={professionalDetails}
                selectedCategory={selectedCategory}
                showDetails={showDetails}
                onCloseDetails={onCloseDetails}
              />
            )}
          </CardContent>
        </Card>
      )}

      {isCategoryEnabled(PROF_CATEGORIES.UNHAS) && (
        <Card>
          <CardHeader>
            <CardTitle>{getCategoryDisplayName(PROF_CATEGORIES.UNHAS)}</CardTitle>
            <CardDescription>
              Pontuação: SPA dos Pés = 2 pontos + 1 ponto por cliente única atendida por dia
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <p className="text-gray-500 text-lg">Carregando dados...</p>
              </div>
            ) : (
              <ProfessionalRanking
                data={manicureData}
                onSelectProfessional={(professional) => onSelectProfessional(professional, PROF_CATEGORIES.UNHAS)}
                professionalDetails={professionalDetails}
                selectedCategory={selectedCategory}
                showDetails={showDetails}
                onCloseDetails={onCloseDetails}
              />
            )}
          </CardContent>
        </Card>
      )}

      {isCategoryEnabled(PROF_CATEGORIES.MAQUIAGEM) && (
        <Card>
          <CardHeader>
            <CardTitle>{getCategoryDisplayName(PROF_CATEGORIES.MAQUIAGEM)}</CardTitle>
            <CardDescription>
              Pontuação: 1 ponto por serviço realizado
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <p className="text-gray-500 text-lg">Carregando dados...</p>
              </div>
            ) : (
              <ProfessionalRanking
                data={maquiagemData}
                onSelectProfessional={(professional) => onSelectProfessional(professional, PROF_CATEGORIES.MAQUIAGEM)}
                professionalDetails={professionalDetails}
                selectedCategory={selectedCategory}
                showDetails={showDetails}
                onCloseDetails={onCloseDetails}
              />
            )}
          </CardContent>
        </Card>
      )}

      {isCategoryEnabled(PROF_CATEGORIES.ESTETICA) && (
        <Card>
          <CardHeader>
            <CardTitle>{getCategoryDisplayName(PROF_CATEGORIES.ESTETICA)}</CardTitle>
            <CardDescription>
              Ranking por percentual de faturamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <p className="text-gray-500 text-lg">Carregando dados...</p>
              </div>
            ) : (
              <ProfessionalRanking
                data={esteticaData}
                onSelectProfessional={(professional) => onSelectProfessional(professional, PROF_CATEGORIES.ESTETICA)}
                professionalDetails={professionalDetails}
                selectedCategory={selectedCategory}
                showDetails={showDetails}
                onCloseDetails={onCloseDetails}
              />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
