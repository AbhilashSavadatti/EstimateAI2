import React, { useState } from 'react';
import { PlusIcon, TrashIcon, DollarSignIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MaterialItem } from '@/lib/api';
import { MATERIAL_UNITS, MATERIAL_CATEGORIES } from '@/lib/constants';

interface MaterialItemsListProps {
  materials: MaterialItem[];
  onUpdate: (materials: MaterialItem[]) => void;
}

const MaterialItemsList: React.FC<MaterialItemsListProps> = ({ materials, onUpdate }) => {
  const [newItem, setNewItem] = useState<Partial<MaterialItem>>({
    name: '',
    quantity: 1,
    unit: 'each',
    unit_cost: 0,
    total_cost: 0,
    category: 'Building Materials',
  });

  const handleInputChange = (field: string, value: string | number) => {
    const updatedItem = { ...newItem, [field]: value };
    
    // Auto-calculate total cost when quantity or unit_cost changes
    if (field === 'quantity' || field === 'unit_cost') {
      const quantity = field === 'quantity' ? Number(value) : Number(newItem.quantity || 0);
      const unitCost = field === 'unit_cost' ? Number(value) : Number(newItem.unit_cost || 0);
      updatedItem.total_cost = quantity * unitCost;
    }
    
    setNewItem(updatedItem);
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.quantity || !newItem.unit_cost) {
      return;
    }
    
    const item: MaterialItem = {
      id: `new-material-${Date.now()}`,
      estimate_id: '',
      name: newItem.name || '',
      description: newItem.description || '',
      quantity: Number(newItem.quantity) || 0,
      unit: newItem.unit || 'each',
      unit_cost: Number(newItem.unit_cost) || 0,
      total_cost: Number(newItem.total_cost) || 0,
      category: newItem.category || 'Building Materials',
    };
    
    onUpdate([...materials, item]);
    
    // Reset form
    setNewItem({
      name: '',
      quantity: 1,
      unit: 'each',
      unit_cost: 0,
      total_cost: 0,
      category: 'Building Materials',
    });
  };

  const handleUpdateItem = (index: number, field: string, value: string | number) => {
    const updatedMaterials = [...materials];
    const updatedItem = { ...updatedMaterials[index], [field]: value };
    
    // Auto-calculate total cost when quantity or unit_cost changes
    if (field === 'quantity' || field === 'unit_cost') {
      const quantity = field === 'quantity' ? Number(value) : updatedItem.quantity;
      const unitCost = field === 'unit_cost' ? Number(value) : updatedItem.unit_cost;
      updatedItem.total_cost = quantity * unitCost;
    }
    
    updatedMaterials[index] = updatedItem as MaterialItem;
    onUpdate(updatedMaterials);
  };

  const handleRemoveItem = (index: number) => {
    const updatedMaterials = [...materials];
    updatedMaterials.splice(index, 1);
    onUpdate(updatedMaterials);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const totalMaterialCost = materials.reduce((sum, material) => sum + material.total_cost, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Materials</CardTitle>
          <CardDescription>
            Add all materials needed for this project
          </CardDescription>
        </CardHeader>
        <CardContent>
          {materials.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No materials added yet. Add your first material below.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Name</TableHead>
                    <TableHead className="w-[100px]">Quantity</TableHead>
                    <TableHead className="w-[120px]">Unit</TableHead>
                    <TableHead className="w-[140px]">Unit Cost</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {materials.map((material, index) => (
                    <TableRow key={material.id}>
                      <TableCell>
                        <Input
                          value={material.name}
                          onChange={(e) => handleUpdateItem(index, 'name', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={material.quantity}
                          onChange={(e) => handleUpdateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={material.unit}
                          onValueChange={(value) => handleUpdateItem(index, 'unit', value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Unit" />
                          </SelectTrigger>
                          <SelectContent>
                            {MATERIAL_UNITS.map((unit) => (
                              <SelectItem key={unit.value} value={unit.value}>
                                {unit.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="relative">
                          <DollarSignIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            className="pl-8"
                            value={material.unit_cost}
                            onChange={(e) => handleUpdateItem(index, 'unit_cost', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(material.total_cost)}
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
            <h4 className="text-sm font-medium mb-3">Add New Material</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
              <div className="xl:col-span-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Material name"
                  value={newItem.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0"
                  value={newItem.quantity}
                  onChange={(e) => handleInputChange('quantity', parseFloat(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="unit">Unit</Label>
                <Select
                  value={newItem.unit}
                  onValueChange={(value) => handleInputChange('unit', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {MATERIAL_UNITS.map((unit) => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="unitCost">Unit Cost</Label>
                <div className="relative mt-1">
                  <DollarSignIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="unitCost"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="pl-8"
                    value={newItem.unit_cost}
                    onChange={(e) => handleInputChange('unit_cost', parseFloat(e.target.value) || 0)}
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
                      {MATERIAL_CATEGORIES.map((category) => (
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
              disabled={!newItem.name || !newItem.quantity || !newItem.unit_cost}
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Material
            </Button>
          </div>
          
          <div className="mt-8 flex justify-end">
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="font-semibold flex justify-between">
                <span>Materials Subtotal:</span>
                <span>{formatCurrency(totalMaterialCost)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaterialItemsList;