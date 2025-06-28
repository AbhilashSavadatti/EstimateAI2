import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  CheckCircle2Icon,
  CircleIcon,
  ClockIcon,
  FileIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface Estimate {
  id: string;
  title: string;
  client: string;
  amount: number;
  status: 'draft' | 'pending' | 'accepted' | 'rejected';
  date: string;
}

interface RecentEstimatesWidgetProps {
  estimates: Estimate[];
  onViewAll: () => void;
  onViewEstimate: (id: string) => void;
}

const RecentEstimatesWidget: React.FC<RecentEstimatesWidgetProps> = ({
  estimates,
  onViewAll,
  onViewEstimate,
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy');
  };

  const getStatusIcon = (status: Estimate['status']) => {
    switch (status) {
      case 'draft':
        return <FileIcon className="h-4 w-4 text-gray-500" />;
      case 'pending':
        return <ClockIcon className="h-4 w-4 text-amber-500" />;
      case 'accepted':
        return <CheckCircle2Icon className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <CircleIcon className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: Estimate['status']) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Accepted</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Estimates</CardTitle>
          <CardDescription>Your latest estimates and their status</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead className="hidden md:table-cell">Client</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="hidden lg:table-cell">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {estimates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No estimates yet. Create your first estimate!
                </TableCell>
              </TableRow>
            ) : (
              estimates.map((estimate) => (
                <TableRow 
                  key={estimate.id} 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => onViewEstimate(estimate.id)}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(estimate.status)}
                      <span className="truncate max-w-[120px] sm:max-w-none">
                        {estimate.title}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {estimate.client}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(estimate.amount)}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {getStatusBadge(estimate.status)}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">
                    {formatDate(estimate.date)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <Button 
          variant="ghost" 
          className="w-full"
          onClick={onViewAll}
        >
          View all estimates
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecentEstimatesWidget;