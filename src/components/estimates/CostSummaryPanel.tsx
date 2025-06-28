import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { DEFAULT_PROFIT_MARGIN, SUGGESTED_PROFIT_MARGINS } from '@/lib/constants';

interface CostSummaryPanelProps {
  materialTotal: number;
  laborTotal: number;
  subtotal: number;
  profitMargin: number;
  total: number;
  onProfitMarginChange: (value: number) => void;
}

const CostSummaryPanel: React.FC<CostSummaryPanelProps> = ({
  materialTotal,
  laborTotal,
  subtotal,
  profitMargin,
  total,
  onProfitMarginChange,
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cost Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Materials Subtotal</span>
                <span>{formatCurrency(materialTotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Labor Subtotal</span>
                <span>{formatCurrency(laborTotal)}</span>
              </div>
              <div className="border-t border-gray-200 my-2"></div>
              <div className="flex justify-between font-medium">
                <span>Project Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <Label htmlFor="profit-margin">Profit Margin ({profitMargin}%)</Label>
              <Slider
                id="profit-margin"
                defaultValue={[DEFAULT_PROFIT_MARGIN]}
                value={[profitMargin]}
                onValueChange={(value) => onProfitMarginChange(value[0])}
                max={100}
                step={1}
                className="my-6"
              />
              
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-muted-foreground">0%</span>
                {SUGGESTED_PROFIT_MARGINS.map((margin) => (
                  <Button 
                    key={margin} 
                    variant={profitMargin === margin ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => onProfitMarginChange(margin)}
                  >
                    {margin}%
                  </Button>
                ))}
                <span className="text-sm text-muted-foreground">100%</span>
              </div>
              
              <div className="flex justify-between text-sm mt-6">
                <span>Profit ({profitMargin}%)</span>
                <span>{formatCurrency((subtotal * profitMargin) / 100)}</span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total Estimate</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Cost Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <BreakdownChart
                materials={materialTotal}
                labor={laborTotal}
                profit={(subtotal * profitMargin) / 100}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-blue-50 p-3 rounded-md">
                <div className="text-xs text-gray-500">Materials</div>
                <div className="text-sm font-medium">{((materialTotal / total) * 100).toFixed(1)}%</div>
                <div className="text-base font-semibold">{formatCurrency(materialTotal)}</div>
              </div>
              <div className="bg-green-50 p-3 rounded-md">
                <div className="text-xs text-gray-500">Labor</div>
                <div className="text-sm font-medium">{((laborTotal / total) * 100).toFixed(1)}%</div>
                <div className="text-base font-semibold">{formatCurrency(laborTotal)}</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-md">
                <div className="text-xs text-gray-500">Profit</div>
                <div className="text-sm font-medium">{profitMargin}%</div>
                <div className="text-base font-semibold">{formatCurrency((subtotal * profitMargin) / 100)}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// A simple chart component to visualize the cost breakdown
const BreakdownChart: React.FC<{
  materials: number;
  labor: number;
  profit: number;
}> = ({ materials, labor, profit }) => {
  const total = materials + labor + profit;
  const materialsPercent = (materials / total) * 100;
  const laborPercent = (labor / total) * 100;
  const profitPercent = (profit / total) * 100;
  
  return (
    <div className="w-full h-6 rounded-full overflow-hidden flex">
      <div
        className="bg-blue-500 h-full"
        style={{ width: `${materialsPercent}%` }}
        title={`Materials: ${materialsPercent.toFixed(1)}%`}
      />
      <div
        className="bg-green-500 h-full"
        style={{ width: `${laborPercent}%` }}
        title={`Labor: ${laborPercent.toFixed(1)}%`}
      />
      <div
        className="bg-purple-500 h-full"
        style={{ width: `${profitPercent}%` }}
        title={`Profit: ${profitPercent.toFixed(1)}%`}
      />
    </div>
  );
};

// Define Button component for suggested profit margins
const Button: React.FC<{
  variant: "secondary" | "outline";
  size: "sm";
  onClick: () => void;
  children: React.ReactNode;
}> = ({ variant, size, onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className={`
        px-3 py-1 rounded-md text-xs font-medium
        ${variant === "secondary" ? "bg-blue-100 text-blue-700" : "border border-gray-200 text-gray-700"}
        ${size === "sm" ? "text-xs" : "text-sm"}
      `}
    >
      {children}
    </button>
  );
};

export default CostSummaryPanel;