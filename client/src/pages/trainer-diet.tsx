import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TrainerSidebar } from "@/components/trainer-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, UtensilsCrossed, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { CreateDietPlanModal } from "@/components/create-diet-plan-modal";
import { MealBuilderModal } from "@/components/meal-builder-modal";
import type { DietPlan } from "@shared/schema";

export default function TrainerDiet() {
  const style = { "--sidebar-width": "16rem" };
  const { toast } = useToast();
  const [isCreatePlanOpen, setIsCreatePlanOpen] = useState(false);
  const [isCreateMealOpen, setIsCreateMealOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [editingMeal, setEditingMeal] = useState<any>(null);

  const { data: authData } = useQuery<any>({
    queryKey: ['/api/auth/me']
  });

  const user = authData?.user;
  const trainerId = user?._id?.toString() || user?.id;

  // Fetch trainer's assigned clients
  const { data: clients = [] } = useQuery<any[]>({
    queryKey: ['/api/trainers', trainerId, 'clients'],
    enabled: !!trainerId
  });

  // Fetch trainer's diet plans (only for assigned clients)
  const { data: dietPlans = [], isLoading: isLoadingPlans, refetch: refetchPlans } = useQuery<DietPlan[]>({
    queryKey: ['/api/trainers', trainerId, 'diet-plans'],
    enabled: !!trainerId
  });

  // Fetch all meals created by this trainer
  const { data: meals = [], isLoading: isLoadingMeals, refetch: refetchMeals } = useQuery<any[]>({
    queryKey: ['/api/trainers', trainerId, 'meals'],
    enabled: !!trainerId
  });

  const createPlanMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('POST', '/api/diet-plans', {
        ...data,
        trainerId,
        isTemplate: false
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trainers', trainerId, 'diet-plans'] });
      toast({ title: "Success", description: "Diet plan created successfully" });
      setIsCreatePlanOpen(false);
      setEditingPlan(null);
      refetchPlans();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to create diet plan", variant: "destructive" });
    }
  });

  const updatePlanMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('PATCH', `/api/diet-plans/${data._id}`, {
        ...data,
        trainerId
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trainers', trainerId, 'diet-plans'] });
      toast({ title: "Success", description: "Diet plan updated successfully" });
      setIsCreatePlanOpen(false);
      setEditingPlan(null);
      refetchPlans();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to update diet plan", variant: "destructive" });
    }
  });

  const deletePlanMutation = useMutation({
    mutationFn: async (planId: string) => {
      return await apiRequest('DELETE', `/api/diet-plans/${planId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trainers', trainerId, 'diet-plans'] });
      toast({ title: "Success", description: "Diet plan deleted successfully" });
      refetchPlans();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to delete diet plan", variant: "destructive" });
    }
  });

  const createMealMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('POST', '/api/meals', {
        ...data,
        createdBy: trainerId
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trainers', trainerId, 'meals'] });
      toast({ title: "Success", description: "Meal created successfully" });
      setIsCreateMealOpen(false);
      setEditingMeal(null);
      refetchMeals();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to create meal", variant: "destructive" });
    }
  });

  const updateMealMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('PATCH', `/api/meals/${data._id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trainers', trainerId, 'meals'] });
      toast({ title: "Success", description: "Meal updated successfully" });
      setIsCreateMealOpen(false);
      setEditingMeal(null);
      refetchMeals();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to update meal", variant: "destructive" });
    }
  });

  const deleteMealMutation = useMutation({
    mutationFn: async (mealId: string) => {
      return await apiRequest('DELETE', `/api/meals/${mealId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trainers', trainerId, 'meals'] });
      toast({ title: "Success", description: "Meal deleted successfully" });
      refetchMeals();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to delete meal", variant: "destructive" });
    }
  });

  const assignPlanMutation = useMutation({
    mutationFn: async ({ planId, clientId }: { planId: string; clientId: string }) => {
      return await apiRequest('POST', `/api/diet-plans/${planId}/assign`, { clientId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trainers', trainerId, 'diet-plans'] });
      toast({ title: "Success", description: "Diet plan assigned successfully" });
      refetchPlans();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to assign diet plan", variant: "destructive" });
    }
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
                Diet Management
              </h1>
            </div>
            <ThemeToggle />
          </header>

          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto">
              <Tabs defaultValue="plans" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="plans" data-testid="tab-diet-plans">
                    <UtensilsCrossed className="h-4 w-4 mr-2" />
                    Diet Plans
                  </TabsTrigger>
                  <TabsTrigger value="meals" data-testid="tab-meal-database">
                    <Search className="h-4 w-4 mr-2" />
                    Meal Database
                  </TabsTrigger>
                </TabsList>

                {/* Diet Plans Tab */}
                <TabsContent value="plans" className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h2 className="text-xl font-bold">Diet Plans for Your Clients</h2>
                      <p className="text-sm text-muted-foreground">Create and manage diet plans for {clients.length} assigned clients</p>
                    </div>
                    <Button
                      onClick={() => {
                        setEditingPlan(null);
                        setIsCreatePlanOpen(true);
                      }}
                      data-testid="button-create-plan"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Plan
                    </Button>
                  </div>

                  {isLoadingPlans ? (
                    <p className="text-center text-muted-foreground py-8">Loading diet plans...</p>
                  ) : dietPlans.length === 0 ? (
                    <Card>
                      <CardContent className="pt-6 text-center py-12 text-muted-foreground">
                        No diet plans created yet. Create one to get started!
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
                              {plan.clientId && (
                                <Badge variant="outline">Assigned</Badge>
                              )}
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

                            {!plan.clientId && clients.length > 0 && (
                              <div className="mt-4">
                                <label className="text-sm font-medium block mb-2">Assign to Client</label>
                                <select
                                  onChange={(e) => {
                                    if (e.target.value) {
                                      assignPlanMutation.mutate({ planId: plan._id, clientId: e.target.value });
                                    }
                                  }}
                                  className="w-full px-2 py-1 text-sm border rounded bg-background"
                                  data-testid={`select-assign-${plan._id}`}
                                >
                                  <option value="">Select a client...</option>
                                  {clients.map((client: any) => (
                                    <option key={client._id} value={client._id}>
                                      {client.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}

                            <div className="flex gap-2 pt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                                onClick={() => {
                                  setEditingPlan(plan);
                                  setIsCreatePlanOpen(true);
                                }}
                                data-testid={`button-edit-plan-${plan._id}`}
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="flex-1"
                                onClick={() => {
                                  if (confirm('Are you sure?')) {
                                    deletePlanMutation.mutate(plan._id);
                                  }
                                }}
                                data-testid={`button-delete-plan-${plan._id}`}
                              >
                                Delete
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Meals Tab */}
                <TabsContent value="meals" className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h2 className="text-xl font-bold">Meal Database</h2>
                      <p className="text-sm text-muted-foreground">Create and manage meals to add to diet plans</p>
                    </div>
                    <Button
                      onClick={() => {
                        setEditingMeal(null);
                        setIsCreateMealOpen(true);
                      }}
                      data-testid="button-create-meal"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Meal
                    </Button>
                  </div>

                  {isLoadingMeals ? (
                    <p className="text-center text-muted-foreground py-8">Loading meals...</p>
                  ) : meals.length === 0 ? (
                    <Card>
                      <CardContent className="pt-6 text-center py-12 text-muted-foreground">
                        No meals created yet. Create one to build your meal database!
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {meals.map((meal: any) => (
                        <Card key={meal._id} className="hover-elevate" data-testid={`card-meal-${meal._id}`}>
                          <CardHeader>
                            <CardTitle className="line-clamp-1">{meal.name}</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <p className="text-muted-foreground">Calories</p>
                                <p className="font-semibold">{meal.calories || 0}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Category</p>
                                <p className="font-semibold">{meal.category || 'General'}</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div>
                                <p className="text-muted-foreground">Protein</p>
                                <p className="font-semibold">{meal.protein || 0}g</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Carbs</p>
                                <p className="font-semibold">{meal.carbs || 0}g</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Fats</p>
                                <p className="font-semibold">{meal.fats || 0}g</p>
                              </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                                onClick={() => {
                                  setEditingMeal(meal);
                                  setIsCreateMealOpen(true);
                                }}
                                data-testid={`button-edit-meal-${meal._id}`}
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="flex-1"
                                onClick={() => {
                                  if (confirm('Are you sure?')) {
                                    deleteMealMutation.mutate(meal._id);
                                  }
                                }}
                                data-testid={`button-delete-meal-${meal._id}`}
                              >
                                Delete
                              </Button>
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

      {/* Create/Edit Diet Plan Modal */}
      <CreateDietPlanModal
        open={isCreatePlanOpen}
        onOpenChange={setIsCreatePlanOpen}
        onSubmit={(data) => {
          if (editingPlan) {
            updatePlanMutation.mutate({ ...data, _id: editingPlan._id });
          } else {
            createPlanMutation.mutate(data);
          }
        }}
        initialData={editingPlan}
        clients={clients}
        isLoading={createPlanMutation.isPending || updatePlanMutation.isPending}
      />

      {/* Create/Edit Meal Modal */}
      <MealBuilderModal
        open={isCreateMealOpen}
        onOpenChange={setIsCreateMealOpen}
        onSubmit={(data) => {
          if (editingMeal) {
            updateMealMutation.mutate({ ...data, _id: editingMeal._id });
          } else {
            createMealMutation.mutate(data);
          }
        }}
        initialData={editingMeal}
        isLoading={createMealMutation.isPending || updateMealMutation.isPending}
      />
    </SidebarProvider>
  );
}
