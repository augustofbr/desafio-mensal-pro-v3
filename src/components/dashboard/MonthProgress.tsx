import React from 'react';
import { Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MonthProgressProps {
  workedDays: number | null | undefined;
  remainingDays: number | null | undefined;
  totalDays: number | null | undefined;
  className?: string;
}

const MonthProgress: React.FC<MonthProgressProps> = ({ 
  workedDays, 
  remainingDays, 
  totalDays, 
  className 
}) => {
  return (
    <Card className={cn("", className)}>
      <CardContent className="p-4">
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Calendar className="h-4 w-4 text-gray-500" />
            <h3 className="text-sm font-medium text-gray-600">Progresso do Mês (Dias Úteis)</h3>
          </div>
          <div className="flex justify-around items-baseline text-center">
            <div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {workedDays ?? '...'}
              </p>
              <p className="text-xs text-gray-500">Trabalhados</p>
            </div>
            <div className="border-l border-gray-200 h-12"></div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {remainingDays ?? '...'}
              </p>
              <p className="text-xs text-gray-500">Restantes</p>
            </div>
            <div className="border-l border-gray-200 h-12"></div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {totalDays ?? '...'}
              </p>
              <p className="text-xs text-gray-500">Total no Mês</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthProgress;