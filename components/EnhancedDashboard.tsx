import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Icon } from './Icon';
import { Card, Button, Badge, Progress, Avatar } from './ui/GlobalComponents';
import { AnimatedChart } from './ui/AdvancedComponents';
import { Client } from '../types';

interface DashboardProps {
  clients: Client[];
  onNavigate: (view: string) => void;
}

interface DashboardStats {
  totalClients: number;
  activeDeals: number;
  monthlyRevenue: number;
  conversionRate: number;
  newLeads: number;
  closedDeals: number;
}

interface RecentActivity {
  id: string;
  type: 'call' | 'meeting' | 'deal' | 'lead';
  client: string;
  message: string;
  time: string;
  status: 'success' | 'pending' | 'warning';
}

const MOCK_ACTIVITIES: RecentActivity[] = [
  {
    id: '1',
    type: 'deal',
    client: 'Nguyễn Văn An',
    message: 'Đã ký hợp đồng mua căn hộ Vinhomes',
    time: '10 phút trước',
    status: 'success'
  },
  {
    id: '2',
    type: 'meeting',
    client: 'Trần Thị Bích',
    message: 'Cuộc họp tư vấn lúc 14:00',
    time: '30 phút trước',
    status: 'pending'
  },
  {
    id: '3',
    type: 'lead',
    client: 'Lê Hoàng Nam',
    message: 'Lead mới quan tâm căn hộ cao cấp',
    time: '1 giờ trước',
    status: 'warning'
  },
  {
    id: '4',
    type: 'call',
    client: 'Phạm Thị Lan',
    message: 'Đã gọi tư vấn về dự án Masteri',
    time: '2 giờ trước',
    status: 'success'
  }
];

