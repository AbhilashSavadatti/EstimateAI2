import { MOCK_MODE } from './constants';

// Types
export interface Estimate {
  id: string;
  title: string;
  description?: string;
  status: 'draft' | 'pending' | 'accepted' | 'rejected' | 'archived';
  total_cost: number;
  profit_margin: number;
  location_zipcode?: string;
  client_id?: string;
  client_name?: string;
  created_at: string;
  updated_at: string;
}

export interface MaterialItem {
  id: string;
  estimate_id: string;
  name: string;
  description?: string;
  quantity: number;
  unit: string;
  unit_cost: number;
  total_cost: number;
  category?: string;
}

export interface LaborItem {
  id: string;
  estimate_id: string;
  name: string;
  description?: string;
  hours: number;
  rate_per_hour: number;
  total_cost: number;
  category?: string;
}

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  category: string;
  is_public: boolean;
}

// Helper functions
const getAuthHeader = () => {
  const token = localStorage.getItem('estimateai-token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error with status: ${response.status}`);
  }
  return response.json();
};

// Mock data and implementations for development
const mockAuthData = {
  user: {
    id: '1',
    name: 'Demo User',
    email: 'demo@estimateai.com',
    company_name: 'Demo Construction',
    subscription_tier: 'premium' as const,
    created_at: '2023-01-01T00:00:00Z',
  },
  token: 'mock-jwt-token',
};

const mockEstimates: Estimate[] = [
  {
    id: '1',
    title: 'Kitchen Renovation',
    description: 'Complete kitchen remodeling with new cabinets, countertops, and appliances',
    status: 'accepted',
    total_cost: 24500,
    profit_margin: 15,
    location_zipcode: '90210',
    client_id: '1',
    client_name: 'John Smith',
    created_at: '2023-06-15T00:00:00Z',
    updated_at: '2023-06-16T00:00:00Z',
  },
  {
    id: '2',
    title: 'Bathroom Remodel',
    description: 'Master bathroom renovation with new shower, tub, and vanity',
    status: 'pending',
    total_cost: 12800,
    profit_margin: 18,
    location_zipcode: '90211',
    client_id: '2',
    client_name: 'Sarah Johnson',
    created_at: '2023-06-18T00:00:00Z',
    updated_at: '2023-06-18T00:00:00Z',
  },
  {
    id: '3',
    title: 'Deck Construction',
    description: 'New backyard deck, 20x15 ft with railing and steps',
    status: 'draft',
    total_cost: 8500,
    profit_margin: 20,
    location_zipcode: '90212',
    client_id: '3',
    client_name: 'Michael Brown',
    created_at: '2023-06-20T00:00:00Z',
    updated_at: '2023-06-21T00:00:00Z',
  },
];

