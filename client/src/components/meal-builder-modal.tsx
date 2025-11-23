import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, X } from "lucide-react";

interface MealBuilderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meal?: any;
}

export function MealBuilderModal({ open, onOpenChange, meal }: MealBuilderModalProps) {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Balanced");
  const [mealType, setMealType] = useState("Breakfast");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fats, setFats] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [instructions, setInstructions] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");

  useEffect(() => {
    if (meal) {
      setName(meal.name || "");
      setCategory(meal.category || "Balanced");
      setMealType(meal.mealType || "Breakfast");
      setCalories(String(meal.calories || ""));
      setProtein(String(meal.protein || ""));
      setCarbs(String(meal.carbs || ""));
      setFats(String(meal.fats || ""));
      setIngredients(meal.ingredients || [""]);
      setInstructions(meal.instructions || "");
      setPrepTime(String(meal.prepTime || ""));
      setCookTime(String(meal.cookTime || ""));
    } else {
      resetForm();
    }
  }, [meal, open]);

  const resetForm = () => {
    setName("");
    setCategory("Balanced");
    setMealType("Breakfast");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFats("");
    setIngredients([""]);
    setInstructions("");
    setPrepTime("");
    setCookTime("");
  };

  const addIngredient = () => {
    setIngredients([...ingredients, ""]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const createOrUpdateMutation = useMutation({
    mutationFn: async (data: any) => {
      if (meal) {
        return apiRequest('PATCH', `/api/meals/${meal._id}`, data);
      }
      return apiRequest('POST', '/api/meals', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/meals'] });
      toast({
        title: "Success",
        description: meal ? "Meal updated successfully" : "Meal created successfully",
      });
      onOpenChange(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save meal",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !calories || !protein || !carbs || !fats) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required nutrition fields",
        variant: "destructive",
      });
      return;
    }

    const data = {
      name,
      category,
      mealType,
      calories: parseFloat(calories),
      protein: parseFloat(protein),
      carbs: parseFloat(carbs),
      fats: parseFloat(fats),
      ingredients: ingredients.filter(i => i.trim()),
      instructions,
      prepTime: prepTime ? parseInt(prepTime) : undefined,
      cookTime: cookTime ? parseInt(cookTime) : undefined,
      servings: 1,
    };

    createOrUpdateMutation.mutate(data);
  };

  const categories = ["Balanced", "High Protein", "Low Carb", "Ketogenic", "Vegan", "Paleo", "Mediterranean"];
  const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack", "Post-Workout", "Pre-Workout"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {meal ? "Edit Meal" : "Create New Meal"}
          </DialogTitle>
          <DialogDescription>
            {meal ? "Update meal details and nutrition information" : "Add a new meal to your database"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Meal Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Grilled Chicken Salad"
                data-testid="input-meal-name"
                required
              />
            </div>

            <div>
              <Label htmlFor="mealType">Meal Type *</Label>
              <Select value={mealType} onValueChange={setMealType}>
                <SelectTrigger id="mealType" data-testid="select-meal-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mealTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category" data-testid="select-meal-category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-md p-4 space-y-4">
            <h3 className="font-semibold">Nutrition Information *</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="calories">Calories</Label>
                <Input
                  id="calories"
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  placeholder="450"
                  data-testid="input-meal-calories"
                  required
                />
              </div>
              <div>
                <Label htmlFor="protein">Protein (g)</Label>
                <Input
                  id="protein"
                  type="number"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                  placeholder="30"
                  data-testid="input-meal-protein"
                  required
                />
              </div>
              <div>
                <Label htmlFor="carbs">Carbs (g)</Label>
                <Input
                  id="carbs"
                  type="number"
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value)}
                  placeholder="40"
                  data-testid="input-meal-carbs"
                  required
                />
              </div>
              <div>
                <Label htmlFor="fats">Fats (g)</Label>
                <Input
                  id="fats"
                  type="number"
                  value={fats}
                  onChange={(e) => setFats(e.target.value)}
                  placeholder="15"
                  data-testid="input-meal-fats"
                  required
                />
              </div>
            </div>
          </div>

          <div className="border rounded-md p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Ingredients</h3>
              <Button type="button" variant="outline" size="sm" onClick={addIngredient} data-testid="button-add-ingredient">
                <Plus className="h-4 w-4 mr-1" />
                Add Ingredient
              </Button>
            </div>
            <div className="space-y-2">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={ingredient}
                    onChange={(e) => updateIngredient(index, e.target.value)}
                    placeholder="e.g., 200g chicken breast"
                    data-testid={`input-ingredient-${index}`}
                  />
                  {ingredients.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeIngredient(index)}
                      data-testid={`button-remove-ingredient-${index}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="instructions">Cooking Instructions</Label>
            <Textarea
              id="instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Step-by-step instructions..."
              rows={4}
              data-testid="input-instructions"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="prepTime">Prep Time (minutes)</Label>
              <Input
                id="prepTime"
                type="number"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                placeholder="15"
                data-testid="input-prep-time"
              />
            </div>
            <div>
              <Label htmlFor="cookTime">Cook Time (minutes)</Label>
              <Input
                id="cookTime"
                type="number"
                value={cookTime}
                onChange={(e) => setCookTime(e.target.value)}
                placeholder="20"
                data-testid="input-cook-time"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                resetForm();
              }}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createOrUpdateMutation.isPending}
              data-testid="button-save-meal"
            >
              {createOrUpdateMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {meal ? "Update Meal" : "Create Meal"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
