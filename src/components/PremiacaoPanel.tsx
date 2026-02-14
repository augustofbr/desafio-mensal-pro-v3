import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Award, CheckCircle, AlertCircle } from "lucide-react";
import { getCurrentMonthName } from "@/lib/utils";

interface PremiacaoPanelProps {
  hairData: any[];
  manicureData: any[];
  maquiagemData: any[];
  loading: boolean;
}

const PREMIACAO_CONFIG = {
  cabelo: {
    label: "Cabelo",
    premio: 300,
    minimoClientes: 60,
  },
  unhas: {
    label: "Unhas",
    premio: 200,
    minimoClientes: 50,
  },
  maquiagem: {
    label: "Make",
    premio: 200,
    minimoClientes: 40,
  },
};

export default function PremiacaoPanel({ hairData, manicureData, maquiagemData, loading }: PremiacaoPanelProps) {
  const currentMonth = getCurrentMonthName();

  const getCategoryWinner = (data: any[], minimoClientes: number) => {
    if (!data || data.length === 0) return null;

    const leader = data[0];
    const uniqueClients = leader.uniqueClientDays || 0;
    const qualified = uniqueClients >= minimoClientes;

    return {
      professional: leader.professional,
      points: leader.points,
      uniqueClients,
      qualified,
    };
  };

  const hairWinner = getCategoryWinner(hairData, PREMIACAO_CONFIG.cabelo.minimoClientes);
  const manicureWinner = getCategoryWinner(manicureData, PREMIACAO_CONFIG.unhas.minimoClientes);
  const maquiagemWinner = getCategoryWinner(maquiagemData, PREMIACAO_CONFIG.maquiagem.minimoClientes);

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
    config: typeof PREMIACAO_CONFIG.cabelo,
    winner: ReturnType<typeof getCategoryWinner>,
    colorScheme: { bg: string; border: string; text: string; badge: string; icon: string }
  ) => (
    <div className={`rounded-lg border-2 ${colorScheme.border} ${colorScheme.bg} p-4`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Award className={`h-5 w-5 ${colorScheme.icon}`} />
          <h4 className="font-semibold text-gray-800">{config.label}</h4>
        </div>
        <span className={`text-sm font-bold px-3 py-1 rounded-full ${colorScheme.badge}`}>
          Mín. {config.minimoClientes} clientes
        </span>
      </div>

      {winner ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-gray-900">{winner.professional}</p>
              <p className="text-sm text-gray-600">{winner.points} pontos</p>
            </div>
            {winner.qualified ? (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Qualificado</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-amber-600">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Faltam {config.minimoClientes - winner.uniqueClients} atendimentos</span>
              </div>
            )}
          </div>
          <div className="text-xs text-gray-500">
            Clientes únicas: {winner.uniqueClients} / {config.minimoClientes} (min.)
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500">Nenhum profissional com pontuação nesta categoria no mês de {currentMonth}.</p>
      )}
    </div>
  );

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
