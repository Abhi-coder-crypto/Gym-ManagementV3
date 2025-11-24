import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TrainerSidebar } from "@/components/trainer-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UtensilsCrossed, Dumbbell, UserPlus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import type { DietPlan } from "@shared/schema";

export default function TrainerDiet() {
  const style = { "--sidebar-width": "16rem" };

  const { data: authData } = useQuery<any>({
    queryKey: ['/api/auth/me']
  });

  const user = authData?.user;
  const trainerId = user?._id?.toString() || user?.id;

  // Fetch trainer's diet plans + admin templates
  const { data: dietPlans = [], isLoading: isLoadingPlans } = useQuery<DietPlan[]>({
    queryKey: ['/api/trainers', trainerId, 'diet-plans'],
    enabled: !!trainerId
  });

  // Fetch trainer's workout plans + admin templates
  const { data: workoutPlans = [], isLoading: isLoadingWorkouts } = useQuery<any[]>({
    queryKey: ['/api/trainers', trainerId, 'workout-plans'],
    enabled: !!trainerId
  });

  // Fetch trainer's client assignments
  const { data: clientAssignments = [], isLoading: isLoadingAssignments } = useQuery<any[]>({
    queryKey: ['/api/trainers', trainerId, 'clients'],
    enabled: !!trainerId
  });

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <TrainerSidebar />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-4">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <h1 className="text-2xl font-display font-bold tracking-tight flex items-center gap-2">
                <UtensilsCrossed className="h-6 w-6 text-primary" />
                Diet & Workout Management
              </h1>
            </div>
            <ThemeToggle />
          </header>

          <main className="flex-1 overflow-auto p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10">
            <div className="max-w-7xl mx-auto">
              <Tabs defaultValue="diet" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="diet" data-testid="tab-diet-templates">
                    <UtensilsCrossed className="h-4 w-4 mr-2" />
                    Diet Plans
                  </TabsTrigger>
                  <TabsTrigger value="workout" data-testid="tab-workout-plans">
                    <Dumbbell className="h-4 w-4 mr-2" />
                    Workout Plans
                  </TabsTrigger>
                  <TabsTrigger value="assignments" data-testid="tab-assignments">
                    <UserPlus className="h-4 w-4 mr-2" />
                    My Assignments
                  </TabsTrigger>
                </TabsList>

                {/* Diet Plans Tab */}
                <TabsContent value="diet" className="space-y-4">
                  <div className="mb-4">
                    <h2 className="text-xl font-bold">Diet Plans & Templates</h2>
                    <p className="text-sm text-muted-foreground mt-1">View available diet plans including your templates and admin templates</p>
                  </div>

                  {isLoadingPlans ? (
                    <Card>
                      <CardContent className="py-8 text-center text-muted-foreground">
                        Loading diet plans...
                      </CardContent>
                    </Card>
                  ) : dietPlans.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center text-muted-foreground">
                        No diet plans available.
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {dietPlans.map((plan: any) => (
                        <Card key={plan._id} className="hover-elevate" data-testid={`card-diet-plan-${plan._id}`}>
                          <CardHeader>
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <CardTitle className="line-clamp-1">{plan.name}</CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                              </div>
                              <div className="flex gap-2">
                                {plan.isTemplate && (
                                  <Badge variant="secondary">Admin Template</Badge>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <p className="text-muted-foreground">Target Calories</p>
                                <p className="font-semibold">{plan.targetCalories} cal/day</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Meals</p>
                                <p className="font-semibold">{plan.meals?.length || 0}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Workout Plans Tab */}
                <TabsContent value="workout" className="space-y-4">
                  <div className="mb-4">
                    <h2 className="text-xl font-bold">Workout Plans & Templates</h2>
                    <p className="text-sm text-muted-foreground mt-1">View available workout plans including your templates and admin templates</p>
                  </div>

                  {isLoadingWorkouts ? (
                    <Card>
                      <CardContent className="py-8 text-center text-muted-foreground">
                        Loading workout plans...
                      </CardContent>
                    </Card>
                  ) : workoutPlans.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center text-muted-foreground">
                        No workout plans available.
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {workoutPlans.map((plan: any) => (
                        <Card key={plan._id} className="hover-elevate" data-testid={`card-workout-plan-${plan._id}`}>
                          <CardHeader>
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <CardTitle className="line-clamp-1">{plan.name}</CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">{plan.description || plan.goal}</p>
                              </div>
                              <div className="flex gap-2">
                                {plan.isTemplate && (
                                  <Badge variant="secondary">Admin Template</Badge>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <p className="text-muted-foreground">Duration</p>
                                <p className="font-semibold">{plan.durationWeeks || plan.duration || 4} weeks</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Goal</p>
                                <p className="font-semibold">{plan.goal || 'N/A'}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* My Assignments Tab */}
                <TabsContent value="assignments" className="space-y-4">
                  <div className="mb-4">
                    <h2 className="text-xl font-bold">Diet & Workout Assignments</h2>
                    <p className="text-sm text-muted-foreground mt-1">View diet and workout plans assigned to your {clientAssignments.length} clients</p>
                  </div>

                  {isLoadingAssignments ? (
                    <Card>
                      <CardContent className="py-8 text-center text-muted-foreground">
                        Loading assignments...
                      </CardContent>
                    </Card>
                  ) : clientAssignments.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center text-muted-foreground">
                        You have no assigned clients yet.
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {clientAssignments.map((client: any) => (
                        <Card key={client._id} className="hover-elevate" data-testid={`card-assignment-${client._id}`}>
                          <CardHeader>
                            <CardTitle className="text-lg">{client.name}</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium mb-2">Diet Assignments</p>
                                <p className="text-sm text-muted-foreground">{client.dietPlans?.length || 0} diet plans assigned</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium mb-2">Workout Assignments</p>
                                <p className="text-sm text-muted-foreground">{client.workoutPlans?.length || 0} workout plans assigned</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
