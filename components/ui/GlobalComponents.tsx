import React, { forwardRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Icon } from '../Icon';

// Button Component với variants
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}, ref) => {
  const { isDark } = useTheme();

  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: `bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 focus:ring-blue-500`,
    secondary: `glass-morphism text-gray-700 hover:shadow-lg transform hover:scale-105 focus:ring-blue-500 ${isDark ? 'text-gray-200' : 'text-gray-700'}`,
    ghost: `text-gray-600 hover:bg-gray-100 focus:ring-gray-500 ${isDark ? 'text-gray-300 hover:bg-gray-800' : ''}`,
    outline: `border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500 ${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-800' : ''}`,
    danger: `bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 shadow-lg hover:shadow-xl transform hover:scale-105 focus:ring-red-500`
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      ref={ref}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-current" />
      )}
      {leftIcon && !loading && (
        <Icon path={leftIcon} className="mr-2 h-4 w-4" />
      )}
      {children}
      {rightIcon && (
        <Icon path={rightIcon} className="ml-2 h-4 w-4" />
      )}
    </button>
  );
});

Button.displayName = 'Button';

// Card Component
interface CardProps {
  children: React.ReactNode;
  className?: string;
  glassy?: boolean;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  glassy = false,
  hover = true,
  padding = 'md'
}) => {
  const { isDark } = useTheme();

  const baseStyles = 'rounded-2xl shadow-lg transition-all duration-300';
  const glassyStyles = glassy ? 'glass-morphism backdrop-blur-xl' : `bg-white ${isDark ? 'bg-gray-800' : ''}`;
  const hoverStyles = hover ? 'hover:shadow-xl hover:scale-105 transform' : '';
  
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div className={`${baseStyles} ${glassyStyles} ${hoverStyles} ${paddingStyles[padding]} ${className}`}>
      {children}
    </div>
  );
};

// Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: string;
  rightIcon?: string;
  glassy?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  leftIcon,
  rightIcon,
  glassy = false,
  className = '',
  ...props
}, ref) => {
  const { isDark } = useTheme();

  const baseStyles = 'block w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500';
  const glassyStyles = glassy 
    ? 'glass-morphism border-white/20 text-gray-800 placeholder-gray-500'
    : `border-gray-300 ${isDark ? 'bg-gray-800 border-gray-600 text-gray-200' : 'bg-white text-gray-900'}`;
  
  const errorStyles = error ? 'border-red-500 focus:ring-red-500' : '';
  const iconPadding = leftIcon ? 'pl-12' : rightIcon ? 'pr-12' : '';

  return (
    <div>
      {label && (
        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon path={leftIcon} className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          ref={ref}
          className={`${baseStyles} ${glassyStyles} ${errorStyles} ${iconPadding} ${className}`}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Icon path={rightIcon} className="h-5 w-5 text-gray-400" />
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <Icon path="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L5.204 16.5c-.77.833.192 2.5 1.732 2.5z" className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// Badge Component
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = ''
}) => {
  const variants = {
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800'
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};

// Avatar Component
interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'busy' | 'away';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  size = 'md',
  status,
  className = ''
}) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    busy: 'bg-red-500',
    away: 'bg-yellow-500'
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <img
        src={src || `https://picsum.photos/seed/${alt}/64/64`}
        alt={alt}
        className={`${sizes[size]} rounded-full object-cover border-2 border-white shadow-lg hover:scale-110 transition-transform duration-300`}
      />
      {status && (
        <div className={`absolute bottom-0 right-0 w-3 h-3 ${statusColors[status]} rounded-full border-2 border-white`} />
      )}
    </div>
  );
};

// Modal Component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  glassy?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  glassy = true
}) => {
  const { isDark } = useTheme();

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className={`relative w-full ${sizes[size]} animate-scale-in`}>
        <div className={`rounded-2xl shadow-2xl ${glassy ? 'glass-morphism backdrop-blur-xl' : `bg-white ${isDark ? 'bg-gray-800' : ''}`}`}>
          {title && (
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Icon path="M6 18L18 6M6 6l12 12" className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// Progress Component
interface ProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'success' | 'warning' | 'danger';
  showLabel?: boolean;
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  size = 'md',
  variant = 'primary',
  showLabel = false,
  className = ''
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const variants = {
    primary: 'from-blue-500 to-purple-600',
    success: 'from-green-500 to-emerald-600',
    warning: 'from-yellow-500 to-orange-600',
    danger: 'from-red-500 to-pink-600'
  };

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className={`bg-gradient-to-r ${variants[variant]} ${sizes[size]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Tabs Component
interface Tab {
  id: string;
  label: string;
  icon?: string;
  badge?: string | number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  variant = 'default',
  size = 'md'
}) => {
  const { isDark } = useTheme();

  const variants = {
    default: 'border-b border-gray-200',
    pills: '',
    underline: 'border-b-2 border-transparent'
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg'
  };

  return (
    <div className={`flex space-x-1 ${variants[variant]}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            flex items-center space-x-2 font-medium rounded-lg transition-all duration-300
            ${sizes[size]}
            ${activeTab === tab.id
              ? variant === 'pills' 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : 'text-blue-600 border-b-2 border-blue-600'
              : `text-gray-600 hover:text-gray-900 ${isDark ? 'text-gray-400 hover:text-gray-200' : ''}`
            }
          `}
        >
          {tab.icon && <Icon path={tab.icon} className="w-4 h-4" />}
          <span>{tab.label}</span>
          {tab.badge && (
            <Badge size="sm" variant="primary">
              {tab.badge}
            </Badge>
          )}
        </button>
      ))}
    </div>
  );
};

// Dropdown Component
interface DropdownOption {
  value: string;
  label: string;
  icon?: string;
  disabled?: boolean;
}

interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onSelect,
  placeholder = 'Select an option',
  disabled = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { isDark } = useTheme();

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-xl
          transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500
          ${isDark ? 'bg-gray-800 border-gray-600 text-gray-200' : 'text-gray-900'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'}
        `}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {selectedOption?.icon && (
              <Icon path={selectedOption.icon} className="w-4 h-4" />
            )}
            <span>{selectedOption?.label || placeholder}</span>
          </div>
          <Icon 
            path="M19.5 8.25l-7.5 7.5-7.5-7.5" 
            className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </div>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)} 
          />
          <div className={`
            absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg
            max-h-60 overflow-y-auto
            ${isDark ? 'bg-gray-800 border-gray-600' : ''}
          `}>
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onSelect(option.value);
                  setIsOpen(false);
                }}
                disabled={option.disabled}
                className={`
                  w-full px-4 py-3 text-left flex items-center space-x-2
                  transition-colors duration-200
                  ${option.disabled 
                    ? 'opacity-50 cursor-not-allowed' 
                    : `hover:bg-gray-100 ${isDark ? 'hover:bg-gray-700' : ''}`
                  }
                  ${value === option.value ? 'bg-blue-50 text-blue-600' : ''}
                `}
              >
                {option.icon && <Icon path={option.icon} className="w-4 h-4" />}
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};