import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '../Icon';

// Voice Visualizer Component
interface VoiceVisualizerProps {
  isListening: boolean;
  amplitude?: number;
}

export const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({ 
  isListening, 
  amplitude = 0.5 
}) => {
  const [bars, setBars] = useState<number[]>(Array(12).fill(0));

  useEffect(() => {
    if (!isListening) {
      setBars(Array(12).fill(0));
      return;
    }

    const interval = setInterval(() => {
      setBars(prev => prev.map(() => Math.random() * amplitude + 0.1));
    }, 100);

    return () => clearInterval(interval);
  }, [isListening, amplitude]);

  return (
    <div className="flex items-center justify-center space-x-1 h-8">
      {bars.map((height, index) => (
        <div
          key={index}
          className={`w-1 bg-gradient-to-t from-blue-400 to-purple-500 rounded-full transition-all duration-100 ${
            isListening ? 'animate-pulse' : ''
          }`}
          style={{
            height: `${Math.max(height * 32, 4)}px`,
            animationDelay: `${index * 50}ms`
          }}
        />
      ))}
    </div>
  );
};

// File Drop Zone Component
interface FileDropZoneProps {
  onFilesDrop: (files: File[]) => void;
  acceptedTypes?: string[];
  maxSize?: number; // in MB
  disabled?: boolean;
  className?: string;
}

