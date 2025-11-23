import { StatCard } from "../stat-card";
import { Users, DollarSign, TrendingUp, Activity } from "lucide-react";

export default function StatCardExample() {
  return (
    <div className="p-8 grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl">
      <StatCard
        title="Total Clients"
        value={156}
        icon={Users}
        trend="+12% from last month"
        trendUp={true}
      />
      <StatCard
        title="Active Users"
        value={142}
        icon={Activity}
        trend="+8% from last month"
        trendUp={true}
      />
      <StatCard
        title="Monthly Revenue"
        value="$8,420"
        icon={DollarSign}
        trend="+23% from last month"
        trendUp={true}
      />
      <StatCard
        title="Growth Rate"
        value="18%"
        icon={TrendingUp}
        trend="Steady increase"
        trendUp={true}
      />
    </div>
  );
}
