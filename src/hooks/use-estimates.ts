import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, Estimate, MaterialItem, LaborItem } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

export const useEstimates = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [estimateInProgress, setEstimateInProgress] = useState<Partial<Estimate> | null>(null);

  // Get all estimates
  const {
    data: estimates,
    isLoading: isLoadingEstimates,
    error: estimatesError,
    refetch: refetchEstimates,
  } = useQuery({
    queryKey: ['estimates'],
    queryFn: () => api.estimates.getAll(),
  });

  // Get a single estimate by ID
  const getEstimate = (id: string) => {
    return useQuery({
      queryKey: ['estimate', id],
      queryFn: () => api.estimates.getById(id),
      enabled: !!id,
    });
  };

  // Get materials for an estimate
  const getMaterials = (estimateId: string) => {
    return useQuery({
      queryKey: ['materials', estimateId],
      queryFn: () => api.estimates.getMaterials(estimateId),
      enabled: !!estimateId,
    });
  };

  // Get labor items for an estimate
  const getLaborItems = (estimateId: string) => {
    return useQuery({
      queryKey: ['labor', estimateId],
      queryFn: () => api.estimates.getLaborItems(estimateId),
      enabled: !!estimateId,
    });
  };

  // Create new estimate
  const createMutation = useMutation({
    mutationFn: (data: Partial<Estimate>) => api.estimates.create(data),
    onSuccess: (newEstimate) => {
      queryClient.invalidateQueries({ queryKey: ['estimates'] });
      toast({
        title: 'Estimate created',
        description: `"${newEstimate.title}" has been created successfully.`,
      });
      setEstimateInProgress(null);
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to create estimate',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Update estimate
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Estimate> }) => 
      api.estimates.update(id, data),
    onSuccess: (updatedEstimate) => {
      queryClient.invalidateQueries({ queryKey: ['estimates'] });
      queryClient.invalidateQueries({ queryKey: ['estimate', updatedEstimate.id] });
      toast({
        title: 'Estimate updated',
        description: `"${updatedEstimate.title}" has been updated successfully.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to update estimate',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Delete estimate
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.estimates.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['estimates'] });
      toast({
        title: 'Estimate deleted',
        description: 'The estimate has been deleted successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to delete estimate',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Process text input with AI
  const processTextMutation = useMutation({
    mutationFn: (text: string) => api.ai.processText(text),
    onSuccess: (result) => {
      toast({
        title: 'Text processed',
        description: 'Your description has been processed successfully.',
      });
      return result;
    },
    onError: (error: Error) => {
      toast({
        title: 'Processing failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Export estimate as PDF
  const exportPdfMutation = useMutation({
    mutationFn: (estimateId: string) => api.estimates.exportPdf(estimateId),
    onSuccess: (result) => {
      // Open PDF in new tab or trigger download
      window.open(result.url, '_blank');
      toast({
        title: 'PDF exported',
        description: 'Your estimate has been exported as a PDF.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Export failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Send estimate via email
  const sendEmailMutation = useMutation({
    mutationFn: ({ estimateId, email }: { estimateId: string; email: string }) => 
      api.estimates.sendEmail(estimateId, email),
    onSuccess: () => {
      toast({
        title: 'Email sent',
        description: 'Your estimate has been sent successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to send email',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Calculate estimate totals
  const calculateTotals = (materials: MaterialItem[], laborItems: LaborItem[], profitMargin: number = 0) => {
    const materialTotal = materials.reduce((sum, item) => sum + item.total_cost, 0);
    const laborTotal = laborItems.reduce((sum, item) => sum + item.total_cost, 0);
    const subtotal = materialTotal + laborTotal;
    const profitAmount = (subtotal * profitMargin) / 100;
    const total = subtotal + profitAmount;
    
    return {
      materialTotal,
      laborTotal,
      subtotal,
      profitAmount,
      total,
    };
  };

  // Store estimate in progress for multistep form
  const storeEstimateInProgress = (data: Partial<Estimate>) => {
    setEstimateInProgress(prev => ({ ...prev, ...data }));
    return { ...estimateInProgress, ...data };
  };

  return {
    estimates,
    isLoadingEstimates,
    estimatesError,
    refetchEstimates,
    getEstimate,
    getMaterials,
    getLaborItems,
    createEstimate: createMutation.mutateAsync,
    updateEstimate: updateMutation.mutateAsync,
    deleteEstimate: deleteMutation.mutateAsync,
    processText: processTextMutation.mutateAsync,
    exportPdf: exportPdfMutation.mutateAsync,
    sendEmail: sendEmailMutation.mutateAsync,
    calculateTotals,
    estimateInProgress,
    storeEstimateInProgress,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isProcessingText: processTextMutation.isPending,
    isExporting: exportPdfMutation.isPending,
    isSending: sendEmailMutation.isPending,
  };
};