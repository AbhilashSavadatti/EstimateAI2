import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, SaveIcon, XIcon } from 'lucide-react';
import { useEstimates } from '@/hooks/use-estimates';
import { DEFAULT_PROFIT_MARGIN } from '@/lib/constants';
import { Estimate, MaterialItem, LaborItem } from '@/lib/api';
import { api } from '@/lib/api';
import MaterialItemsList from './MaterialItemsList';
import LaborItemsList from './LaborItemsList';
import CostSummaryPanel from './CostSummaryPanel';

const estimateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  client_id: z.string().optional(),
  location_zipcode: z.string().max(10).optional(),
  profit_margin: z.number().min(0).max(100),
});

interface EstimateFormProps {
  initialData?: Estimate;
  processedData?: any;
  onCancel?: () => void;
}

const EstimateForm: React.FC<EstimateFormProps> = ({
  initialData,
  processedData,
  onCancel
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createEstimate, updateEstimate, estimateInProgress, storeEstimateInProgress } = useEstimates();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [clients, setClients] = useState<{id: string; name: string}[]>([]);
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [laborItems, setLaborItems] = useState<LaborItem[]>([]);

  // Combine initialData and estimateInProgress to get the most up-to-date data
  const formData = React.useMemo(() => {
    const baseData = initialData || estimateInProgress || {
      title: '',
      description: '',
      status: 'draft',
      total_cost: 0,
      profit_margin: DEFAULT_PROFIT_MARGIN,
    };
    
    return baseData;
  }, [initialData, estimateInProgress]);

  // Set up form
  const form = useForm<z.infer<typeof estimateSchema>>({
    resolver: zodResolver(estimateSchema),
    defaultValues: {
      title: formData.title || '',
      description: formData.description || '',
      client_id: formData.client_id || '',
      location_zipcode: formData.location_zipcode || '',
      profit_margin: formData.profit_margin || DEFAULT_PROFIT_MARGIN,
    },
  });

  // Fetch clients for the dropdown
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientsData = await api.clients.getAll();
        setClients(clientsData);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };
    
    fetchClients();
  }, []);

  // Process AI-generated data if provided
  useEffect(() => {
    if (processedData) {
      // Convert AI result to material items format
      const convertedMaterials = processedData.materials.map((item: any, index: number) => ({
        id: `temp-material-${index}`,
        estimate_id: '',
        name: item.name,
        description: '',
        quantity: item.quantity,
        unit: item.unit,
        unit_cost: item.unit_cost,
        total_cost: item.total_cost,
        category: item.category || 'Building Materials',
      }));
      
      // Convert AI result to labor items format
      const convertedLabor = processedData.labor.map((item: any, index: number) => ({
        id: `temp-labor-${index}`,
        estimate_id: '',
        name: item.name,
        description: '',
        hours: item.hours,
        rate_per_hour: item.rate_per_hour,
        total_cost: item.total_cost,
        category: item.category || 'Labor',
      }));
      
      setMaterials(convertedMaterials);
      setLaborItems(convertedLabor);
    }
  }, [processedData]);

  // Update materials and labor if initialData changes (for edit mode)
  useEffect(() => {
    const fetchMaterialsAndLabor = async () => {
      if (initialData?.id) {
        try {
          const [materialsData, laborData] = await Promise.all([
            api.estimates.getMaterials(initialData.id),
            api.estimates.getLaborItems(initialData.id),
          ]);
          
          setMaterials(materialsData);
          setLaborItems(laborData);
        } catch (error) {
          console.error('Error fetching materials and labor:', error);
        }
      }
    };
    
    fetchMaterialsAndLabor();
  }, [initialData]);

  // Calculate totals based on current materials and labor
  const totals = React.useMemo(() => {
    const materialTotal = materials.reduce((sum, item) => sum + item.total_cost, 0);
    const laborTotal = laborItems.reduce((sum, item) => sum + item.total_cost, 0);
    const subtotal = materialTotal + laborTotal;
    const profitMargin = form.watch('profit_margin');
    const profitAmount = (subtotal * profitMargin) / 100;
    const total = subtotal + profitAmount;
    
    return {
      materialTotal,
      laborTotal,
      subtotal,
      profitAmount,
      total,
    };
  }, [materials, laborItems, form.watch('profit_margin')]);

  const handleSubmit = async (values: z.infer<typeof estimateSchema>) => {
    setIsSubmitting(true);
    
    try {
      const estimateData: Partial<Estimate> = {
        ...values,
        status: 'draft',
        total_cost: totals.total,
      };

      let estimateId = initialData?.id;
      
      if (estimateId) {
        // Update existing estimate
        await updateEstimate({ id: estimateId, data: estimateData });
      } else {
        // Create new estimate
        const newEstimate = await createEstimate(estimateData);
        estimateId = newEstimate.id;
      }
      
   
      toast({
        title: initialData ? 'Estimate updated' : 'Estimate created',
        description: `Your estimate has been ${initialData ? 'updated' : 'created'} successfully.`,
      });
      
      navigate(`/estimates/${estimateId}`);
    } catch (error) {
      console.error('Error saving estimate:', error);
      toast({
        title: 'Error saving estimate',
        description: 'There was an error saving your estimate. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateMaterials = (updatedMaterials: MaterialItem[]) => {
    setMaterials(updatedMaterials);
  };

  const handleUpdateLaborItems = (updatedLaborItems: LaborItem[]) => {
    setLaborItems(updatedLaborItems);
  };

  // Save form data to estimateInProgress as user types
  const handleFieldChange = (field: string, value: any) => {
    storeEstimateInProgress({
      [field]: value
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="space-y-6">
          <Card className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="materials">Materials</TabsTrigger>
                <TabsTrigger value="labor">Labor</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Title</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Kitchen Renovation" 
                            {...field} 
                            onChange={(e) => {
                              field.onChange(e);
                              handleFieldChange('title', e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="client_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client</FormLabel>
                        <Select 
                          onValueChange={(value) => {
  const normalizedValue = value === 'no-client' ? '' : value;
  field.onChange(normalizedValue);
  handleFieldChange('client_id', normalizedValue);
}}

                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a client" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="no-client">No client</SelectItem>
                            {clients.map((client) => (
                              <SelectItem key={client.id} value={client.id}>
                                {client.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the project scope and details..." 
                          className="min-h-[120px]" 
                          {...field} 
                          onChange={(e) => {
                            field.onChange(e);
                            handleFieldChange('description', e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="location_zipcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Zipcode</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="90210" 
                          className="max-w-[200px]" 
                          {...field} 
                          onChange={(e) => {
                            field.onChange(e);
                            handleFieldChange('location_zipcode', e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="materials">
                <MaterialItemsList 
                  materials={materials}
                  onUpdate={handleUpdateMaterials}
                />
              </TabsContent>
              
              <TabsContent value="labor">
                <LaborItemsList 
                  laborItems={laborItems}
                  onUpdate={handleUpdateLaborItems}
                />
              </TabsContent>
              
              <TabsContent value="summary">
                <CostSummaryPanel 
                  materialTotal={totals.materialTotal}
                  laborTotal={totals.laborTotal}
                  subtotal={totals.subtotal}
                  profitMargin={form.watch('profit_margin')}
                  total={totals.total}
                  onProfitMarginChange={(value) => {
                    form.setValue('profit_margin', value);
                    handleFieldChange('profit_margin', value);
                  }}
                />
              </TabsContent>
            </Tabs>
          </Card>
          
          <div className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              <XIcon className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            
            <div className="flex gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  
                  toast({
                    title: 'Preview',
                    description: 'Preview functionality not implemented yet',
                  });
                }}
                disabled={isSubmitting}
              >
                Preview
              </Button>
              
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <SaveIcon className="mr-2 h-4 w-4" />
                    Save Estimate
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default EstimateForm;