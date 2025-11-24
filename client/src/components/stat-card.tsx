import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  colorScheme?: 'blue' | 'purple' | 'orange' | 'green' | 'pink' | 'cyan';
}

const colorSchemes = {
  blue: {
    bg: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30',
    icon: 'text-blue-600 dark:text-blue-400',
    text: 'text-blue-900 dark:text-blue-100',
    badge: 'text-blue-700 dark:text-blue-300'
  },
  purple: {
    bg: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30',
    icon: 'text-purple-600 dark:text-purple-400',
    text: 'text-purple-900 dark:text-purple-100',
    badge: 'text-purple-700 dark:text-purple-300'
  },
  orange: {
    bg: 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30',
    icon: 'text-orange-600 dark:text-orange-400',
    text: 'text-orange-900 dark:text-orange-100',
    badge: 'text-orange-700 dark:text-orange-300'
  },
  green: {
    bg: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30',
    icon: 'text-green-600 dark:text-green-400',
    text: 'text-green-900 dark:text-green-100',
    badge: 'text-green-700 dark:text-green-300'
  },
  pink: {
    bg: 'bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/30 dark:to-pink-800/30',
    icon: 'text-pink-600 dark:text-pink-400',
    text: 'text-pink-900 dark:text-pink-100',
    badge: 'text-pink-700 dark:text-pink-300'
  },
  cyan: {
    bg: 'bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/30 dark:to-cyan-800/30',
    icon: 'text-cyan-600 dark:text-cyan-400',
    text: 'text-cyan-900 dark:text-cyan-100',
    badge: 'text-cyan-700 dark:text-cyan-300'
  }
};

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendUp,
  colorScheme = 'blue'
}: StatCardProps) {
  const colors = colorSchemes[colorScheme];
  
  return (
    <div 
      className={`${colors.bg} rounded-lg p-6 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all hover-elevate`}
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
