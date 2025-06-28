import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  PlusIcon,
  UsersIcon,
  FileTextIcon,
  ArrowRightIcon
} from 'lucide-react';

interface QuickActionsPanelProps {
  onCreateEstimate: () => void;
}

const QuickActionsPanel: React.FC<QuickActionsPanelProps> = ({ onCreateEstimate }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          className="w-full justify-start gap-2" 
          onClick={onCreateEstimate}
        >
          <PlusIcon className="h-4 w-4" />
          Create New Estimate
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2"
          onClick={() => window.location.href = '/clients/create'}
        >
          <UsersIcon className="h-4 w-4" />
          Add New Client
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2"
          onClick={() => window.location.href = '/templates'}
        >
          <FileTextIcon className="h-4 w-4" />
          Browse Templates
        </Button>
        
        <div className="pt-4">
          <h3 className="text-sm font-medium mb-3">Tips & Resources</h3>
          <div className="space-y-3">
            <a 
              href="/help/voice-input-guide" 
              className="block text-sm text-blue-600 hover:underline"
            >
              <div className="flex items-center justify-between">
                <span>Voice Input Guide</span>
                <ArrowRightIcon className="h-3 w-3" />
              </div>
            </a>
            
            <a 
              href="/help/estimate-accuracy" 
              className="block text-sm text-blue-600 hover:underline"
            >
              <div className="flex items-center justify-between">
                <span>Improving Estimate Accuracy</span>
                <ArrowRightIcon className="h-3 w-3" />
              </div>
            </a>
            
            <a 
              href="/help/video-tutorials" 
              className="block text-sm text-blue-600 hover:underline"
            >
              <div className="flex items-center justify-between">
                <span>Video Tutorials</span>
                <ArrowRightIcon className="h-3 w-3" />
              </div>
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsPanel;