import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ChevronLeftIcon } from 'lucide-react';
import EstimateForm from '@/components/estimates/EstimateForm';
import VoiceInputController from '@/components/estimates/VoiceInputController';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useEstimates } from '@/hooks/use-estimates';
import { Estimate } from '@/lib/api';
import { Textarea } from '@/components/ui/textarea';

const CreateEstimate = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const duplicateId = searchParams.get('duplicate');
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<string>('form');
  const [isVoiceProcessing, setIsVoiceProcessing] = useState<boolean>(false);
  const [textInput, setTextInput] = useState<string>('');
  const [isProcessingText, setIsProcessingText] = useState<boolean>(false);
  const [templateEstimate, setTemplateEstimate] = useState<Estimate | null>(null);
  const [processedData, setProcessedData] = useState<any | null>(null);
  
  const { 
    getEstimate, 
    processText,
    storeEstimateInProgress,
    estimateInProgress 
  } = useEstimates();
  
  // If duplicating an estimate, fetch the original
  const { data: duplicateEstimate, isLoading: isLoadingDuplicate } = getEstimate(duplicateId || '');
  
  useEffect(() => {
    if (duplicateEstimate && !isLoadingDuplicate) {
      setTemplateEstimate({
        ...duplicateEstimate,
        title: `Copy of ${duplicateEstimate.title}`,
      });
    }
  }, [duplicateEstimate, isLoadingDuplicate]);
  
  // Handle voice input completion
  const handleTranscriptionComplete = async (text: string) => {
    if (!text) return;
    
    try {
      setTextInput(text);
      setActiveTab('text');
      await processTranscription(text);
    } catch (error) {
      console.error('Error processing transcription:', error);
      toast({
        title: 'Processing error',
        description: 'We had trouble processing your voice input',
        variant: 'destructive',
      });
    }
  };
  
  // Process the text input using Gemini AI
  const processTranscription = async (text: string) => {
    setIsProcessingText(true);
    try {
      const result = await processText(text);
      setProcessedData(result);
      
      // Store initial estimate data based on AI processing
      const initialData = {
        title: extractProjectTitle(text),
        description: text,
        status: 'draft',
        total_cost: result.estimated_total,
        profit_margin: 20, // Default profit margin
      };
      
      storeEstimateInProgress(initialData);
      
      toast({
        title: 'Processing complete',
        description: 'Your project details have been analyzed',
      });
      
      setActiveTab('form');
    } catch (error) {
      console.error('Error processing with AI:', error);
      toast({
        title: 'Processing failed',
        description: 'We couldn\'t analyze your project details. Please try again or enter details manually.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessingText(false);
    }
  };
  
  // Extract a project title from the transcription text
  const extractProjectTitle = (text: string): string => {
    // Simple heuristic: First sentence or up to 50 chars
    const firstSentence = text.split(/[.!?]/)[0];
    if (firstSentence.length <= 50) return firstSentence;
    return firstSentence.substring(0, 47) + '...';
  };
  
  const handleProcessTextInput = async () => {
    if (!textInput.trim()) {
      toast({
        title: 'Empty input',
        description: 'Please enter a description of your project',
        variant: 'destructive',
      });
      return;
    }
    
    await processTranscription(textInput);
  };

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
          <h1 className="text-2xl font-bold">Create New Estimate</h1>
        </div>
        
        <Tabs defaultValue="voice" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full mb-6">
            <TabsTrigger value="voice" className="flex-1" disabled={isVoiceProcessing || isProcessingText}>
              Voice Input
            </TabsTrigger>
            <TabsTrigger value="text" className="flex-1" disabled={isVoiceProcessing || isProcessingText}>
              Text Input
            </TabsTrigger>
            <TabsTrigger value="form" className="flex-1" disabled={isVoiceProcessing || isProcessingText}>
              Manual Form
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="voice" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Describe Your Project</CardTitle>
                <CardDescription>
                  Use your voice to describe the project details, materials, and scope.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VoiceInputController 
                  onTranscriptionComplete={handleTranscriptionComplete}
                  onProcessing={setIsVoiceProcessing}
                  className="max-w-xl mx-auto"
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-muted-foreground">
                  Example: "Kitchen remodel with new cabinets, quartz countertops, and stainless steel appliances."
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="text" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Type Your Project Details</CardTitle>
                <CardDescription>
                  Describe your project including materials and labor required.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Detail your project here. Include room dimensions, materials, and specific requirements..."
                  className="min-h-[200px]"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  disabled={isProcessingText}
                />
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleProcessTextInput} 
                  disabled={isProcessingText || !textInput.trim()}
                  className="ml-auto"
                >
                  {isProcessingText ? 'Processing...' : 'Process with AI'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="form" className="mt-0">
            <EstimateForm
              initialData={templateEstimate || undefined}
              processedData={processedData}
              onCancel={() => navigate('/estimates')}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default CreateEstimate;