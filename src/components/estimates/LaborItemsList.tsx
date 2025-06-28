import React, { useState } from 'react';
import { PlusIcon, TrashIcon, DollarSignIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LaborItem } from '@/lib/api';
import { LABOR_CATEGORIES } from '@/lib/constants';

interface LaborItemsListProps {
  laborItems: LaborItem[];
  onUpdate: (laborItems: LaborItem[]) => void;
}

const LaborItemsList: React.FC<LaborItemsListProps> = ({ laborItems, onUpdate }) => {
  const [newItem, setNewItem] = useState<Partial<LaborItem>>({
    name: '',
    hours: 1,
    rate_per_hour: 0,
    total_cost: 0,
    category: 'General Labor',
  });

  const handleInputChange = (field: string, value: string | number) => {
    const updatedItem = { ...newItem, [field]: value };
    
    // Auto-calculate total cost when hours or rate_per_hour changes
    if (field === 'hours' || field === 'rate_per_hour') {
      const hours = field === 'hours' ? Number(value) : Number(newItem.hours || 0);
      const ratePerHour = field === 'rate_per_hour' ? Number(value) : Number(newItem.rate_per_hour || 0);
      updatedItem.total_cost = hours * ratePerHour;
    }
    
    setNewItem(updatedItem);
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.hours || !newItem.rate_per_hour) {
      return;
    }
    
    const item: LaborItem = {
      id: `new-labor-${Date.now()}`,
      estimate_id: '',
      name: newItem.name || '',
      description: newItem.description || '',
      hours: Number(newItem.hours) || 0,
      rate_per_hour: Number(newItem.rate_per_hour) || 0,
      total_cost: Number(newItem.total_cost) || 0,
      category: newItem.category || 'General Labor',
    };
    
    onUpdate([...laborItems, item]);
    
    // Reset form
    setNewItem({
      name: '',
      hours: 1,
      rate_per_hour: 0,
      total_cost: 0,
      category: 'General Labor',
    });
  };

  const handleUpdateItem = (index: number, field: string, value: string | number) => {
    const updatedLaborItems = [...laborItems];
    const updatedItem = { ...updatedLaborItems[index], [field]: value };
    
    // Auto-calculate total cost when hours or rate_per_hour changes
    if (field === 'hours' || field === 'rate_per_hour') {
      const hours = field === 'hours' ? Number(value) : updatedItem.hours;
      const ratePerHour = field === 'rate_per_hour' ? Number(value) : updatedItem.rate_per_hour;
      updatedItem.total_cost = hours * ratePerHour;
    }
    
    updatedLaborItems[index] = updatedItem as LaborItem;
    onUpdate(updatedLaborItems);
  };

  const handleRemoveItem = (index: number) => {
    const updatedLaborItems = [...laborItems];
    updatedLaborItems.splice(index, 1);
    onUpdate(updatedLaborItems);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const totalLaborCost = laborItems.reduce((sum, labor) => sum + labor.total_cost, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Labor</CardTitle>
          <CardDescription>
            Add all labor costs needed for this project
          </CardDescription>
        </CardHeader>
        <CardContent>
          {laborItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No labor items added yet. Add your first labor item below.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Item Description</TableHead>
                    <TableHead className="w-[100px]">Hours</TableHead>
                    <TableHead className="w-[140px]">Rate ($/hr)</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {laborItems.map((labor, index) => (
                    <TableRow key={labor.id}>
                      <TableCell>
                        <Input
                          value={labor.name}
                          onChange={(e) => handleUpdateItem(index, 'name', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          step="0.5"
                          value={labor.hours}
                          onChange={(e) => handleUpdateItem(index, 'hours', parseFloat(e.target.value) || 0)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="relative">
                          <DollarSignIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            className="pl-8"
                            value={labor.rate_per_hour}
                            onChange={(e) => handleUpdateItem(index, 'rate_per_hour', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(labor.total_cost)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(index)}
                        >
                          <TrashIcon className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-3">Add New Labor Item</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="name">Description</Label>
                <Input
                  id="name"
                  placeholder="Labor description"
                  value={newItem.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="hours">Hours</Label>
                <Input
                  id="hours"
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="0"
                  value={newItem.hours}
                  onChange={(e) => handleInputChange('hours', parseFloat(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="ratePerHour">Rate ($/hr)</Label>
                <div className="relative mt-1">
                  <DollarSignIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="ratePerHour"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="pl-8"
                    value={newItem.rate_per_hour}
                    onChange={(e) => handleInputChange('rate_per_hour', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newItem.category}
                    onValueChange={(value) => handleInputChange('category', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {LABOR_CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="total">Total Cost</Label>
                  <Input
                    id="total"
                    type="text"
                    readOnly
                    className="mt-1"
                    value={formatCurrency(Number(newItem.total_cost) || 0)}
                  />
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleAddItem} 
              className="mt-4"
              disabled={!newItem.name || !newItem.hours || !newItem.rate_per_hour}
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Labor Item
            </Button>
          </div>
          
          <div className="mt-8 flex justify-end">
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="font-semibold flex justify-between">
                <span>Labor Subtotal:</span>
                <span>{formatCurrency(totalLaborCost)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LaborItemsList;