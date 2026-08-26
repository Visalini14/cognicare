import React from 'react';
import type { LucideIcon } from 'lucide-react';

/* BUTTON COMPONENT - ELDERLY ACCESSIBLE */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: LucideIcon;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'lg',
  icon: Icon,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyle = 'inline-flex items-center justify-center font-bold rounded-2xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-teal-700/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98] select-none text-center';

  const variants = {
    primary: 'bg-teal-700 hover:bg-teal-800 text-white shadow-md border-2 border-teal-800',
    secondary: 'bg-indigo-700 hover:bg-indigo-800 text-white shadow-md border-2 border-indigo-800',
    accent: 'bg-amber-600 hover:bg-amber-700 text-white shadow-md border-2 border-amber-700',
    outline: 'bg-white hover:bg-slate-100 text-slate-800 border-2 border-slate-300 shadow-sm',
    danger: 'bg-rose-700 hover:bg-rose-800 text-white shadow-md border-2 border-rose-800',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-700 hover:text-slate-900',
  };

  const sizes = {
    sm: 'text-sm px-4 py-2.5 gap-2 min-h-[44px]',
    md: 'text-base px-6 py-3.5 gap-2.5 min-h-[52px]',
    lg: 'text-lg px-8 py-4 gap-3 min-h-[60px]',
    xl: 'text-xl px-10 py-5 gap-3.5 min-h-[72px] tracking-wide font-extrabold',
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {Icon && <Icon className={size === 'xl' ? 'w-7 h-7' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} />}
      {children}
    </button>
  );
};

/* CARD COMPONENT */
interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverEffect = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`elderly-card p-6 sm:p-8 ${
        hoverEffect ? 'hover:-translate-y-1 cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

/* STAT CARD COMPONENT */
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'teal' | 'indigo' | 'emerald' | 'amber' | 'rose';
  trend?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'teal',
  trend,
}) => {
  const colorMap = {
    teal: 'bg-teal-50 text-teal-800 border-2 border-teal-300',
    indigo: 'bg-indigo-50 text-indigo-800 border-2 border-indigo-300',
    emerald: 'bg-emerald-50 text-emerald-800 border-2 border-emerald-300',
    amber: 'bg-amber-50 text-amber-800 border-2 border-amber-300',
    rose: 'bg-rose-50 text-rose-800 border-2 border-rose-300',
  };

  return (
    <Card className="flex items-start gap-4 p-6">
      <div className={`p-4 rounded-2xl ${colorMap[color]}`}>
        <Icon className="w-7 h-7" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">{title}</p>
        <div className="flex items-baseline gap-2 mt-1">
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
          {trend && <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">{trend}</span>}
        </div>
        {subtitle && <p className="text-xs font-medium text-slate-500 mt-1">{subtitle}</p>}
      </div>
    </Card>
  );
};

/* BADGE COMPONENT FOR DIFFICULTY TIERS */
export const DifficultyBadge: React.FC<{ level: number }> = ({ level }) => {
  const levelStyles: Record<number, { bg: string; label: string }> = {
    1: { bg: 'bg-emerald-100 border-2 border-emerald-400 text-emerald-900', label: 'Level 1' },
    2: { bg: 'bg-teal-100 border-2 border-teal-400 text-teal-900', label: 'Level 2' },
    3: { bg: 'bg-sky-100 border-2 border-sky-400 text-sky-900', label: 'Level 3' },
    4: { bg: 'bg-amber-100 border-2 border-amber-400 text-amber-900', label: 'Level 4' },
    5: { bg: 'bg-rose-100 border-2 border-rose-400 text-rose-900', label: 'Level 5' },
  };

  const style = levelStyles[Math.max(1, Math.min(5, level))];

  return (
    <span className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${style.bg}`}>
      {style.label}
    </span>
  );
};

/* PROGRESS BAR COMPONENT */
export const ProgressBar: React.FC<{ value: number; max?: number; color?: string; className?: string }> = ({
  value,
  max = 100,
  color = 'bg-teal-700',
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={`w-full bg-slate-200 rounded-full h-4 overflow-hidden border border-slate-300 ${className}`}>
      <div
        className={`h-full transition-all duration-500 ease-out rounded-full ${color}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

/* MODAL COMPONENT - SCROLLABLE & RESPONSIVE FOR ALL SCREEN HEIGHTS */
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center min-h-screen">
      {/* Clickable Backdrop overlay to close */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Content Box */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-xl w-full my-auto border-2 border-slate-300 flex flex-col max-h-[85vh] z-10 overflow-hidden">
        {/* Sticky Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50 shrink-0">
          <h3 className="text-2xl font-extrabold text-slate-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-3xl leading-none px-3 py-1 rounded-xl cursor-pointer"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        {/* Scrollable Body Container */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-4">{children}</div>
      </div>
    </div>
  );
};

/* INPUT & SELECT */
export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }> = ({
  label,
  error,
  className = '',
  ...props
}) => (
  <div className="w-full mb-5">
    {label && <label className="block text-base font-bold text-slate-800 mb-2">{label}</label>}
    <input
      className={`w-full px-5 py-4 bg-white border-2 border-slate-300 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-teal-700/40 focus:border-teal-700 text-lg transition-all ${
        error ? 'border-rose-600 focus:ring-rose-600' : ''
      } ${className}`}
      {...props}
    />
    {error && <p className="text-sm text-rose-700 mt-1 font-bold">{error}</p>}
  </div>
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string; options: { value: string; label: string }[] }> = ({
  label,
  options,
  className = '',
  ...props
}) => (
  <div className="w-full mb-5">
    {label && <label className="block text-base font-bold text-slate-800 mb-2">{label}</label>}
    <select
      className={`w-full px-5 py-4 bg-white border-2 border-slate-300 rounded-2xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-teal-700/40 focus:border-teal-700 text-lg cursor-pointer font-semibold ${className}`}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

/* EMPTY & LOADING STATES */
export const EmptyState: React.FC<{ title: string; description: string; icon?: LucideIcon; action?: React.ReactNode }> = ({
  title,
  description,
  icon: Icon,
  action,
}) => (
  <div className="text-center py-14 px-8 bg-white border-2 border-dashed border-slate-300 rounded-3xl">
    {Icon && <Icon className="w-14 h-14 text-slate-400 mx-auto mb-4" />}
    <h4 className="text-2xl font-black text-slate-800">{title}</h4>
    <p className="text-base text-slate-600 max-w-md mx-auto mt-2 mb-6 leading-relaxed font-medium">{description}</p>
    {action}
  </div>
);

export const LoadingState: React.FC<{ message?: string }> = ({ message = 'Loading application...' }) => (
  <div className="flex flex-col items-center justify-center min-h-[350px] p-8">
    <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-700 rounded-full animate-spin mb-4" />
    <p className="text-slate-700 font-extrabold text-lg">{message}</p>
  </div>
);
