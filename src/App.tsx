import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/use-auth';


import Index from './pages/Index';
import NotFound from './pages/NotFound';


import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

import Dashboard from './pages/dashboard/Dashboard';
import EstimatesList from './pages/estimates/EstimatesList';
import CreateEstimate from './pages/estimates/CreateEstimate';
import EstimateDetails from './pages/estimates/EstimateDetails';
import ClientsList from './pages/clients/ClientsList';
import TemplatesList from './pages/templates/TemplatesList';

const queryClient = new QueryClient();


const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {

    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    
    return <Navigate to="/auth/login" replace />;
  }
  
  return <>{children}</>;
};


const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            
            <Route path="/" element={<Index />} />
            
          
            <Route path="/auth/login" element={<AuthRoute><Login /></AuthRoute>} />
            <Route path="/auth/register" element={<AuthRoute><Register /></AuthRoute>} />
            <Route path="/auth/forgot-password" element={<AuthRoute><ForgotPassword /></AuthRoute>} />
            
           
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/estimates" element={<ProtectedRoute><EstimatesList /></ProtectedRoute>} />
            <Route path="/estimates/create" element={<ProtectedRoute><CreateEstimate /></ProtectedRoute>} />
            <Route path="/estimates/:id" element={<ProtectedRoute><EstimateDetails /></ProtectedRoute>} />
            <Route path="/clients" element={<ProtectedRoute><ClientsList /></ProtectedRoute>} />
            <Route path="/templates" element={<ProtectedRoute><TemplatesList /></ProtectedRoute>} />
            
          
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;