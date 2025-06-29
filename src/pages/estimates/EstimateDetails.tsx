import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useEstimates } from '@/hooks/use-estimates';
import { Estimate, MaterialItem, LaborItem } from '@/lib/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  ChevronLeftIcon,
  PencilIcon,
  TrashIcon,
  MoreHorizontalIcon,
  FileIcon,
  SendIcon,
  PrinterIcon,
  Copy,
  CheckCircle2Icon,
  XCircleIcon,
  Loader2Icon
} from 'lucide-react';
import { format } from 'date-fns';
import { ESTIMATE_STATUS } from '@/lib/constants';
import CostSummaryPanel from '@/components/estimates/CostSummaryPanel';

const EstimateDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [emailRecipient, setEmailRecipient] = useState('');
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  
  const { 
    getEstimate,
    getMaterials,
    getLaborItems,
    deleteEstimate,
    updateEstimate,
    exportPdf,
    sendEmail,
  } = useEstimates();
  
  // Fetch estimate data
  const { 
    data: estimate, 
    isLoading: isLoadingEstimate, 
    error: estimateError,
    refetch: refetchEstimate
  } = getEstimate(id || '');
  
  // Fetch materials
  const { 
    data: materials = [],
    isLoading: isLoadingMaterials
  } = getMaterials(id || '');
  
  // Fetch labor items
  const { 
    data: laborItems = [],
    isLoading: isLoadingLabor
  } = getLaborItems(id || '');
  
  // Handle errors
  useEffect(() => {
    if (estimateError) {
      toast({
        title: 'Error loading estimate',
        description: 'Please try again or contact support',
        variant: 'destructive',
      });
    }
  }, [estimateError, toast]);
  
  // Calculate totals
  const totals = React.useMemo(() => {
    if (!estimate || !materials || !laborItems) return null;
    
    const materialTotal = materials.reduce((sum, item) => sum + item.total_cost, 0);
    const laborTotal = laborItems.reduce((sum, item) => sum + item.total_cost, 0);
    const subtotal = materialTotal + laborTotal;
    const profitAmount = (subtotal * estimate.profit_margin) / 100;
    const total = subtotal + profitAmount;
    
    return {
      materialTotal,
      laborTotal,
      subtotal,
      profitAmount,
      total,
    };
  }, [estimate, materials, laborItems]);
  
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteEstimate(id || '');
      toast({
        title: 'Estimate deleted',
        description: 'The estimate has been deleted successfully',
      });
      navigate('/estimates');
    } catch (error) {
      console.error('Error deleting estimate:', error);
      toast({
        title: 'Deletion failed',
        description: 'There was an error deleting the estimate',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await exportPdf(id || '');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast({
        title: 'Export failed',
        description: 'There was an error exporting the estimate as PDF',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  const handleSendEmail = async () => {
    if (!emailRecipient || !id) return;
    
    setIsSending(true);
    try {
      await sendEmail({ estimateId: id, email: emailRecipient });
      setShowEmailDialog(false);
      setEmailRecipient('');
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: 'Sending failed',
        description: 'There was an error sending the estimate',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };
  
  const handleUpdateStatus = async (status: Estimate['status']) => {
    if (!estimate || !id) return;
    
    try {
      await updateEstimate({ id, data: { status } });
      refetchEstimate();
      toast({
        title: 'Status updated',
        description: `The estimate is now marked as ${status}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Update failed',
        description: 'There was an error updating the estimate status',
        variant: 'destructive',
      });
    }
  };
  
  const formatCurrency = (value: number = 0) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };
  
  const formatDate = (dateString: string = '') => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy');
  };
  
  const getStatusBadge = (status: Estimate['status'] = 'draft') => {
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
  
  if (isLoadingEstimate) {
    return (
      <DashboardLayout>
        <div className="container px-4 py-8 mx-auto">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/estimates')}
              className="mr-2"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Skeleton className="h-8 w-72" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-60 w-full" />
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  if (!estimate) {
    return (
      <DashboardLayout>
        <div className="container px-4 py-8 mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold">Estimate Not Found</h2>
            <p className="text-muted-foreground mt-2 mb-6">The estimate you're looking for doesn't exist or has been deleted.</p>
            <Button onClick={() => navigate('/estimates')}>
              Back to Estimates
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="container px-4 py-8 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/estimates')}
              className="mr-3"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                {estimate.title}
                <span className="ml-3">{getStatusBadge(estimate.status)}</span>
              </h1>
              <p className="text-muted-foreground mt-1">
                Created on {formatDate(estimate.created_at)}
                {estimate.client_name && ` for ${estimate.client_name}`}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <MoreHorizontalIcon className="h-4 w-4 mr-2" />
                  Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => navigate(`/estimates/create?duplicate=${id}`)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportPDF} disabled={isExporting}>
                  <PrinterIcon className="h-4 w-4 mr-2" />
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowEmailDialog(true)}>
                  <SendIcon className="h-4 w-4 mr-2" />
                  Email Estimate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {estimate.status === ESTIMATE_STATUS.DRAFT && (
                  <DropdownMenuItem onClick={() => handleUpdateStatus(ESTIMATE_STATUS.PENDING)}>
                    <CheckCircle2Icon className="h-4 w-4 mr-2" />
                    Mark as Pending
                  </DropdownMenuItem>
                )}
                {estimate.status === ESTIMATE_STATUS.PENDING && (
                  <>
                    <DropdownMenuItem onClick={() => handleUpdateStatus(ESTIMATE_STATUS.ACCEPTED)}>
                      <CheckCircle2Icon className="h-4 w-4 mr-2 text-green-500" />
                      Mark as Accepted
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleUpdateStatus(ESTIMATE_STATUS.REJECTED)}>
                      <XCircleIcon className="h-4 w-4 mr-2 text-red-500" />
                      Mark as Rejected
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="outline" onClick={() => navigate(`/estimates/${id}/edit`)}>
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the estimate "{estimate.title}". This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDelete} 
                    className="bg-red-600 hover:bg-red-700 text-white"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      'Delete Estimate'
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="labor">Labor</TabsTrigger>
            <TabsTrigger value="summary">Cost Summary</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Estimate Details</CardTitle>
                <CardDescription>
                  Basic information about this estimate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                    <p className="mt-1">{estimate.description || 'No description provided'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Client</h3>
                      <p className="mt-1">{estimate.client_name || 'No client'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                      <p className="mt-1">{estimate.location_zipcode || 'Not specified'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                      <p className="mt-1">{getStatusBadge(estimate.status)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Total Cost</h3>
                      <p className="mt-1 font-semibold">{formatCurrency(estimate.total_cost)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Materials</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {formatCurrency(totals?.materialTotal || 0)}
                  </div>
                  <p className="text-muted-foreground mt-1">{materials.length} items</p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full" onClick={() => setActiveTab('materials')}>
                    View Materials
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Labor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {formatCurrency(totals?.laborTotal || 0)}
                  </div>
                  <p className="text-muted-foreground mt-1">{laborItems.length} items</p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full" onClick={() => setActiveTab('labor')}>
                    View Labor
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Profit Margin</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {estimate.profit_margin}%
                  </div>
                  <p className="text-muted-foreground mt-1">
                    {formatCurrency(totals?.profitAmount || 0)}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full" onClick={() => setActiveTab('summary')}>
                    View Summary
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="materials">
            <Card>
              <CardHeader>
                <CardTitle>Materials List</CardTitle>
                <CardDescription>
                  All materials included in this estimate
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingMaterials ? (
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : materials.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No materials have been added to this estimate.
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Unit</TableHead>
                          <TableHead>Unit Cost</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {materials.map((material) => (
                          <TableRow key={material.id}>
                            <TableCell className="font-medium">{material.name}</TableCell>
                            <TableCell>{material.quantity}</TableCell>
                            <TableCell>{material.unit}</TableCell>
                            <TableCell>{formatCurrency(material.unit_cost)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(material.total_cost)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
                
                <div className="mt-6 flex justify-end">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="font-semibold flex justify-between text-lg">
                      <span>Materials Subtotal:</span>
                      <span className="ml-12">{formatCurrency(totals?.materialTotal)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="labor">
            <Card>
              <CardHeader>
                <CardTitle>Labor List</CardTitle>
                <CardDescription>
                  All labor costs included in this estimate
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingLabor ? (
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : laborItems.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No labor items have been added to this estimate.
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Description</TableHead>
                          <TableHead>Hours</TableHead>
                          <TableHead>Rate ($/hr)</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {laborItems.map((labor) => (
                          <TableRow key={labor.id}>
                            <TableCell className="font-medium">{labor.name}</TableCell>
                            <TableCell>{labor.hours}</TableCell>
                            <TableCell>{formatCurrency(labor.rate_per_hour)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(labor.total_cost)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
                
                <div className="mt-6 flex justify-end">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="font-semibold flex justify-between text-lg">
                      <span>Labor Subtotal:</span>
                      <span className="ml-12">{formatCurrency(totals?.laborTotal)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="summary">
            {totals && (
              <CostSummaryPanel
                materialTotal={totals.materialTotal}
                laborTotal={totals.laborTotal}
                subtotal={totals.subtotal}
                profitMargin={estimate.profit_margin}
                total={totals.total}
                onProfitMarginChange={() => {}} // Read-only in details view
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Email Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Estimate via Email</DialogTitle>
            <DialogDescription>
              Send this estimate to your client or other recipients.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="client@example.com"
                value={emailRecipient}
                onChange={(e) => setEmailRecipient(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmailDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSendEmail} 
              disabled={!emailRecipient || isSending}
              className="ml-2"
            >
              {isSending ? (
                <>
                  <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <SendIcon className="h-4 w-4 mr-2" />
                  Send Email
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default EstimateDetails;