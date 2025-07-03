import React, { useEffect } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useAuth } from '@/hooks/use-auth';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import RecentEstimatesWidget from '@/components/dashboard/RecentEstimatesWidget';
import QuickActionsPanel from '@/components/dashboard/QuickActionsPanel';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(true);
  const [dashboardData, setDashboardData] = React.useState({
    totalEstimates: 0,
    pendingEstimates: 0,
    acceptedEstimates: 0,
    recentEstimates: [],
    totalRevenue: 0,
    winRate: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (user) {
          // In a real implementation, this would call the API
          const data = await api.dashboard.getData();
          setDashboardData(data);
        }
      } catch (error) {
        toast({
          title: 'Error fetching dashboard data',
          description: 'Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    
    setTimeout(() => {
      setDashboardData({
        totalEstimates: 28,
        pendingEstimates: 5,
        acceptedEstimates: 18,
        recentEstimates: [
  { id: '1', title: 'Modular Kitchen Setup', client: 'Rahul Sharma', amount: 125000, status: 'accepted', date: '2024-06-15' },
  { id: '2', title: 'Bathroom Renovation', client: 'Priya Mehta', amount: 87500, status: 'pending', date: '2024-06-18' },
  { id: '3', title: 'Terrace Waterproofing', client: 'Arjun Verma', amount: 62000, status: 'accepted', date: '2024-06-20' },
  { id: '4', title: 'Living Room Interior', client: 'Sneha Kapoor', amount: 158000, status: 'draft', date: '2024-06-22' },
],
        totalRevenue: 127500,
        winRate: 64,
      });
      setIsLoading(false);
    }, 1000);
  }, [user, toast]);

  return (
    <DashboardLayout>
      <div className="container px-4 py-8 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user?.name || 'there'}!
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-[180px] rounded-xl" />
            <Skeleton className="h-[180px] rounded-xl" />
            <Skeleton className="h-[180px] rounded-xl" />
            <Skeleton className="h-[340px] md:col-span-2 rounded-xl" />
            <Skeleton className="h-[340px] rounded-xl" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DashboardOverview data={dashboardData} />
            <div className="md:col-span-2">
              <RecentEstimatesWidget 
                estimates={dashboardData.recentEstimates} 
                onViewAll={() => navigate('/estimates')}
                onViewEstimate={(id) => navigate(`/estimates/${id}`)}
              />
            </div>
            <div>
              <QuickActionsPanel onCreateEstimate={() => navigate('/estimates/create')} />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;