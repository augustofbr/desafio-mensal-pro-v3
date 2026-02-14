
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDateFilter } from "@/contexts/DateFilterContext";
import { format } from "date-fns";

interface CronogramaSalesProps {
  data: any[];
  loading: boolean;
}

export default function CronogramaSales({ data, loading }: CronogramaSalesProps) {
  const { getFilteredDateRange } = useDateFilter();

  const getPeriodLabel = () => {
    const range = getFilteredDateRange();
    if (!range.startDate || !range.endDate) {
      return "período atual";
    }
    
    // Convert YYYY-MM-DD to DD/MM/YYYY for display
    const formatDate = (dateStr: string) => {
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
    };
    
    return `período de ${formatDate(range.startDate)} a ${formatDate(range.endDate)}`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Venda de Cronograma Capilar (pacote)</CardTitle>
          <CardDescription>
            Listagem de vendas do serviço Cronograma Capilar (pacote) no {getPeriodLabel()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-32">
            <p className="text-gray-500 text-lg">Carregando dados...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Venda de Cronograma Capilar (pacote)</CardTitle>
          <CardDescription>
            Listagem de vendas do serviço Cronograma Capilar (pacote) no {getPeriodLabel()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhuma venda de Cronograma Capilar (pacote) registrada neste período.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Venda de Cronograma Capilar (pacote)</CardTitle>
        <CardDescription>
          Listagem de vendas do serviço Cronograma Capilar (pacote) no {getPeriodLabel()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Profissional</TableHead>
              <TableHead className="text-center">Quantidade Vendida</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.professional}>
                <TableCell className="font-medium">{item.professional}</TableCell>
                <TableCell className="text-center">{item.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