export const FileDropZone: React.FC<FileDropZoneProps> = ({
  onFilesDrop,
  acceptedTypes = ['image/*', 'application/pdf'],
  maxSize = 10,
  disabled = false,
  className = ''
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(file => {
      const validType = acceptedTypes.some(type => {
        if (type.includes('*')) {
          return file.type.startsWith(type.replace('*', ''));
        }
        return file.type === type;
      });
      const validSize = file.size <= maxSize * 1024 * 1024;
      return validType && validSize;
    });

    if (validFiles.length > 0) {
      simulateUpload(validFiles);
      onFilesDrop(validFiles);
    }
  };

  const simulateUpload = (files: File[]) => {
    files.forEach(file => {
      const fileName = file.name;
      setUploadProgress(prev => ({ ...prev, [fileName]: 0 }));

      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const currentProgress = prev[fileName] || 0;
          const newProgress = currentProgress + Math.random() * 20;
          
          if (newProgress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setUploadProgress(prev => {
                const { [fileName]: _, ...rest } = prev;
                return rest;
              });
            }, 1000);
            return { ...prev, [fileName]: 100 };
          }
          
          return { ...prev, [fileName]: newProgress };
        });
      }, 200);
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      simulateUpload(files);
      onFilesDrop(files);
    }
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-xl transition-all duration-300 ${
        isDragOver
          ? 'border-blue-400 bg-blue-50 scale-105'
          : 'border-gray-300 hover:border-gray-400'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(',')}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />
      
      <div className="p-8 text-center">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 transition-all duration-300 ${
          isDragOver ? 'bg-blue-100 scale-110' : 'bg-gray-100'
        }`}>
          <Icon 
            path="M7 16V4m0 0L3 8m4-4l4 4m6 8v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2m14-10V4a2 2 0 00-2-2H9a2 2 0 00-2 2v10m10 0V9a2 2 0 00-2-2H7" 
            className={`w-8 h-8 transition-colors duration-300 ${
              isDragOver ? 'text-blue-500' : 'text-gray-400'
            }`}
          />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          {isDragOver ? 'Thả files vào đây' : 'Tải lên hình ảnh hoặc tài liệu'}
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Hỗ trợ: {acceptedTypes.join(', ')} • Tối đa {maxSize}MB
        </p>
        
        {!disabled && (
          <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            Chọn files
          </button>
        )}
      </div>

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="absolute inset-0 bg-white bg-opacity-95 rounded-xl flex items-center justify-center backdrop-blur-sm">
          <div className="text-center">
            {Object.entries(uploadProgress).map(([fileName, progress]) => (
              <div key={fileName} className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">{fileName}</p>
                <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{Math.round(progress)}%</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Animated Chart Component
interface AnimatedChartProps {
  data: { label: string; value: number; color?: string }[];
  type?: 'bar' | 'line' | 'pie';
  height?: number;
  animated?: boolean;
}

export const AnimatedChart: React.FC<AnimatedChartProps> = ({
  data,
  type = 'bar',
  height = 200,
  animated = true
}) => {
  const [animatedData, setAnimatedData] = useState(data.map(item => ({ ...item, value: 0 })));

  useEffect(() => {
    if (animated) {
      const timeout = setTimeout(() => {
        setAnimatedData(data);
      }, 100);
      return () => clearTimeout(timeout);
    } else {
      setAnimatedData(data);
    }
  }, [data, animated]);

  const maxValue = Math.max(...data.map(item => item.value));

  if (type === 'bar') {
    return (
      <div className="w-full" style={{ height }}>
        <div className="flex items-end justify-between h-full space-x-2">
          {animatedData.map((item, index) => (
            <div key={item.label} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gray-100 rounded-t-lg overflow-hidden">
                <div
                  className={`transition-all duration-1000 ease-out rounded-t-lg ${
                    item.color || 'bg-gradient-to-t from-blue-400 to-blue-600'
                  }`}
                  style={{
                    height: `${(item.value / maxValue) * (height - 60)}px`,
                    transitionDelay: `${index * 100}ms`
                  }}
                />
              </div>
              <p className="text-xs text-gray-600 mt-2 text-center">{item.label}</p>
              <p className="text-xs font-semibold text-gray-800">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Add other chart types here (line, pie)
  return <div>Chart type not implemented yet</div>;
};

// Loading Skeleton Components
export const MessageSkeleton: React.FC = () => (
  <div className="flex space-x-3 p-4 animate-pulse">
    <div className="w-8 h-8 bg-gray-200 rounded-full" />
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
    </div>
  </div>
);

export const PropertyCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
    <div className="h-40 bg-gray-200 rounded-lg mb-4" />
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="h-4 bg-gray-200 rounded w-2/3" />
    </div>
  </div>
);

// Floating Action Button
interface FloatingActionButtonProps {
  onClick: () => void;
  icon: string;
  label: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onClick,
  icon,
  label,
  color = 'bg-gradient-to-r from-blue-500 to-purple-600',
  size = 'md',
  position = 'bottom-right'
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-14 h-14',
    lg: 'w-16 h-16'
  };

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  };

  return (
    <div className={`fixed z-50 ${positionClasses[position]}`}>
      <button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`${sizeClasses[size]} ${color} text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center`}
      >
        <Icon path={icon} className="w-6 h-6" />
      </button>
      
      {/* Tooltip */}
      {isHovered && (
        <div className={`absolute ${
          position.includes('right') ? 'right-0 mr-16' : 'left-0 ml-16'
        } ${
          position.includes('bottom') ? 'bottom-0' : 'top-0'
        } bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap animate-fade-in`}>
          {label}
          <div className={`absolute top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45 ${
            position.includes('right') ? '-right-1' : '-left-1'
          }`} />
        </div>
      )}
    </div>
  );
};

// Progress Ring Component
interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  showText?: boolean;
  animated?: boolean;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 100,
  strokeWidth = 8,
  color = '#3B82F6',
  backgroundColor = '#E5E7EB',
  showText = true,
  animated = true
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference;

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setAnimatedProgress(progress);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setAnimatedProgress(progress);
    }
  }, [progress, animated]);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      
      {showText && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-semibold text-gray-700">
            {Math.round(animatedProgress)}%
          </span>
        </div>
      )}
    </div>
  );
};

// Notification Toast
interface NotificationToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeStyles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  const icons = {
    success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
    warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L5.204 16.5c-.77.833.192 2.5 1.732 2.5z',
    info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  };

  return (
    <div className={`fixed top-4 right-4 max-w-sm w-full border-l-4 p-4 rounded-lg shadow-lg animate-slide-in-right z-50 ${typeStyles[type]}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Icon path={icons[type]} className="w-5 h-5" />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-3 flex-shrink-0 hover:opacity-70 transition-opacity"
        >
          <Icon path="M6 18L18 6M6 6l12 12" className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};