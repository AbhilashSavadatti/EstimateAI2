import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  BarChart3Icon,
  FileTextIcon,
  CalendarIcon,
  TrendingUpIcon
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface DashboardData {
  totalEstimates: number;
  pendingEstimates: number;
  acceptedEstimates: number;
  totalRevenue: number;
  winRate: number;
}

interface DashboardOverviewProps {
  data: DashboardData;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ data }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Estimate Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 rounded-full">
                  <FileTextIcon className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium">Total</span>
              </div>
              <div className="mt-2">
                <span className="text-2xl font-bold">{data.totalEstimates}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-50 rounded-full">
                  <CalendarIcon className="h-4 w-4 text-amber-600" />
                </div>
                <span className="text-sm font-medium">Pending</span>
              </div>
              <div className="mt-2">
                <span className="text-2xl font-bold">{data.pendingEstimates}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-50 rounded-full">
                <BarChart3Icon className="h-4 w-4 text-green-600" />
              </div>
              <span className="text-sm font-medium">Total Revenue</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold">{formatCurrency(data.totalRevenue)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Win Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-50 rounded-full">
                <TrendingUpIcon className="h-4 w-4 text-indigo-600" />
              </div>
              <span className="text-sm font-medium">{data.winRate}% of estimates accepted</span>
            </div>
            <div className="mt-3">
              <Progress value={data.winRate} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;