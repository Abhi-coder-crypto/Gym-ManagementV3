import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TrainerSidebar } from "@/components/trainer-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Calendar, Video as VideoIcon, Activity, Award } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Client, LiveSession, Video as VideoType } from "@shared/schema";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function TrainerAnalytics() {
  const style = {
    "--sidebar-width": "16rem",
  };

  const { data: authData } = useQuery<any>({
    queryKey: ['/api/auth/me']
  });

  const user = authData?.user;
  const trainerId = user?._id?.toString() || user?.id;

  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ['/api/trainers', trainerId, 'clients'],
    enabled: !!trainerId
  });

  const { data: sessions = [] } = useQuery<LiveSession[]>({
    queryKey: ['/api/trainers', trainerId, 'sessions'],
    enabled: !!trainerId
  });

  const { data: videos = [] } = useQuery<VideoType[]>({
    queryKey: ['/api/videos'],
    enabled: !!trainerId
  });

  const clientsByGoal = [
    { name: 'Weight Loss', value: clients.filter(c => c.goal?.includes('weight')).length, color: '#3b82f6' },
    { name: 'Muscle Gain', value: clients.filter(c => c.goal?.includes('muscle')).length, color: '#22c55e' },
    { name: 'Fitness', value: clients.filter(c => c.goal?.includes('fitness')).length, color: '#a855f7' },
    { name: 'Other', value: clients.filter(c => !c.goal || (!c.goal.includes('weight') && !c.goal.includes('muscle') && !c.goal.includes('fitness'))).length, color: '#f59e0b' },
  ];

  const clientsByLevel = [
    { name: 'Beginner', value: clients.filter(c => c.fitnessLevel === 'beginner').length },
    { name: 'Intermediate', value: clients.filter(c => c.fitnessLevel === 'intermediate').length },
    { name: 'Advanced', value: clients.filter(c => c.fitnessLevel === 'advanced').length },
  ];

  const monthlyProgress = [
    { month: 'Jan', clients: 5, sessions: 12 },
    { month: 'Feb', clients: 8, sessions: 18 },
    { month: 'Mar', clients: 12, sessions: 24 },
    { month: 'Apr', clients: 15, sessions: 30 },
    { month: 'May', clients: clients.length || 18, sessions: sessions.length || 36 },
  ];

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <TrainerSidebar />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-4">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <h1 className="text-2xl font-display font-bold tracking-tight">
                My Analytics
              </h1>
            </div>
            <ThemeToggle />
          </header>

          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
                  <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
                    <Users className="h-5 w-5 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {clients.filter(c => c.status === 'active').length}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">+{Math.floor(clients.length * 0.15)} this month</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
                  <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                    <Calendar className="h-5 w-5 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">{sessions.length}</div>
                    <p className="text-xs text-muted-foreground mt-1">Lifetime sessions conducted</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20">
                  <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Video Library</CardTitle>
                    <VideoIcon className="h-5 w-5 text-purple-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{videos.length}</div>
                    <p className="text-xs text-muted-foreground mt-1">Training videos created</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                      <CardTitle>Growth Trend</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={monthlyProgress}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))' 
                          }} 
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="clients" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          name="Clients"
                          dot={{ fill: '#3b82f6', r: 4 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="sessions" 
                          stroke="#22c55e" 
                          strokeWidth={2}
                          name="Sessions"
                          dot={{ fill: '#22c55e', r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-green-500" />
                      <CardTitle>Clients by Fitness Level</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={clientsByLevel}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="name" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))' 
                          }} 
                        />
                        <Bar dataKey="value" fill="#22c55e" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-purple-500" />
                    <CardTitle>Clients by Goal Type</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={clientsByGoal}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {clientsByGoal.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))' 
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
