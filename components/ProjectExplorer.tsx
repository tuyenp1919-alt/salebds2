
import React, { useState, useMemo } from 'react';
import { ProjectCard } from './ProjectCard';
import { INITIAL_PROJECTS, PROPERTY_TYPES } from '../constants';
import type { Project } from '../types';
import { PropertyType } from '../types';
import { Icon } from './Icon';
import { Modal } from './Modal';

const ComparisonModal: React.FC<{ projects: Project[]; onClose: () => void; }> = ({ projects, onClose }) => {
  const formatCurrency = (value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

  return (
    <Modal isOpen={true} onClose={onClose} title="So sánh dự án">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th scope="col" className="px-6 py-3 rounded-l-lg">Tiêu chí</th>
              {projects.map(p => <th key={p.id} scope="col" className="px-6 py-3">{p.name}</th>)}
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white border-b"><th scope="row" className="px-6 py-4 font-medium text-gray-900">Vị trí</th>{projects.map(p => <td key={p.id} className="px-6 py-4">{p.location}</td>)}</tr>
            <tr className="bg-white border-b"><th scope="row" className="px-6 py-4 font-medium text-gray-900">Loại hình</th>{projects.map(p => <td key={p.id} className="px-6 py-4">{p.type}</td>)}</tr>
            <tr className="bg-white border-b"><th scope="row" className="px-6 py-4 font-medium text-gray-900">Giá (VNĐ)</th>{projects.map(p => <td key={p.id} className="px-6 py-4">{formatCurrency(p.priceMin)} - {formatCurrency(p.priceMax)}</td>)}</tr>
            <tr className="bg-white border-b"><th scope="row" className="px-6 py-4 font-medium text-gray-900">Diện tích (m²)</th>{projects.map(p => <td key={p.id} className="px-6 py-4">{p.areaMin} - {p.areaMax}</td>)}</tr>
            <tr className="bg-white"><th scope="row" className="px-6 py-4 font-medium text-gray-900">Mô tả</th>{projects.map(p => <td key={p.id} className="px-6 py-4">{p.description}</td>)}</tr>
          </tbody>
        </table>
      </div>
      <div className="mt-6 flex justify-end">
        <button onClick={onClose} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
          Đóng
        </button>
      </div>
    </Modal>
  );
};

export const ProjectExplorer: React.FC = () => {
  const [projects] = useState<Project[]>(INITIAL_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [filters, setFilters] = useState({
    keyword: '',
    type: 'all',
    price: 50,
  });
  const [compareList, setCompareList] = useState<Project[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const keywordMatch = p.name.toLowerCase().includes(filters.keyword.toLowerCase()) || p.location.toLowerCase().includes(filters.keyword.toLowerCase());
      const typeMatch = filters.type === 'all' || p.type === filters.type;
      const priceMatch = p.priceMax / 1000000000 <= filters.price;
      return keywordMatch && typeMatch && priceMatch;
    });
  }, [projects, filters]);

  const handleAddToCompare = (project: Project) => {
    setCompareList(prev => {
      if (prev.find(p => p.id === project.id)) {
        return prev.filter(p => p.id !== project.id);
      }
      if (prev.length < 3) {
        return [...prev, project];
      }
      alert("Chỉ có thể so sánh tối đa 3 dự án.");
      return prev;
    });
  };

  const startComparison = () => {
    if (compareList.length < 2) {
      alert("Vui lòng chọn ít nhất 2 dự án để so sánh.");
      return;
    }
    setIsCompareModalOpen(true);
  };
  
  return (
    <div className="p-4 md:p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Kho dự án & Sản phẩm</h1>
      
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 sticky top-0 z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" name="keyword" placeholder="Tìm theo tên, vị trí..." value={filters.keyword} onChange={handleFilterChange} className="w-full rounded-md border-gray-300 shadow-sm" />
          <select name="type" value={filters.type} onChange={handleFilterChange} className="w-full rounded-md border-gray-300 shadow-sm">
            <option value="all">Tất cả loại hình</option>
            {PROPERTY_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
          <div>
            <label className="block text-sm font-medium text-gray-700">Giá tối đa: {filters.price} tỷ</label>
            <input type="range" name="price" min="1" max="50" step="1" value={filters.price} onChange={handleFilterChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProjects.map(project => (
          <ProjectCard 
            key={project.id} 
            project={project}
            isSelected={selectedProjectId === project.id}
            onSelect={setSelectedProjectId}
            onCompare={handleAddToCompare}
          />
        ))}
      </div>
       {compareList.length > 0 && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl p-4 z-20">
            <div className="bg-white rounded-lg shadow-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h4 className="font-semibold text-gray-800">Đang so sánh:</h4>
                    {compareList.map(p => (
                        <div key={p.id} className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full flex items-center gap-2">
                            {p.name}
                            <button onClick={() => handleAddToCompare(p)} className="text-blue-600 hover:text-blue-800">
                                <Icon path="M6 18L18 6M6 6l12 12" className="w-3 h-3"/>
                            </button>
                        </div>
                    ))}
                </div>
                <button onClick={startComparison} disabled={compareList.length < 2} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed">
                    So sánh ({compareList.length})
                </button>
            </div>
        </div>
      )}
      {isCompareModalOpen && <ComparisonModal projects={compareList} onClose={() => setIsCompareModalOpen(false)} />}
    </div>
  );
};