export const EnhancedDashboard: React.FC<DashboardProps> = ({ clients, onNavigate }) => {
  const { isDark, tokens } = useTheme();
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: clients.length,
    activeDeals: 0,
    monthlyRevenue: 0,
    conversionRate: 0,
    newLeads: 0,
    closedDeals: 0
  });

  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'year'>('month');
  const [isLoading, setIsLoading] = useState(true);

  // Calculate stats from clients data
  useEffect(() => {
    const calculateStats = () => {
      const activeDeals = clients.filter(c => c.status === 'interested').length;
      const newLeads = clients.filter(c => c.status === 'new').length;
      const closedDeals = clients.filter(c => c.status === 'closed').length;
      const totalContacts = clients.length;
      const conversionRate = totalContacts > 0 ? (closedDeals / totalContacts) * 100 : 0;
      
      // Mock revenue calculation
      const monthlyRevenue = closedDeals * 2.5; // Assume average 2.5B per deal

      setStats({
        totalClients: totalContacts,
        activeDeals,
        monthlyRevenue,
        conversionRate,
        newLeads,
        closedDeals
      });

      // Simulate loading
      setTimeout(() => setIsLoading(false), 1000);
    };

    calculateStats();
  }, [clients]);

  // Chart data for revenue trends
  const revenueChartData = [
    { label: 'T1', value: 15.2, color: 'bg-gradient-to-t from-blue-400 to-blue-600' },
    { label: 'T2', value: 18.7, color: 'bg-gradient-to-t from-emerald-400 to-emerald-600' },
    { label: 'T3', value: 12.4, color: 'bg-gradient-to-t from-purple-400 to-purple-600' },
    { label: 'T4', value: 24.8, color: 'bg-gradient-to-t from-amber-400 to-amber-600' },
    { label: 'T5', value: 31.2, color: 'bg-gradient-to-t from-rose-400 to-rose-600' },
    { label: 'T6', value: 28.9, color: 'bg-gradient-to-t from-cyan-400 to-cyan-600' }
  ];

  // Quick stats cards data
  const statsCards = [
    {
      title: 'Tổng khách hàng',
      value: stats.totalClients,
      change: '+12%',
      changeType: 'increase' as const,
      icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.663M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Deals đang xử lý',
      value: stats.activeDeals,
      change: '+8%',
      changeType: 'increase' as const,
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      title: 'Doanh thu tháng',
      value: `${stats.monthlyRevenue.toFixed(1)}B`,
      change: '+23%',
      changeType: 'increase' as const,
      icon: 'M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      gradient: 'from-violet-500 to-purple-500'
    },
    {
      title: 'Tỷ lệ chuyển đổi',
      value: `${stats.conversionRate.toFixed(1)}%`,
      change: '+5%',
      changeType: 'increase' as const,
      icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z',
      gradient: 'from-amber-500 to-orange-500'
    }
  ];

  const getActivityIcon = (type: RecentActivity['type']) => {
    const icons = {
      call: 'M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z',
      meeting: 'M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z',
      deal: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      lead: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z'
    };
    return icons[type];
  };

  const getActivityColor = (status: RecentActivity['status']) => {
    const colors = {
      success: 'text-green-600 bg-green-100',
      pending: 'text-blue-600 bg-blue-100',
      warning: 'text-amber-600 bg-amber-100'
    };
    return colors[status];
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="animate-slide-in-left">
          <h1 className="text-4xl font-bold text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Chào mừng trở lại! Đây là tổng quan hoạt động hôm nay.</p>
        </div>
        
        <div className="flex items-center space-x-4 animate-slide-in-right">
          <div className="flex items-center space-x-2 glass-morphism px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-gray-700">Live Updates</span>
          </div>
          
          <Button 
            variant="primary"
            leftIcon="M12 4.5v15m7.5-7.5h-15"
            onClick={() => onNavigate('clients')}
          >
            Thêm khách hàng
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 stagger-animation">
        {statsCards.map((stat, index) => (
          <Card 
            key={stat.title} 
            glassy 
            className="hover-lift"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <div className={`flex items-center mt-2 text-sm ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <Icon 
                    path={stat.changeType === 'increase' 
                      ? 'M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941' 
                      : 'M2.25 6L9 12.75l4.306-4.307a11.95 11.95 0 015.814 5.519l2.74 1.22m0 0l-5.94 2.28m5.94-2.28l-2.28-5.941'
                    } 
                    className="w-4 h-4 mr-1" 
                  />
                  {stat.change} so với tháng trước
                </div>
              </div>
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center shadow-lg animate-float`}>
                <Icon path={stat.icon} className="w-8 h-8 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2">
          <Card glassy className="h-96">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Doanh thu theo tháng</h3>
                <p className="text-gray-600">Xu hướng doanh thu 6 tháng gần nhất</p>
              </div>
              
              <div className="flex items-center space-x-2">
                {(['today', 'week', 'month', 'year'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      timeRange === range
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {range === 'today' ? 'Hôm nay' : range === 'week' ? 'Tuần' : range === 'month' ? 'Tháng' : 'Năm'}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="h-64">
              <AnimatedChart data={revenueChartData} height={250} type="bar" />
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card glassy>
          <h3 className="text-xl font-bold text-gray-900 mb-6">Hành động nhanh</h3>
          <div className="space-y-4">
            <Button 
              fullWidth 
              variant="primary"
              leftIcon="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.663M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z"
              onClick={() => onNavigate('clients')}
            >
              Quản lý khách hàng
            </Button>
            <Button 
              fullWidth 
              variant="secondary"
              leftIcon="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5"
              onClick={() => onNavigate('projects')}
            >
              Kho dự án
            </Button>
            <Button 
              fullWidth 
              variant="secondary"
              leftIcon="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
              onClick={() => onNavigate('ai')}
            >
              AI Assistant
            </Button>
          </div>

          <div className="mt-8">
            <h4 className="font-semibold text-gray-900 mb-4">Tiến độ mục tiêu tháng</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Deals đã đóng</span>
                  <span>{stats.closedDeals}/20</span>
                </div>
                <Progress value={stats.closedDeals} max={20} variant="success" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Khách hàng mới</span>
                  <span>{stats.newLeads}/30</span>
                </div>
                <Progress value={stats.newLeads} max={30} variant="primary" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Doanh thu (tỷ VNĐ)</span>
                  <span>{stats.monthlyRevenue.toFixed(1)}/50</span>
                </div>
                <Progress value={stats.monthlyRevenue} max={50} variant="warning" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card glassy>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Hoạt động gần đây</h3>
            <Button variant="ghost" size="sm">
              Xem tất cả
            </Button>
          </div>
          
          <div className="space-y-4">
            {MOCK_ACTIVITIES.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(activity.status)}`}>
                  <Icon path={getActivityIcon(activity.type)} className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{activity.client}</p>
                  <p className="text-sm text-gray-600">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Clients */}
        <Card glassy>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Khách hàng tiềm năng</h3>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('clients')}>
              Xem tất cả
            </Button>
          </div>
          
          <div className="space-y-4">
            {clients.slice(0, 5).map((client, index) => (
              <div key={client.id} className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <Avatar
                  src={client.avatar}
                  alt={client.name}
                  status="online"
                  size="md"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{client.name}</p>
                  <p className="text-sm text-gray-600">{client.phone}</p>
                </div>
                <div className="text-right">
                  <Badge 
                    variant={client.status === 'interested' ? 'success' : client.status === 'new' ? 'warning' : 'secondary'}
                    size="sm"
                  >
                    {client.status === 'interested' ? 'Quan tâm' : client.status === 'new' ? 'Mới' : 'Đã đóng'}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">
                    {client.propertyInterest?.type || 'Chưa xác định'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};