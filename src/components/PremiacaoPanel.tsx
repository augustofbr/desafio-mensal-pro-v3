import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Award, CheckCircle, AlertCircle } from "lucide-react";
import { getCurrentMonthName } from "@/lib/utils";

interface PremiacaoPanelProps {
  hairData: any[];
  manicureData: any[];
  esteticaData: any[];
  maquiagemData: any[];
  loading: boolean;
}

const PREMIACAO_CONFIG = {
  cabelo: {
    label: "Cabelo",
    premio: 300,
    minimo: 60,
    type: 'clients' as const,
  },
  unhas: {
    label: "Unhas",
    premio: 200,
    minimo: 50,
    type: 'clients' as const,
  },
  estetica: {
    label: "Estética",
    premio: 200,
    minimo: 5000,
    type: 'revenue' as const,
  },
  maquiagem: {
    label: "Make",
    premio: 200,
    minimo: 25,
    type: 'services' as const,
  },
};

type CategoryConfig = typeof PREMIACAO_CONFIG[keyof typeof PREMIACAO_CONFIG];

export default function PremiacaoPanel({ hairData, manicureData, esteticaData, maquiagemData, loading }: PremiacaoPanelProps) {
  const currentMonth = getCurrentMonthName();

  const getCategoryWinner = (data: any[], config: CategoryConfig) => {
    if (!data || data.length === 0) return null;

    const leader = data[0];

    if (config.type === 'revenue') {
      const totalRevenue = leader.totalRevenue || 0;
      const revenuePercentage = leader.revenuePercentage || 0;
      const qualified = totalRevenue >= config.minimo;

      return {
        professional: leader.professional,
        points: leader.points,
        totalRevenue,
        revenuePercentage,
        qualified,
        type: 'revenue' as const,
      };
    } else if (config.type === 'services') {
      const totalServices = leader.totalServices || 0;
      const qualified = totalServices >= config.minimo;

      return {
        professional: leader.professional,
        points: leader.points,
        totalServices,
        qualified,
        type: 'services' as const,
      };
    } else {
      const uniqueClients = leader.uniqueClientDays || 0;
      const qualified = uniqueClients >= config.minimo;

      return {
        professional: leader.professional,
        points: leader.points,
        uniqueClients,
        qualified,
        type: 'clients' as const,
      };
    }
  };

  const hairWinner = getCategoryWinner(hairData, PREMIACAO_CONFIG.cabelo);
  const manicureWinner = getCategoryWinner(manicureData, PREMIACAO_CONFIG.unhas);
  const esteticaWinner = getCategoryWinner(esteticaData, PREMIACAO_CONFIG.estetica);
  const maquiagemWinner = getCategoryWinner(maquiagemData, PREMIACAO_CONFIG.maquiagem);

  if (loading) {
    return (
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-32">
            <p className="text-gray-500 text-lg">Carregando dados...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderCategoryAward = (
    config: CategoryConfig,
    winner: ReturnType<typeof getCategoryWinner>,
    colorScheme: { bg: string; border: string; text: string; badge: string; icon: string }
  ) => {
    const getMinimumLabel = () => {
      if (config.type === 'revenue') {
        return `Meta: R$ ${config.minimo.toLocaleString('pt-BR')}`;
      } else if (config.type === 'services') {
        return `Mín. ${config.minimo} serviços`;
      } else {
        return `Mín. ${config.minimo} clientes`;
      }
    };

    const getPointsDisplay = () => {
      if (!winner) return '';
      if (winner.type === 'revenue') {
        return `${winner.revenuePercentage}% da meta`;
      }
      return `${winner.points} pontos`;
    };

    const getQualificationStatus = () => {
      if (!winner) return null;

      if (winner.qualified) {
        return (
          <div className="flex items-center gap-1 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm font-medium">Qualificado</span>
          </div>
        );
      }

      if (winner.type === 'revenue') {
        const percentAchieved = winner.revenuePercentage;
        const percentRemaining = Math.round((100 - percentAchieved) * 10) / 10;
        return (
          <div className="flex items-center gap-1 text-amber-600">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm font-medium">
              {percentAchieved}% alcançado | Faltam {percentRemaining}%
            </span>
          </div>
        );
      } else if (winner.type === 'services') {
        return (
          <div className="flex items-center gap-1 text-amber-600">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm font-medium">Faltam {config.minimo - winner.totalServices} serviços</span>
          </div>
        );
      } else {
        return (
          <div className="flex items-center gap-1 text-amber-600">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm font-medium">Faltam {config.minimo - winner.uniqueClients} atendimentos</span>
          </div>
        );
      }
    };

    const getProgressDetails = () => {
      if (!winner) return '';
      if (winner.type === 'revenue') {
        return `${winner.revenuePercentage}% da meta de faturamento mínimo`;
      } else if (winner.type === 'services') {
        return `Serviços realizados: ${winner.totalServices} / ${config.minimo} (min.)`;
      } else {
        return `Clientes únicas: ${winner.uniqueClients} / ${config.minimo} (min.)`;
      }
    };

    return (
      <div className={`rounded-lg border-2 ${colorScheme.border} ${colorScheme.bg} p-4`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Award className={`h-5 w-5 ${colorScheme.icon}`} />
            <h4 className="font-semibold text-gray-800">{config.label}</h4>
          </div>
          <span className={`text-sm font-bold px-3 py-1 rounded-full ${colorScheme.badge}`}>
            {getMinimumLabel()}
          </span>
        </div>

        {winner ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-gray-900">{winner.professional}</p>
                <p className="text-sm text-gray-600">{getPointsDisplay()}</p>
              </div>
              {getQualificationStatus()}
            </div>
            <div className="text-xs text-gray-500">
              {getProgressDetails()}
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Nenhum profissional com pontuação nesta categoria no mês de {currentMonth}.</p>
        )}
      </div>
    );
  };

  return (
    <Card className="mb-6 border-2 border-yellow-300 bg-gradient-to-r from-yellow-50 to-amber-50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-600" />
          <CardTitle className="text-xl">Painel de Premiação</CardTitle>
        </div>
        <CardDescription>
          Premiação mensal para os profissionais destaque de {currentMonth}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {renderCategoryAward(
            PREMIACAO_CONFIG.cabelo,
            hairWinner,
            {
              bg: "bg-blue-50",
              border: "border-blue-200",
              text: "text-blue-700",
              badge: "bg-blue-100 text-blue-700",
              icon: "text-blue-600",
            }
          )}
          {renderCategoryAward(
            PREMIACAO_CONFIG.unhas,
            manicureWinner,
            {
              bg: "bg-pink-50",
              border: "border-pink-200",
              text: "text-pink-700",
              badge: "bg-pink-100 text-pink-700",
              icon: "text-pink-600",
            }
          )}
          {renderCategoryAward(
            PREMIACAO_CONFIG.estetica,
            esteticaWinner,
            {
              bg: "bg-orange-50",
              border: "border-orange-200",
              text: "text-orange-700",
              badge: "bg-orange-100 text-orange-700",
              icon: "text-orange-600",
            }
          )}
          {renderCategoryAward(
            PREMIACAO_CONFIG.maquiagem,
            maquiagemWinner,
            {
              bg: "bg-rose-50",
              border: "border-rose-200",
              text: "text-rose-700",
              badge: "bg-rose-100 text-rose-700",
              icon: "text-rose-600",
            }
          )}
        </div>
      </CardContent>
    </Card>
  );
}
