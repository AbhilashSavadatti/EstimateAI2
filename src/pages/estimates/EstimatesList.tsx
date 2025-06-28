import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  PlusIcon, 
  MoreHorizontalIcon, 
  FileTextIcon, 
  CheckCircle2Icon, 
  ClockIcon,
  XCircleIcon,
  ArchiveIcon,
  PencilIcon,
  TrashIcon,
  Copy,
  Mail,
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { useEstimates } from '@/hooks/use-estimates';
import { ESTIMATE_STATUS } from '@/lib/constants';
import { Estimate } from '@/lib/api';
import { Input } from '@/components/ui/input';

const EstimatesList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    estimates, 
    isLoadingEstimates, 
    estimatesError,
    deleteEstimate,
    isDeleting,
    refetchEstimates
  } = useEstimates();
  
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const filteredEstimates = React.useMemo(() => {
    if (!estimates) return [];
    
    return estimates.filter(estimate => 
      estimate.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      estimate.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      estimate.location_zipcode?.includes(searchQuery)
    );
  }, [estimates, searchQuery]);
  
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
  
  const getStatusBadge = (status: Estimate['status']) => {
    switch (status) {
      case ESTIMATE_STATUS.DRAFT:
        return <Badge variant="outline">Draft</Badge>;
      case ESTIMATE_STATUS.PENDING:
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>;
      case ESTIMATE_STATUS.ACCEPTED:
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Accepted</Badge>;
      case ESTIMATE_STATUS.REJECTED:
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
      case ESTIMATE_STATUS.ARCHIVED:
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Archived</Badge>;
      default:
        return null;
    }
  };
  
  const getStatusIcon = (status: Estimate['status']) => {
    switch (status) {
      case ESTIMATE_STATUS.DRAFT:
        return <FileTextIcon className="h-4 w-4 text-gray-500" />;
      case ESTIMATE_STATUS.PENDING:
        return <ClockIcon className="h-4 w-4 text-amber-500" />;
      case ESTIMATE_STATUS.ACCEPTED:
        return <CheckCircle2Icon className="h-4 w-4 text-green-500" />;
      case ESTIMATE_STATUS.REJECTED:
        return <XCircleIcon className="h-4 w-4 text-red-500" />;
      case ESTIMATE_STATUS.ARCHIVED:
        return <ArchiveIcon className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };
  
  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteEstimate(id);
      } catch (error) {
        console.error('Error deleting estimate:', error);
      }
    }
  };
  
  React.useEffect(() => {
    if (estimatesError) {
      toast({
        title: 'Error loading estimates',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  }, [estimatesError, toast]);

  return (
    <DashboardLayout>
      <div className="container px-4 py-8 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Estimates</h1>
            <p className="text-muted-foreground mt-1">
              Manage and create your project estimates
            </p>
          </div>
          <Button 
            onClick={() => navigate('/estimates/create')}
            className="mt-4 md:mt-0"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Estimate
          </Button>
        </div>
        
        <div className="mb-6">
          <Input
            placeholder="Search estimates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>

        {isLoadingEstimates ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : filteredEstimates.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <FileTextIcon className="h-6 w-6 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium">No estimates found</h3>
            <p className="text-muted-foreground mt-1 mb-6">
              {estimates?.length ? 'Try adjusting your search' : 'Create your first estimate to get started'}
            </p>
            {!estimates?.length && (
              <Button 
                onClick={() => navigate('/estimates/create')}
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Estimate
              </Button>
            )}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Title</TableHead>
                  <TableHead className="hidden md:table-cell">Client</TableHead>
                  <TableHead className="hidden lg:table-cell">Date</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEstimates.map((estimate) => (
                  <TableRow key={estimate.id}>
                    <TableCell 
                      className="font-medium cursor-pointer"
                      onClick={() => navigate(`/estimates/${estimate.id}`)}
                    >
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(estimate.status)}
                        <span>{estimate.title}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {estimate.client_name || 'No client'}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground">
                      {formatDate(estimate.created_at)}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {getStatusBadge(estimate.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(estimate.total_cost)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontalIcon className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => navigate(`/estimates/${estimate.id}`)}>
                            <FileTextIcon className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/estimates/${estimate.id}/edit`)}>
                            <PencilIcon className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/estimates/create?duplicate=${estimate.id}`)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/estimates/${estimate.id}/send`)}>
                            <Mail className="h-4 w-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDelete(estimate.id, estimate.title)}
                            disabled={isDeleting}
                            className="text-red-600"
                          >
                            <TrashIcon className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EstimatesList;