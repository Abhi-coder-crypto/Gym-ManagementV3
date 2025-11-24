import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  colorScheme?: 'red' | 'purple' | 'orange' | 'green' | 'pink' | 'cyan';
}

const colorSchemes = {
  red: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    icon: 'text-red-600 dark:text-red-400',
    text: 'text-red-900 dark:text-red-100',
    badge: 'text-red-700 dark:text-red-300'
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    icon: 'text-purple-600 dark:text-purple-400',
    text: 'text-purple-900 dark:text-purple-100',
    badge: 'text-purple-700 dark:text-purple-300'
  },
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    icon: 'text-orange-600 dark:text-orange-400',
    text: 'text-orange-900 dark:text-orange-100',
    badge: 'text-orange-700 dark:text-orange-300'
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    icon: 'text-green-600 dark:text-green-400',
    text: 'text-green-900 dark:text-green-100',
    badge: 'text-green-700 dark:text-green-300'
  },
  pink: {
    bg: 'bg-pink-50 dark:bg-pink-900/20',
    icon: 'text-pink-600 dark:text-pink-400',
    text: 'text-pink-900 dark:text-pink-100',
    badge: 'text-pink-700 dark:text-pink-300'
  },
  cyan: {
    bg: 'bg-cyan-50 dark:bg-cyan-900/20',
    icon: 'text-cyan-600 dark:text-cyan-400',
    text: 'text-cyan-900 dark:text-cyan-100',
    badge: 'text-cyan-700 dark:text-cyan-300'
  }
} as const;

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendUp,
  colorScheme = 'red'
}: StatCardProps) {
  const colors = colorSchemes[colorScheme] || colorSchemes.red;
  
  return (
    <div 
      className={`${colors.bg} rounded-lg p-6 border border-gray-100 dark:border-gray-800 transition-all hover-elevate`}
      data-testid={`card-stat-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          {title}
        </h3>
        <div className={`p-2 rounded-lg bg-white/50 dark:bg-black/20`}>
          <Icon className={`h-5 w-5 ${colors.icon}`} />
        </div>
      </div>
      <div>
        <div className={`text-3xl font-bold font-display ${colors.text}`} data-testid={`text-stat-value-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          {value}
        </div>
        {trend && (
          <p className={`text-xs mt-2 ${colors.badge}`} data-testid="text-trend">
            {trend}
          </p>
        )}
      </div>
    </div>
  );
}
