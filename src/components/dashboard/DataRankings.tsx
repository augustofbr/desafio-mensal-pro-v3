
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProfessionalRanking from "@/components/ProfessionalRanking";
import { getCategoryDisplayName, CATEGORIES, isCategoryEnabled } from "@/lib/categoryDisplayNames";

interface DataRankingsProps {
  hairData: any[];
  manicureData: any[];
  esteticaData: any[];
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
  loading, 
  onSelectProfessional,
  professionalDetails,
  selectedCategory,
  showDetails,
  onCloseDetails
}: DataRankingsProps) {
  return (
    <div className="space-y-6">
      {isCategoryEnabled(CATEGORIES.HAIR_TREATMENTS) && (
        <Card>
          <CardHeader>
            <CardTitle>{getCategoryDisplayName(CATEGORIES.HAIR_TREATMENTS)}</CardTitle>
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
                onSelectProfessional={(professional) => onSelectProfessional(professional, CATEGORIES.HAIR_TREATMENTS)}
                professionalDetails={professionalDetails}
                selectedCategory={selectedCategory}
                showDetails={showDetails}
                onCloseDetails={onCloseDetails}
              />
            )}
          </CardContent>
        </Card>
      )}

      {isCategoryEnabled(CATEGORIES.MANICURE_PEDICURE) && (
        <Card>
          <CardHeader>
            <CardTitle>Manicure e Pedicure</CardTitle>
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
                onSelectProfessional={(professional) => onSelectProfessional(professional, CATEGORIES.MANICURE_PEDICURE)}
                professionalDetails={professionalDetails}
                selectedCategory={selectedCategory}
                showDetails={showDetails}
                onCloseDetails={onCloseDetails}
              />
            )}
          </CardContent>
        </Card>
      )}

      {isCategoryEnabled(CATEGORIES.ESTETICA) && (
        <Card>
          <CardHeader>
            <CardTitle>Estética</CardTitle>
            <CardDescription>
              Pontuação: Sobrancelhas (Design*) = 1,5 pontos + 1 ponto por cliente única atendida por dia
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
                onSelectProfessional={(professional) => onSelectProfessional(professional, CATEGORIES.ESTETICA)}
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
