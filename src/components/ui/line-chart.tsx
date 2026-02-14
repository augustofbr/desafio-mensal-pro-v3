
import * as React from "react";
import { Line, LineChart as RechartsLineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface LineChartProps {
  data: any;
  options?: any;
  showEndLabels?: boolean;
  showEnhancedTooltips?: boolean;
}

export function LineChart({ data, options, showEndLabels = false, showEnhancedTooltips = false }: LineChartProps) {
  const config = React.useMemo(() => {
    const colors = [
      { color: "#2563eb" }, // blue-600
      { color: "#db2777" }, // pink-600
      { color: "#16a34a" }, // green-600
      { color: "#ea580c" }, // orange-600
      { color: "#9333ea" }, // purple-600
      { color: "#e11d48" }, // rose-600
      { color: "#0891b2" }, // cyan-600
      { color: "#854d0e" }, // amber-600
    ];

    // Create config for each dataset
    return data.datasets?.reduce(
      (acc: Record<string, any>, dataset: any, i: number) => {
        const id = dataset.label || `dataset-${i}`;
        return {
          ...acc,
          [id]: colors[i % colors.length],
        };
      },
      {}
    );
  }, [data]);

  // Transform data to Recharts format
  const chartData = React.useMemo(() => {
    if (!data?.labels || !data?.datasets) {
      return [];
    }

    return data.labels.map((label: string, i: number) => ({
      name: label,
      index: i, // Add index for end label positioning
      ...data.datasets.reduce((acc: Record<string, any>, dataset: any) => {
        const id = dataset.label || `dataset-${dataset.index || 0}`;
        return {
          ...acc,
          [id]: dataset.data[i] || 0,
        };
      }, {}),
    }));
  }, [data]);

  // Custom label component for end-of-line labels
  const renderEndLabel = (props: any) => {
    const { payload, x, y, value, dataKey } = props;
    const lastIndex = chartData.length - 1;
    const currentIndex = payload?.index || 0;
    
    // Only show label on the last data point
    if (currentIndex !== lastIndex || !showEndLabels) {
      return null;
    }
    
    // Get professional name from dataKey
    const professionalName = dataKey || 'Unknown';
    
    return (
      <text 
        x={x + 8} 
        y={y - 5} 
        fill="currentColor" 
        fontSize={isMobile ? 10 : 12}
        fontWeight="500"
        className="fill-foreground"
      >
        {professionalName}
      </text>
    );
  };

  // Enhanced tooltip content
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || payload.length === 0) {
      return null;
    }

    return (
      <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
        <p className="font-medium text-foreground mb-2">
          Dia {label}
        </p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-muted-foreground">
                {entry.dataKey}:
              </span>
              <span className="text-sm font-medium text-foreground">
                {entry.value} pontos
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Detect if we're on mobile/tablet
  const isMobile = React.useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  }, []);

  const isTablet = React.useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth >= 768 && window.innerWidth < 1024;
  }, []);

  return (
    <div className="w-full h-full">
      <ChartContainer config={config || {}}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart 
            data={chartData}
            margin={{ 
              top: isMobile ? 15 : 25, 
              right: showEndLabels ? (isMobile ? 80 : 120) : (isMobile ? 15 : 30), 
              left: isMobile ? 10 : 25, 
              bottom: isMobile ? 50 : 60 
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              axisLine={true}
              tickLine={true}
              tick={{ fontSize: isMobile ? 8 : (isTablet ? 10 : 12) }}
              interval={isMobile ? 1 : 0}
              angle={isMobile ? -90 : -45}
              textAnchor="end"
              height={isMobile ? 50 : 60}
            />
            <YAxis 
              domain={[0, 'dataMax']}
              axisLine={true}
              tickLine={true}
              tick={{ fontSize: isMobile ? 8 : (isTablet ? 10 : 12) }}
              width={isMobile ? 30 : 50}
            />
            {showEnhancedTooltips ? (
              <Tooltip content={<CustomTooltip />} />
            ) : (
              <ChartTooltip content={<ChartTooltipContent />} />
            )}
            <Legend 
              verticalAlign={options?.plugins?.legend?.position === "bottom" ? "bottom" : "top"}
              wrapperStyle={{ 
                paddingTop: '10px',
                paddingBottom: '10px',
                fontSize: isMobile ? '11px' : '13px',
                fontWeight: '500'
              }}
              iconSize={isMobile ? 10 : 14}
              itemStyle={{ 
                marginRight: isMobile ? '8px' : '16px',
                fontWeight: '500'
              }}
            />
            {data.datasets?.map((dataset: any, i: number) => (
              <Line
                key={`line-${i}`}
                type="monotone"
                dataKey={dataset.label || `dataset-${i}`}
                stroke={dataset.borderColor || config[dataset.label || `dataset-${i}`]?.color}
                activeDot={{ r: isMobile ? 5 : 8, strokeWidth: 2 }}
                strokeWidth={isMobile ? 2 : 3}
                dot={{ strokeWidth: isMobile ? 1 : 2, r: isMobile ? 2 : 4 }}
              >
                {showEndLabels && (
                  <LabelList 
                    content={renderEndLabel}
                    position="insideTopRight"
                  />
                )}
              </Line>
            ))}
          </RechartsLineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
