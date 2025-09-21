
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Client } from '../types';
import { PipelineStatus } from '../types';
import { Icon } from './Icon';

interface DashboardProps {
  clients: Client[];
  onNavigate: (view: string) => void;
}

const KpiCard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4">
    <div className={`rounded-full p-3 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ clients }) => {
  const dealsInProgress = clients.filter(c => 
    c.status === PipelineStatus.Consulting || 
    c.status === PipelineStatus.Meeting || 
    c.status === PipelineStatus.Negotiating
  ).length;

  const successfulDeals = clients.filter(c => c.status === PipelineStatus.Closed).length;
  const newClients = clients.filter(c => c.status === PipelineStatus.New).length;

  const totalRevenue = clients
    .filter(c => c.status === PipelineStatus.Closed)
    .reduce((sum, client) => sum + client.budget, 0);

  const chartData = [
    { name: 'Tháng 5', 'Deal thành công': 3, 'Doanh số (tỷ)': 12 },
    { name: 'Tháng 6', 'Deal thành công': 5, 'Doanh số (tỷ)': 21 },
    { name: 'Tháng 7', 'Deal thành công': successfulDeals, 'Doanh số (tỷ)': totalRevenue / 1000000000 },
  ];

  const formatCurrency = (value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Bảng điều khiển</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Khách hàng mới" value={String(newClients)} icon={<Icon path="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" className="w-6 h-6 text-blue-800" />} color="bg-blue-100" />
        <KpiCard title="Deal đang theo dõi" value={String(dealsInProgress)} icon={<Icon path="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-3.182-3.182m3.182 3.182v3.182" className="w-6 h-6 text-yellow-800" />} color="bg-yellow-100" />
        <KpiCard title="Deal thành công" value={String(successfulDeals)} icon={<Icon path="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.321h5.385c.414 0 .79.336.79.752a.748.748 0 01-.383.649l-4.36 3.182a.563.563 0 00-.182.557l1.634 5.053a.562.562 0 01-.812.622l-4.39-3.181a.563.563 0 00-.642 0l-4.39 3.181a.562.562 0 01-.812-.622l1.634-5.053a.563.563 0 00-.182-.557l-4.36-3.182a.75.75 0 01.383-.65h5.385a.563.563 0 00.475-.321l2.125-5.11z" className="w-6 h-6 text-green-800" />} color="bg-green-100" />
        <KpiCard title="Tổng doanh số" value={formatCurrency(totalRevenue)} icon={<Icon path="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.75A.75.75 0 013 4.5h.75m0 0h.75A.75.75 0 015.25 6v.75m0 0v.75a.75.75 0 014.5 8.25h-.75m0 0h-.75A.75.75 0 012.25 7.5v-.75M3 15v-2.25A.75.75 0 013.75 12h.75m0 0h.75a.75.75 0 01.75.75v2.25m0 0v.75a.75.75 0 01-.75.75h-.75M3.75 12h.75m0 0v.75a.75.75 0 01-.75.75h-.75m0 0H3m1.5-3.75h.75a.75.75 0 01.75.75v.75m0 0v.75a.75.75 0 01-.75.75h-.75M4.5 11.25h.75m0 0v.75a.75.75 0 01-.75.75h-.75m0 0H3m1.5-3.75h.75a.75.75 0 01.75.75v.75m0 0v.75a.75.75 0 01-.75.75h-.75m0 0H3m1.5-3.75h.75a.75.75 0 01.75.75v.75m0 0v.75a.75.75 0 01-.75.75h-.75m0 0H3m7.5-12.75h.75a.75.75 0 01.75.75v.75m0 0v.75a.75.75 0 01-.75.75h-.75m0 0h.75a.75.75 0 01.75.75v.75m0 0v.75a.75.75 0 01-.75.75h-.75m0 0h-.75a.75.75 0 01-.75-.75v-.75m0 0v-.75a.75.75 0 01.75-.75h.75m0 0h.75a.75.75 0 01.75.75v.75m0 0v.75a.75.75 0 01-.75.75h-.75M12 8.25h.75a.75.75 0 01.75.75v.75m0 0v.75a.75.75 0 01-.75.75h-.75m0 0h.75a.75.75 0 01.75.75v.75m0 0v.75a.75.75 0 01-.75.75h-.75m0 0h-.75a.75.75 0 01-.75-.75v-.75m0 0v-.75a.75.75 0 01.75-.75h.75M12 15h.75a.75.75 0 01.75.75v.75m0 0v.75a.75.75 0 01-.75.75h-.75m0 0h.75a.75.75 0 01.75.75v.75m0 0v.75a.75.75 0 01-.75.75h-.75m0 0h-.75a.75.75 0 01-.75-.75v-.75m0 0v-.75a.75.75 0 01.75-.75h.75m-7.5-3.75h.75a.75.75 0 01.75.75v.75m0 0v.75a.75.75 0 01-.75.75h-.75m0 0h.75a.75.75 0 01.75.75v.75m0 0v.75a.75.75 0 01-.75.75h-.75m0 0h-.75a.75.75 0 01-.75-.75v-.75m0 0v-.75a.75.75 0 01.75-.75h.75m7.5 3.75h.75a.75.75 0 01.75.75v.75m0 0v.75a.75.75 0 01-.75.75h-.75m0 0h.75a.75.75 0 01.75.75v.75m0 0v.75a.75.75 0 01-.75.75h-.75m0 0h-.75a.75.75 0 01-.75-.75v-.75m0 0v-.75a.75.75 0 01.75-.75h.75m-3-3.75h.75a.75.75 0 01.75.75v.75m0 0v.75a.75.75 0 01-.75.75h-.75m0 0h.75a.75.75 0 01.75.75v.75m0 0v.75a.75.75 0 01-.75.75h-.75m0 0h-.75a.75.75 0 01-.75-.75v-.75m0 0v-.75a.75.75 0 01.75-.75h.75m-3 3.75h.75a.75.75 0 01.75.75v.75m0 0v.75a.75.75 0 01-.75.75h-.75m0 0h.75a.75.75 0 01.75.75v.75m0 0v.75a.75.75 0 01-.75.75h-.75m0 0h-.75a.75.75 0 01-.75-.75v-.75m0 0v-.75a.75.75 0 01.75-.75h.75m-3 3.75h.75a.75.75 0 01.75.75v.75m0 0v.75a.75.75 0 01-.75.75h-.75m0 0h.75a.75.75 0 01.75.75v.75m0 0v.75a.75.75 0 01-.75.75h-.75m0 0h-.75a.75.75 0 01-.75-.75v-.75m0 0v-.75a.75.75 0 01.75-.75h.75" className="w-6 h-6 text-purple-800" />} color="bg-purple-100" />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Thống kê hiệu suất</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip formatter={(value, name) => `${value} ${name === 'Doanh số (tỷ)' ? 'tỷ' : ''}`} />
              <Legend />
              <Bar yAxisId="left" dataKey="Doanh số (tỷ)" fill="#8884d8" />
              <Bar yAxisId="right" dataKey="Deal thành công" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
