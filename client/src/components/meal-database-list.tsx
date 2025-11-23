import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Search, Edit, Trash2, Copy, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AssignPlanDialog } from "@/components/assign-plan-dialog";

const MEAL_TYPES = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snack', label: 'Snack' },
];

// Force rebuild - filters should display
interface MealFormData {
  name: string;
  mealType: string;
  calories: string;
  protein: string;
  carbs: string;
  fats: string;
}

export function MealDatabaseList() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [mealTypeFilter, setMealTypeFilter] = useState<string>("all");
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<any>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<any>(null);
  const [formData, setFormData] = useState<MealFormData>({
    name: "",
    mealType: "breakfast",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
  });

  const { data: meals = [], isLoading } = useQuery<any[]>({
    queryKey: ['/api/meals', mealTypeFilter, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (mealTypeFilter && mealTypeFilter !== 'all') params.append('mealType', mealTypeFilter);
      if (searchQuery) params.append('search', searchQuery);
      const queryString = params.toString();
      const res = await fetch(`/api/meals${queryString ? `?${queryString}` : ''}`);
      if (!res.ok) throw new Error('Failed to fetch meals');
      return res.json();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      apiRequest("PATCH", `/api/meals/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/meals'] });
      toast({ title: "Success", description: "Meal updated successfully" });
      setEditDialogOpen(false);
      setEditingMeal(null);
      resetForm();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const cloneMutation = useMutation({
    mutationFn: (id: string) => apiRequest("POST", `/api/meals/${id}/clone`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/meals'] });
      toast({ title: "Success", description: "Meal cloned successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/meals/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/meals'] });
      toast({ title: "Success", description: "Meal deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      mealType: "breakfast",
      calories: "",
      protein: "",
      carbs: "",
      fats: "",
    });
  };

  const handleEdit = (meal: any) => {
    setEditingMeal(meal);
    setFormData({
      name: meal.name,
      mealType: meal.mealType,
      calories: String(meal.calories ?? ""),
      protein: String(meal.protein ?? ""),
      carbs: String(meal.carbs ?? ""),
      fats: String(meal.fats ?? ""),
    });
    setEditDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast({ title: "Error", description: "Please enter a meal name", variant: "destructive" });
      return;
    }

    const calories = parseFloat(formData.calories);
    if (isNaN(calories) || calories <= 0) {
      toast({ title: "Error", description: "Please enter valid calories (greater than 0)", variant: "destructive" });
      return;
    }

    const protein = parseFloat(formData.protein);
    if (isNaN(protein) || protein < 0) {
      toast({ title: "Error", description: "Please enter valid protein value", variant: "destructive" });
      return;
    }

    const carbs = parseFloat(formData.carbs);
    if (isNaN(carbs) || carbs < 0) {
      toast({ title: "Error", description: "Please enter valid carbs value", variant: "destructive" });
      return;
    }

    const fats = parseFloat(formData.fats);
    if (isNaN(fats) || fats < 0) {
      toast({ title: "Error", description: "Please enter valid fats value", variant: "destructive" });
      return;
    }

    if (editingMeal) {
      updateMutation.mutate({ 
        id: editingMeal._id, 
        data: {
          ...formData,
          calories,
          protein,
          carbs,
          fats,
        }
      });
    }
  };

  const filteredMeals = meals.filter((meal) => {
    const matchesSearch = meal.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMealType = mealTypeFilter === "all" || meal.mealType === mealTypeFilter;
    return matchesSearch && matchesMealType;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search meals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-meals"
            />
          </div>
          <Select value={mealTypeFilter} onValueChange={setMealTypeFilter}>
            <SelectTrigger className="w-[180px]" data-testid="select-meal-type-filter">
              <SelectValue placeholder="Meal Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {MEAL_TYPES.map(type => (
                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button data-testid="button-create-meal">
          <Plus className="h-4 w-4 mr-2" />
          Create Meal
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Loading meals...</div>
      ) : filteredMeals.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No meals found</p>
          <p className="text-sm text-muted-foreground mt-2">Create Your First Meal</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMeals.map((meal) => (
            <Card key={meal._id} data-testid={`card-meal-${meal._id}`}>
              <CardHeader>
                <CardTitle className="flex items-start justify-between gap-2">
                  <span className="line-clamp-2">{meal.name}</span>
                  <Badge variant="outline">{meal.mealType}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Calories:</span>
                    <span className="font-semibold">{meal.calories}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Protein:</span>
                    <span className="font-semibold">{meal.protein}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Carbs:</span>
                    <span className="font-semibold">{meal.carbs}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fats:</span>
                    <span className="font-semibold">{meal.fats}g</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => {
                      setSelectedMeal(meal);
                      setAssignDialogOpen(true);
                    }}
                    data-testid={`button-assign-${meal._id}`}
                  >
                    <UserPlus className="h-3 w-3 mr-1" />
                    Assign
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => cloneMutation.mutate(meal._id)}
                    data-testid={`button-clone-${meal._id}`}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Clone
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEdit(meal)}
                    data-testid={`button-edit-${meal._id}`}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => deleteMutation.mutate(meal._id)}
                    data-testid={`button-delete-${meal._id}`}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AssignPlanDialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        plan={selectedMeal}
        resourceType="meal"
      />

      <Dialog open={editDialogOpen} onOpenChange={(open) => {
        setEditDialogOpen(open);
        if (!open) {
          setEditingMeal(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Meal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="meal-name">Meal Name *</Label>
              <Input
                id="meal-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Grilled Chicken Breast"
                data-testid="input-meal-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meal-type">Meal Type *</Label>
              <Select value={formData.mealType} onValueChange={(value) => setFormData({ ...formData, mealType: value })}>
                <SelectTrigger id="meal-type" data-testid="select-meal-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MEAL_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="calories">Calories *</Label>
                <Input
                  id="calories"
                  type="number"
                  value={formData.calories}
                  onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                  placeholder="0"
                  data-testid="input-calories"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="protein">Protein (g) *</Label>
                <Input
                  id="protein"
                  type="number"
                  value={formData.protein}
                  onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
                  placeholder="0"
                  data-testid="input-protein"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="carbs">Carbs (g) *</Label>
                <Input
                  id="carbs"
                  type="number"
                  value={formData.carbs}
                  onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
                  placeholder="0"
                  data-testid="input-carbs"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fats">Fats (g) *</Label>
                <Input
                  id="fats"
                  type="number"
                  value={formData.fats}
                  onChange={(e) => setFormData({ ...formData, fats: e.target.value })}
                  placeholder="0"
                  data-testid="input-fats"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setEditDialogOpen(false);
                  setEditingMeal(null);
                  resetForm();
                }}
                data-testid="button-cancel-edit"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={updateMutation.isPending}
                data-testid="button-save-meal"
              >
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
