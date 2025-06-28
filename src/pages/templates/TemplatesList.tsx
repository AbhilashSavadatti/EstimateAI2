import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  PlusIcon, 
  MoreHorizontalIcon, 
  PencilIcon,
  TrashIcon,
  FileTextIcon,
  Copy,
  SearchIcon,
  Loader2,
  HomeIcon,
  ShowerHeadIcon,
  UtensilsIcon, 
  SofaIcon,
  TreePineIcon,
  GarageIcon,
  PaintbrushIcon
} from 'lucide-react';

// Template categories with icons
const TEMPLATE_CATEGORIES = [
  { id: 'kitchen', name: 'Kitchen', icon: <UtensilsIcon className="h-5 w-5" /> },
  { id: 'bathroom', name: 'Bathroom', icon: <ShowerHeadIcon className="h-5 w-5" /> },
  { id: 'living_room', name: 'Living Room', icon: <SofaIcon className="h-5 w-5" /> },
  { id: 'exterior', name: 'Exterior', icon: <HomeIcon className="h-5 w-5" /> },
  { id: 'landscaping', name: 'Landscaping', icon: <TreePineIcon className="h-5 w-5" /> },
  { id: 'garage', name: 'Garage', icon: <GarageIcon className="h-5 w-5" /> },
  { id: 'painting', name: 'Painting', icon: <PaintbrushIcon className="h-5 w-5" /> },
];

// Mock templates data
const MOCK_TEMPLATES = [
  { 
    id: '1', 
    name: 'Complete Kitchen Renovation', 
    description: 'Full kitchen renovation including cabinets, countertops, backsplash, and appliances',
    category: 'kitchen',
    is_public: true,
    popularity: 98,
    materials_count: 15,
    labor_count: 7
  },
  { 
    id: '2', 
    name: 'Master Bathroom Remodel', 
    description: 'Master bathroom remodel with tile shower, vanity, and fixtures',
    category: 'bathroom',
    is_public: true,
    popularity: 85,
    materials_count: 12,
    labor_count: 5
  },
  { 
    id: '3', 
    name: 'Living Room Hardwood Flooring', 
    description: 'Hardwood flooring installation for living room',
    category: 'living_room',
    is_public: true,
    popularity: 76,
    materials_count: 8,
    labor_count: 3
  },
  { 
    id: '4', 
    name: 'Exterior House Painting', 
    description: 'Complete exterior painting including prep work, priming, and painting',
    category: 'exterior',
    is_public: true,
    popularity: 92,
    materials_count: 10,
    labor_count: 4
  },
  { 
    id: '5', 
    name: 'Backyard Patio Construction', 
    description: 'Concrete patio construction with pavers and built-in seating',
    category: 'landscaping',
    is_public: true,
    popularity: 81,
    materials_count: 14,
    labor_count: 6
  },
  { 
    id: '6', 
    name: 'Garage Conversion', 
    description: 'Convert garage to additional living space',
    category: 'garage',
    is_public: true,
    popularity: 65,
    materials_count: 18,
    labor_count: 9
  },
  { 
    id: '7', 
    name: 'Interior House Painting', 
    description: 'Interior painting for entire home including walls, trim, and ceilings',
    category: 'painting',
    is_public: true,
    popularity: 89,
    materials_count: 9,
    labor_count: 4
  },
  { 
    id: '8', 
    name: 'Custom Kitchen Island', 
    description: 'Custom-built kitchen island with storage and countertop',
    category: 'kitchen',
    is_public: false,
    popularity: 45,
    materials_count: 7,
    labor_count: 3
  },
  { 
    id: '9', 
    name: 'Guest Bathroom Update', 
    description: 'Update guest bathroom with new vanity, toilet, and fixtures',
    category: 'bathroom',
    is_public: false,
    popularity: 38,
    materials_count: 6,
    labor_count: 2
  },
  { 
    id: '10', 
    name: 'Deck Construction', 
    description: 'Wooden deck construction with railing and steps',
    category: 'exterior',
    is_public: true,
    popularity: 75,
    materials_count: 12,
    labor_count: 5
  },
];

