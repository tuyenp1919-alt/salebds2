
import React from 'react';
import type { Project } from '../types';
import { Icon } from './Icon';

interface ProjectCardProps {
  project: Project;
  isSelected: boolean;
  onSelect: (id: number) => void;
  onCompare: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, isSelected, onSelect, onCompare }) => {
  const formatCurrency = (value: number) => `${(value / 1000000000).toFixed(1)} tỷ`;

  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ${isSelected ? 'ring-2 ring-blue-500 shadow-xl' : 'hover:shadow-lg'}`}
      onClick={() => onSelect(project.id)}
    >
      <img src={project.imageUrl} alt={project.name} className="w-full h-40 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900">{project.name}</h3>
        <p className="text-sm text-gray-500 flex items-center mt-1">
          <Icon path="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" className="w-4 h-4 mr-1"/>
          <Icon path="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" className="w-4 h-4 mr-1" />
          {project.location}
        </p>
        <div className="mt-3 text-sm space-y-2 text-gray-700">
          <div className="flex justify-between">
            <span>Giá:</span>
            <span className="font-semibold">{formatCurrency(project.priceMin)} - {formatCurrency(project.priceMax)}</span>
          </div>
          <div className="flex justify-between">
            <span>Diện tích:</span>
            <span className="font-semibold">{project.areaMin} - {project.areaMax} m²</span>
          </div>
           <div className="flex justify-between">
            <span>Loại hình:</span>
            <span className="font-semibold">{project.type}</span>
          </div>
        </div>
         <div className="mt-4 flex justify-end">
            <button
                onClick={(e) => { e.stopPropagation(); onCompare(project); }}
                className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-1 px-3 rounded-lg transition duration-300 flex items-center"
              >
                <Icon path="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M21 21v-4.5m0 4.5h-4.5m4.5 0L15 15M3 21h4.5m-4.5 0v-4.5m4.5 4.5L9 15M21 3h-4.5m4.5 0v4.5m-4.5-4.5L15 9" className="w-4 h-4 mr-2"/>
                So sánh
            </button>
        </div>
      </div>
    </div>
  );
};
