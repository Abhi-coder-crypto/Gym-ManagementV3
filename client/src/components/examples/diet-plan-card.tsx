import { DietPlanCard } from "../diet-plan-card";

export default function DietPlanCardExample() {
  const meals = [
    {
      time: "7:00 AM",
      name: "Protein Oatmeal Bowl",
      calories: 420,
      protein: 25,
      carbs: 55,
      fats: 12,
    },
    {
      time: "12:00 PM",
      name: "Grilled Chicken Salad",
      calories: 550,
      protein: 45,
      carbs: 35,
      fats: 18,
    },
    {
      time: "3:00 PM",
      name: "Greek Yogurt & Berries",
      calories: 220,
      protein: 18,
      carbs: 28,
      fats: 5,
    },
    {
      time: "7:00 PM",
      name: "Salmon with Quinoa",
      calories: 680,
      protein: 42,
      carbs: 52,
      fats: 28,
    },
  ];

  return (
    <div className="p-8 max-w-2xl">
      <DietPlanCard day="Monday" meals={meals} totalCalories={1870} />
    </div>
  );
}