const mockClients: Client[] = [
  { id: '1', name: 'John Smith', email: 'john@example.com', phone: '(555) 123-4567' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com', phone: '(555) 234-5678' },
  { id: '3', name: 'Michael Brown', email: 'michael@example.com', phone: '(555) 345-6789' },
];

// Gemini AI integration
const processWithGeminiAI = async (text: string) => {
  // In a real implementation, this would call the Gemini AI API
  // For now, we return a mock response
  console.log(`Processing with Gemini AI: ${text}`);
  
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock response based on input text
  const mockResponse = {
    materials: [
      { 
        name: 'Drywall', 
        quantity: 12, 
        unit: 'sheets', 
        unit_cost: 15.75,
        total_cost: 189.00,
        category: 'Building Materials'
      },
      { 
        name: 'Paint', 
        quantity: 3, 
        unit: 'gallons', 
        unit_cost: 35.50,
        total_cost: 106.50,
        category: 'Finishes'
      },
      { 
        name: 'Lumber (2x4)', 
        quantity: 24, 
        unit: 'pieces', 
        unit_cost: 4.25,
        total_cost: 102.00,
        category: 'Building Materials'
      }
    ],
    labor: [
      {
        name: 'Drywall Installation', 
        hours: 16, 
        rate_per_hour: 35.00,
        total_cost: 560.00,
        category: 'Labor'
      },
      {
        name: 'Painting', 
        hours: 12, 
        rate_per_hour: 45.00,
        total_cost: 540.00,
        category: 'Labor'
      }
    ],
    estimated_total: 1497.50,
    estimated_duration_days: 5,
    confidence_score: 0.85
  };
  
  return mockResponse;
};

// API Implementation
export const api = {
  auth: {
    login: async (email: string, password: string) => {
      if (MOCK_MODE) {
        await new Promise(resolve => setTimeout(resolve, 800));
        return mockAuthData;
      }
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      return handleApiResponse(response);
    },
    
    register: async (data: { name: string; email: string; company_name: string; password: string }) => {
      if (MOCK_MODE) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { ...mockAuthData, user: { ...mockAuthData.user, ...data } };
      }
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      return handleApiResponse(response);
    },
    
    getCurrentUser: async () => {
      if (MOCK_MODE) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockAuthData.user;
      }
      
      const response = await fetch('/api/users/profile', {
        headers: getAuthHeader(),
      });
      
      return handleApiResponse(response);
    },
    
    updateUser: async (data: any) => {
      if (MOCK_MODE) {
        await new Promise(resolve => setTimeout(resolve, 700));
        return { ...mockAuthData.user, ...data };
      }
      
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      return handleApiResponse(response);
    },
    
    resetPassword: async (email: string) => {
      if (MOCK_MODE) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { success: true };
      }
      
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      return handleApiResponse(response);
    },
  },
  
  estimates: {
    getAll: async () => {
      if (MOCK_MODE) {
        await new Promise(resolve => setTimeout(resolve, 800));
        return mockEstimates;
      }
      
      const response = await fetch('/api/estimates', {
        headers: getAuthHeader(),
      });
      
      return handleApiResponse(response);
    },
    
    getById: async (id: string) => {
      if (MOCK_MODE) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const estimate = mockEstimates.find(e => e.id === id);
        if (!estimate) throw new Error('Estimate not found');
        return estimate;
      }
      
      const response = await fetch(`/api/estimates/${id}`, {
        headers: getAuthHeader(),
      });
      
      return handleApiResponse(response);
    },
    
    create: async (data: Partial<Estimate>) => {
      if (MOCK_MODE) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const newEstimate: Estimate = {
          id: (mockEstimates.length + 1).toString(),
          title: data.title || 'New Estimate',
          description: data.description || '',
          status: data.status || 'draft',
          total_cost: data.total_cost || 0,
          profit_margin: data.profit_margin || 15,
          location_zipcode: data.location_zipcode,
          client_id: data.client_id,
          client_name: data.client_id 
            ? mockClients.find(c => c.id === data.client_id)?.name 
            : undefined,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        return newEstimate;
      }
      
      const response = await fetch('/api/estimates', {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      return handleApiResponse(response);
    },
    
    update: async (id: string, data: Partial<Estimate>) => {
      if (MOCK_MODE) {
        await new Promise(resolve => setTimeout(resolve, 700));
        const estimateIndex = mockEstimates.findIndex(e => e.id === id);
        if (estimateIndex === -1) throw new Error('Estimate not found');
        
        const updatedEstimate = {
          ...mockEstimates[estimateIndex],
          ...data,
          updated_at: new Date().toISOString(),
        };
        
        return updatedEstimate;
      }
      
      const response = await fetch(`/api/estimates/${id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      return handleApiResponse(response);
    },
    
    delete: async (id: string) => {
      if (MOCK_MODE) {
        await new Promise(resolve => setTimeout(resolve, 600));
        return { success: true };
      }
      
      const response = await fetch(`/api/estimates/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });
      
      return handleApiResponse(response);
    },

    getMaterials: async (estimateId: string) => {
      if (MOCK_MODE) {
        await new Promise(resolve => setTimeout(resolve, 600));
        return [
          { 
            id: '1', 
            estimate_id: estimateId, 
            name: 'Drywall', 
            quantity: 12, 
            unit: 'sheets', 
            unit_cost: 15.75,
            total_cost: 189.00,
            category: 'Building Materials'
          },
          { 
            id: '2', 
            estimate_id: estimateId, 
            name: 'Paint', 
            quantity: 3, 
            unit: 'gallons', 
            unit_cost: 35.50,
            total_cost: 106.50,
            category: 'Finishes'
          }
        ];
      }
      
      const response = await fetch(`/api/estimates/${estimateId}/materials`, {
        headers: getAuthHeader(),
      });
      
      return handleApiResponse(response);
    },
    
    getLaborItems: async (estimateId: string) => {
      if (MOCK_MODE) {
        await new Promise(resolve => setTimeout(resolve, 600));
        return [
          {
            id: '1',
            estimate_id: estimateId,
            name: 'Drywall Installation', 
            hours: 16, 
            rate_per_hour: 35.00,
            total_cost: 560.00,
            category: 'Labor'
          },
          {
            id: '2',
            estimate_id: estimateId,
            name: 'Painting', 
            hours: 12, 
            rate_per_hour: 45.00,
            total_cost: 540.00,
            category: 'Labor'
          }
        ];
      }
      
      const response = await fetch(`/api/estimates/${estimateId}/labor`, {
        headers: getAuthHeader(),
      });
      
      return handleApiResponse(response);
    },
    
    exportPdf: async (estimateId: string) => {
      if (MOCK_MODE) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        return { url: 'https://example.com/mock-pdf.pdf' };
      }
      
      const response = await fetch(`/api/estimates/${estimateId}/export-pdf`, {
        method: 'POST',
        headers: getAuthHeader(),
      });
      
      return handleApiResponse(response);
    },
    
    sendEmail: async (estimateId: string, email: string) => {
      if (MOCK_MODE) {
        await new Promise(resolve => setTimeout(resolve, 1200));
        return { success: true };
      }
      
      const response = await fetch(`/api/estimates/${estimateId}/send-email`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      return handleApiResponse(response);
    },
  },
  
  clients: {
    getAll: async () => {
      if (MOCK_MODE) {
        await new Promise(resolve => setTimeout(resolve, 700));
        return mockClients;
      }
      
      const response = await fetch('/api/clients', {
        headers: getAuthHeader(),
      });
      
      return handleApiResponse(response);
    },
    
    getById: async (id: string) => {
      if (MOCK_MODE) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const client = mockClients.find(c => c.id === id);
        if (!client) throw new Error('Client not found');
        return client;
      }
      
      const response = await fetch(`/api/clients/${id}`, {
        headers: getAuthHeader(),
      });
      
      return handleApiResponse(response);
    },
    
    create: async (data: Partial<Client>) => {
      if (MOCK_MODE) {
        await new Promise(resolve => setTimeout(resolve, 800));
        const newClient: Client = {
          id: (mockClients.length + 1).toString(),
          name: data.name || 'New Client',
          email: data.email,
          phone: data.phone,
          address: data.address,
          notes: data.notes,
        };
        return newClient;
      }
      
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      return handleApiResponse(response);
    },
  },
  
  ai: {
    processText: async (text: string) => {
      if (MOCK_MODE) {
        return processWithGeminiAI(text);
      }
      
      const response = await fetch('/api/ai/process-text', {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      
      return handleApiResponse(response);
    },
    
    processVoice: async (audioData: Blob) => {
      if (MOCK_MODE) {
        // Simulate processing the audio and returning a transcription
        await new Promise(resolve => setTimeout(resolve, 2000));
        return { 
          text: "Kitchen remodel with new cabinets, quartz countertops, and stainless steel appliances. Approximately 200 square feet.",
          confidence: 0.92
        };
      }
      
      const formData = new FormData();
      formData.append('audio', audioData);
      
      const response = await fetch('/api/ai/process-voice', {
        method: 'POST',
        headers: getAuthHeader(),
        body: formData,
      });
      
      return handleApiResponse(response);
    },
  },
  
  dashboard: {
    getData: async () => {
      if (MOCK_MODE) {
        await new Promise(resolve => setTimeout(resolve, 800));
        return {
          totalEstimates: 28,
          pendingEstimates: 5,
          acceptedEstimates: 18,
          recentEstimates: mockEstimates.slice(0, 4),
          totalRevenue: 127500,
          winRate: 64,
        };
      }
      
      const response = await fetch('/api/dashboard', {
        headers: getAuthHeader(),
      });
      
      return handleApiResponse(response);
    },
  },
};