const TemplatesList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [templates, setTemplates] = useState(MOCK_TEMPLATES);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Simulate loading templates
  useEffect(() => {
    const loadTemplates = async () => {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
    };
    
    loadTemplates();
  }, []);
  
  // Filter templates based on search query and active category
  const filteredTemplates = React.useMemo(() => {
    return templates.filter(template => {
      const matchesSearch = 
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesCategory = activeCategory === 'all' || template.category === activeCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [templates, searchQuery, activeCategory]);
  
  // Get icon for a specific category
  const getCategoryIcon = (categoryId: string) => {
    const category = TEMPLATE_CATEGORIES.find(cat => cat.id === categoryId);
    return category ? category.icon : <FileTextIcon className="h-5 w-5" />;
  };
  
  // Get formatted name for a specific category
  const getCategoryName = (categoryId: string) => {
    const category = TEMPLATE_CATEGORIES.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };
  
  // Handle using a template
  const handleUseTemplate = (templateId: string) => {
    navigate(`/estimates/create?template=${templateId}`);
  };
  
  // Handle duplicate template
  const handleDuplicateTemplate = (templateId: string, name: string) => {
    toast({
      title: "Template duplicated",
      description: `"${name}" has been duplicated as "Copy of ${name}"`,
    });
    
    // In a real app, this would be an API call followed by refetching templates
    const originalTemplate = templates.find(t => t.id === templateId);
    if (!originalTemplate) return;
    
    const newTemplate = {
      ...originalTemplate,
      id: `${Date.now()}`, // Generate a unique ID
      name: `Copy of ${originalTemplate.name}`,
      is_public: false,
      popularity: 0
    };
    
    setTemplates([...templates, newTemplate]);
  };
  
  // Handle delete template
  const handleDeleteTemplate = (templateId: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      // In a real app, this would be an API call
      setTemplates(templates.filter(t => t.id !== templateId));
      
      toast({
        title: "Template deleted",
        description: `"${name}" has been deleted`
      });
    }
  };
  
  return (
    <DashboardLayout>
      <div className="container px-4 py-8 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Templates</h1>
            <p className="text-muted-foreground mt-1">
              Use and customize project templates
            </p>
          </div>
          <Button
            onClick={() => navigate('/templates/create')}
            className="mt-4 md:mt-0"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex">
            <Button
              variant={viewMode === 'grid' ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              List
            </Button>
          </div>
        </div>
        
        <Tabs 
          defaultValue="all" 
          value={activeCategory} 
          onValueChange={setActiveCategory} 
          className="mb-8"
        >
          <TabsList className="flex overflow-x-auto pb-2 mb-2">
            <TabsTrigger value="all">All Templates</TabsTrigger>
            {TEMPLATE_CATEGORIES.map(category => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="flex items-center gap-2"
              >
                {category.icon}
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {isLoading ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-64 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          )
        ) : filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <FileTextIcon className="h-6 w-6 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium">No templates found</h3>
            <p className="text-muted-foreground mt-1 mb-6">
              {templates.length ? 'Try adjusting your search or category filter' : 'Create your first template to get started'}
            </p>
            {!templates.length && (
              <Button 
                onClick={() => navigate('/templates/create')}
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Template
              </Button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          // Grid view
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(template.category)}
                      <Badge variant="outline" className="text-xs">
                        {getCategoryName(template.category)}
                      </Badge>
                    </div>
                    {template.is_public && (
                      <Badge variant="secondary" className="text-xs">
                        Public
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg mt-2">{template.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {template.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">{template.materials_count}</span> materials
                    </div>
                    <div>
                      <span className="font-medium">{template.labor_count}</span> labor items
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="default" 
                    onClick={() => handleUseTemplate(template.id)}
                  >
                    Use Template
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                      <DropdownMenuItem onClick={() => navigate(`/templates/${template.id}`)}>
                        <FileTextIcon className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/templates/${template.id}/edit`)}>
                        <PencilIcon className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicateTemplate(template.id, template.name)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      {!template.is_public && (
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeleteTemplate(template.id, template.name)}
                        >
                          <TrashIcon className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          // List view
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Name</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead className="hidden lg:table-cell">Description</TableHead>
                  <TableHead className="hidden sm:table-cell w-[100px]">Items</TableHead>
                  <TableHead className="w-[150px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTemplates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                          {getCategoryIcon(template.category)}
                        </div>
                        <div>
                          {template.name}
                          {template.is_public && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              Public
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {getCategoryName(template.category)}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground max-w-[300px] truncate">
                      {template.description}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="text-sm">
                        <div>{template.materials_count} materials</div>
                        <div>{template.labor_count} labor</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleUseTemplate(template.id)}
                        >
                          Use
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontalIcon className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[160px]">
                            <DropdownMenuItem onClick={() => navigate(`/templates/${template.id}`)}>
                              <FileTextIcon className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/templates/${template.id}/edit`)}>
                              <PencilIcon className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicateTemplate(template.id, template.name)}>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            {!template.is_public && (
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleDeleteTemplate(template.id, template.name)}
                              >
                                <TrashIcon className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
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

export default TemplatesList;