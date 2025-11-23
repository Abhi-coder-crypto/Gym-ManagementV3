import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Meal } from '../models';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || '';

const meals = [
  // ==================== BREAKFAST MEALS ====================
  {
    name: "Low-Carb Veggie Scramble",
    category: "Low Carb",
    mealType: "Breakfast",
    calories: 350,
    protein: 25,
    carbs: 8,
    fats: 25,
    ingredients: [
      "3 large eggs",
      "1/2 cup spinach, chopped",
      "1/4 cup bell peppers, diced",
      "1/4 cup mushrooms, sliced",
      "2 tbsp cheddar cheese, shredded",
      "1 tbsp butter",
      "Salt and pepper to taste"
    ],
    instructions: "1. Heat butter in a pan over medium heat\n2. Sauté vegetables until tender (3-4 minutes)\n3. Whisk eggs in a bowl, season with salt and pepper\n4. Pour eggs into pan with vegetables\n5. Scramble until cooked through (2-3 minutes)\n6. Top with cheese and serve immediately",
    prepTime: 5,
    cookTime: 8,
    servings: 1,
    tags: ["Quick", "Protein-Rich", "Vegetarian"],
    isPublic: true
  },
  {
    name: "Protein Power Pancakes",
    category: "High Protein",
    mealType: "Breakfast",
    calories: 420,
    protein: 40,
    carbs: 45,
    fats: 8,
    ingredients: [
      "1 scoop vanilla protein powder",
      "2 eggs",
      "1/2 cup oats",
      "1/4 cup egg whites",
      "1/2 tsp baking powder",
      "1/4 cup blueberries",
      "Sugar-free syrup for topping"
    ],
    instructions: "1. Blend oats into flour consistency\n2. Mix all ingredients except blueberries in a bowl\n3. Fold in blueberries\n4. Heat non-stick pan over medium heat\n5. Pour 1/4 cup batter per pancake\n6. Cook until bubbles form (2-3 minutes), flip and cook 2 more minutes\n7. Serve with sugar-free syrup",
    prepTime: 5,
    cookTime: 10,
    servings: 1,
    tags: ["Muscle Building", "Post-Workout", "Sweet"],
    isPublic: true
  },
  {
    name: "Keto Bulletproof Coffee Bowl",
    category: "Ketogenic",
    mealType: "Breakfast",
    calories: 480,
    protein: 15,
    carbs: 6,
    fats: 45,
    ingredients: [
      "2 cups brewed coffee, cooled",
      "2 tbsp grass-fed butter",
      "1 tbsp MCT oil",
      "2 tbsp heavy cream",
      "1/4 cup walnuts, chopped",
      "2 tbsp unsweetened coconut flakes",
      "Stevia to taste"
    ],
    instructions: "1. Blend hot coffee with butter and MCT oil until frothy (30 seconds)\n2. Pour into a bowl\n3. Top with heavy cream, walnuts, and coconut flakes\n4. Add stevia if desired\n5. Enjoy with a spoon",
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    tags: ["Keto", "Energy Boost", "No-Cook"],
    isPublic: true
  },
  {
    name: "Vegan Protein Smoothie Bowl",
    category: "Vegan",
    mealType: "Breakfast",
    calories: 380,
    protein: 20,
    carbs: 55,
    fats: 10,
    ingredients: [
      "1 scoop vegan protein powder",
      "1 frozen banana",
      "1 cup almond milk",
      "1 tbsp peanut butter",
      "1/2 cup mixed berries",
      "2 tbsp granola",
      "1 tbsp chia seeds",
      "Sliced almonds for topping"
    ],
    instructions: "1. Blend protein powder, banana, almond milk, and peanut butter until smooth\n2. Pour into a bowl\n3. Top with berries, granola, chia seeds, and almonds\n4. Serve immediately",
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    tags: ["Plant-Based", "Nutrient-Dense", "Quick"],
    isPublic: true
  },
  {
    name: "Balanced Oatmeal Bowl",
    category: "Balanced",
    mealType: "Breakfast",
    calories: 400,
    protein: 18,
    carbs: 52,
    fats: 14,
    ingredients: [
      "1/2 cup rolled oats",
      "1 cup milk (dairy or plant-based)",
      "1 scoop vanilla protein powder",
      "1 tbsp almond butter",
      "1/2 banana, sliced",
      "1 tbsp honey",
      "Cinnamon to taste"
    ],
    instructions: "1. Cook oats with milk in microwave for 2-3 minutes or on stovetop until creamy\n2. Stir in protein powder\n3. Top with almond butter, banana slices, and honey\n4. Sprinkle with cinnamon\n5. Serve warm",
    prepTime: 2,
    cookTime: 5,
    servings: 1,
    tags: ["Heart-Healthy", "Filling", "Customizable"],
    isPublic: true
  },
  {
    name: "Paleo Sweet Potato Hash",
    category: "Paleo",
    mealType: "Breakfast",
    calories: 420,
    protein: 22,
    carbs: 38,
    fats: 20,
    ingredients: [
      "1 medium sweet potato, diced",
      "3 eggs",
      "3 strips bacon, chopped",
      "1/4 onion, diced",
      "1/2 bell pepper, diced",
      "1 tbsp coconut oil",
      "Fresh parsley",
      "Salt, pepper, paprika"
    ],
    instructions: "1. Cook bacon in a large skillet until crispy, remove and set aside\n2. Add coconut oil and sweet potato to the pan\n3. Cook sweet potato for 8-10 minutes until tender\n4. Add onion and bell pepper, cook 3-4 minutes\n5. Make wells in the hash, crack eggs into them\n6. Cover and cook until eggs are done to your liking\n7. Top with bacon and parsley",
    prepTime: 10,
    cookTime: 15,
    servings: 1,
    tags: ["Paleo", "Hearty", "One-Pan"],
    isPublic: true
  },
  {
    name: "Mediterranean Shakshuka",
    category: "Mediterranean",
    mealType: "Breakfast",
    calories: 360,
    protein: 18,
    carbs: 28,
    fats: 20,
    ingredients: [
      "2 eggs",
      "1 cup tomato sauce",
      "1/4 cup chickpeas",
      "2 tbsp feta cheese",
      "1 clove garlic, minced",
      "1 tsp olive oil",
      "Fresh basil",
      "Paprika, cumin",
      "Whole wheat pita for serving"
    ],
    instructions: "1. Heat olive oil in a skillet, sauté garlic for 30 seconds\n2. Add tomato sauce, chickpeas, and spices\n3. Simmer for 5 minutes\n4. Make two wells in sauce, crack eggs into them\n5. Cover and cook until eggs are set (5-7 minutes)\n6. Top with feta and fresh basil\n7. Serve with warm pita",
    prepTime: 5,
    cookTime: 15,
    servings: 1,
    tags: ["Mediterranean", "Flavorful", "Traditional"],
    isPublic: true
  },

  // ==================== LUNCH MEALS ====================
  {
    name: "Grilled Chicken Caesar Salad (Low Carb)",
    category: "Low Carb",
    mealType: "Lunch",
    calories: 420,
    protein: 48,
    carbs: 12,
    fats: 20,
    ingredients: [
      "6 oz grilled chicken breast",
      "3 cups romaine lettuce",
      "2 tbsp parmesan cheese",
      "3 tbsp Caesar dressing (low-carb)",
      "1/4 cup cherry tomatoes",
      "Lemon wedge",
      "Black pepper"
    ],
    instructions: "1. Season and grill chicken breast until internal temp reaches 165°F (6-8 minutes per side)\n2. Let chicken rest 5 minutes, then slice\n3. Chop romaine lettuce and place in a large bowl\n4. Add cherry tomatoes\n5. Top with sliced chicken and parmesan\n6. Drizzle with Caesar dressing\n7. Squeeze lemon juice and add black pepper to taste",
    prepTime: 10,
    cookTime: 15,
    servings: 1,
    tags: ["Low-Carb", "High-Protein", "Classic"],
    isPublic: true
  },
  {
    name: "Bodybuilder's Chicken & Rice",
    category: "High Protein",
    mealType: "Lunch",
    calories: 550,
    protein: 60,
    carbs: 55,
    fats: 8,
    ingredients: [
      "8 oz chicken breast",
      "1 cup cooked brown rice",
      "1 cup broccoli florets",
      "2 tbsp teriyaki sauce (low-sodium)",
      "1 tsp olive oil",
      "Garlic powder, onion powder",
      "Sesame seeds for garnish"
    ],
    instructions: "1. Season chicken with garlic and onion powder\n2. Grill or bake chicken at 400°F for 20-25 minutes\n3. Steam broccoli for 5-7 minutes\n4. Heat rice in microwave\n5. Slice chicken and arrange on plate with rice and broccoli\n6. Drizzle with teriyaki sauce\n7. Garnish with sesame seeds",
    prepTime: 5,
    cookTime: 25,
    servings: 1,
    tags: ["Muscle Building", "Meal Prep Friendly", "Clean Eating"],
    isPublic: true
  },
  {
    name: "Keto Avocado Tuna Salad",
    category: "Ketogenic",
    mealType: "Lunch",
    calories: 480,
    protein: 35,
    carbs: 10,
    fats: 36,
    ingredients: [
      "1 can (5 oz) tuna in water, drained",
      "1 whole avocado",
      "2 tbsp mayonnaise",
      "1 celery stalk, diced",
      "2 tbsp red onion, minced",
      "1 tbsp lemon juice",
      "Mixed greens for serving",
      "Salt, pepper, paprika"
    ],
    instructions: "1. Mash avocado in a bowl\n2. Add drained tuna, mayonnaise, celery, and onion\n3. Mix well and season with lemon juice, salt, pepper, and paprika\n4. Serve over mixed greens\n5. Optionally wrap in large lettuce leaves",
    prepTime: 10,
    cookTime: 0,
    servings: 1,
    tags: ["Keto", "No-Cook", "Quick Lunch"],
    isPublic: true
  },
  {
    name: "Vegan Buddha Bowl",
    category: "Vegan",
    mealType: "Lunch",
    calories: 520,
    protein: 22,
    carbs: 68,
    fats: 18,
    ingredients: [
      "1 cup cooked quinoa",
      "1/2 cup chickpeas, roasted",
      "1 cup mixed vegetables (carrots, cucumber, bell pepper)",
      "1/2 cup hummus",
      "2 cups baby spinach",
      "1/4 avocado, sliced",
      "2 tbsp tahini dressing",
      "Sesame seeds, lemon wedge"
    ],
    instructions: "1. Toss chickpeas with olive oil and spices, roast at 400°F for 20 minutes\n2. Cook quinoa according to package directions\n3. Arrange spinach in a bowl as base\n4. Add quinoa, roasted chickpeas, vegetables, and avocado\n5. Add a scoop of hummus\n6. Drizzle with tahini dressing\n7. Garnish with sesame seeds and lemon",
    prepTime: 15,
    cookTime: 25,
    servings: 1,
    tags: ["Plant-Based", "Nutrient-Dense", "Colorful"],
    isPublic: true
  },
  {
    name: "Balanced Turkey Wrap",
    category: "Balanced",
    mealType: "Lunch",
    calories: 450,
    protein: 35,
    carbs: 42,
    fats: 16,
    ingredients: [
      "1 whole wheat tortilla (10-inch)",
      "4 oz sliced turkey breast",
      "2 slices Swiss cheese",
      "2 tbsp hummus",
      "1/4 avocado, mashed",
      "Lettuce, tomato, cucumber",
      "Mustard to taste"
    ],
    instructions: "1. Lay tortilla flat and spread hummus evenly\n2. Layer turkey and cheese in center\n3. Add mashed avocado, lettuce, tomato, and cucumber\n4. Add a thin layer of mustard if desired\n5. Fold in sides and roll tightly\n6. Cut in half diagonally\n7. Serve with baby carrots or fruit",
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    tags: ["Quick", "Portable", "Balanced"],
    isPublic: true
  },
  {
    name: "Paleo Beef & Veggie Stir-Fry",
    category: "Paleo",
    mealType: "Lunch",
    calories: 500,
    protein: 42,
    carbs: 28,
    fats: 26,
    ingredients: [
      "6 oz grass-fed beef strips",
      "2 cups mixed vegetables (broccoli, bell peppers, snap peas)",
      "1/2 sweet potato, spiralized or diced",
      "2 cloves garlic, minced",
      "2 tbsp coconut aminos",
      "1 tbsp coconut oil",
      "Fresh ginger, sesame seeds"
    ],
    instructions: "1. Heat coconut oil in wok or large skillet over high heat\n2. Add beef strips, cook 3-4 minutes until browned, remove\n3. Add garlic and ginger, sauté 30 seconds\n4. Add vegetables and sweet potato, stir-fry 5-6 minutes\n5. Return beef to pan\n6. Add coconut aminos and toss everything together\n7. Garnish with sesame seeds and serve",
    prepTime: 15,
    cookTime: 12,
    servings: 1,
    tags: ["Paleo", "Quick", "One-Pan"],
    isPublic: true
  },
  {
    name: "Mediterranean Grilled Fish & Salad",
    category: "Mediterranean",
    mealType: "Lunch",
    calories: 420,
    protein: 40,
    carbs: 30,
    fats: 16,
    ingredients: [
      "6 oz white fish (cod or sea bass)",
      "2 cups mixed greens",
      "1/2 cup quinoa, cooked",
      "1/4 cup olives",
      "1/4 cup cherry tomatoes",
      "2 tbsp feta cheese",
      "2 tbsp olive oil & lemon dressing",
      "Fresh herbs (dill, parsley)"
    ],
    instructions: "1. Season fish with lemon juice, olive oil, and herbs\n2. Grill fish for 4-5 minutes per side until flaky\n3. Arrange mixed greens on plate\n4. Add quinoa, olives, tomatoes, and feta\n5. Place grilled fish on top\n6. Drizzle with olive oil and lemon dressing\n7. Garnish with fresh herbs",
    prepTime: 10,
    cookTime: 10,
    servings: 1,
    tags: ["Mediterranean", "Heart-Healthy", "Light"],
    isPublic: true
  },

  // ==================== DINNER MEALS ====================
  {
    name: "Zucchini Noodles with Meatballs",
    category: "Low Carb",
    mealType: "Dinner",
    calories: 520,
    protein: 45,
    carbs: 18,
    fats: 32,
    ingredients: [
      "6 oz ground beef (90% lean)",
      "2 medium zucchinis, spiralized",
      "1 cup marinara sauce (low-sugar)",
      "2 tbsp parmesan cheese",
      "1 egg",
      "Italian seasoning",
      "Garlic, onion powder",
      "Fresh basil"
    ],
    instructions: "1. Mix ground beef with egg, Italian seasoning, garlic, and onion powder\n2. Form into 6-8 meatballs\n3. Bake at 400°F for 20 minutes or pan-fry until cooked through\n4. Spiralize zucchini into noodles\n5. Sauté zoodles in a pan for 2-3 minutes (don't overcook)\n6. Heat marinara sauce and add meatballs\n7. Serve meatballs and sauce over zoodles, top with parmesan and basil",
    prepTime: 15,
    cookTime: 25,
    servings: 1,
    tags: ["Low-Carb", "Italian-Inspired", "Comfort Food"],
    isPublic: true
  },
  {
    name: "Grilled Salmon with Sweet Potato",
    category: "High Protein",
    mealType: "Dinner",
    calories: 580,
    protein: 50,
    carbs: 45,
    fats: 20,
    ingredients: [
      "7 oz salmon fillet",
      "1 large sweet potato",
      "2 cups asparagus",
      "2 tsp olive oil",
      "Lemon wedges",
      "Garlic powder, paprika",
      "Fresh dill",
      "Salt and pepper"
    ],
    instructions: "1. Preheat oven to 425°F\n2. Cut sweet potato into wedges, toss with 1 tsp olive oil and seasonings\n3. Roast sweet potato for 25-30 minutes, flipping halfway\n4. Season salmon with garlic powder, paprika, salt, and pepper\n5. Grill or bake salmon for 12-15 minutes at 400°F\n6. Sauté asparagus with remaining olive oil for 5-7 minutes\n7. Serve salmon with sweet potato wedges and asparagus, garnish with dill and lemon",
    prepTime: 10,
    cookTime: 30,
    servings: 1,
    tags: ["Omega-3 Rich", "Complete Meal", "Healthy Fats"],
    isPublic: true
  },
  {
    name: "Keto Steak with Cauliflower Mash",
    category: "Ketogenic",
    mealType: "Dinner",
    calories: 620,
    protein: 48,
    carbs: 12,
    fats: 44,
    ingredients: [
      "6 oz ribeye steak",
      "2 cups cauliflower florets",
      "3 tbsp butter",
      "2 tbsp heavy cream",
      "1 cup sautéed spinach",
      "2 cloves garlic",
      "Salt, pepper, rosemary"
    ],
    instructions: "1. Season steak generously with salt, pepper, and rosemary\n2. Let steak rest at room temperature for 15 minutes\n3. Steam cauliflower until very tender (12-15 minutes)\n4. Mash cauliflower with 2 tbsp butter, heavy cream, and garlic\n5. Heat cast iron skillet to high heat\n6. Sear steak 3-4 minutes per side for medium-rare\n7. Let steak rest 5 minutes, then top with remaining butter\n8. Serve with cauliflower mash and sautéed spinach",
    prepTime: 10,
    cookTime: 25,
    servings: 1,
    tags: ["Keto", "High-Fat", "Satisfying"],
    isPublic: true
  },
  {
    name: "Vegan Lentil Curry",
    category: "Vegan",
    mealType: "Dinner",
    calories: 480,
    protein: 24,
    carbs: 72,
    fats: 12,
    ingredients: [
      "1 cup red lentils, cooked",
      "1 cup coconut milk (light)",
      "1 cup diced tomatoes",
      "1 cup spinach",
      "1 onion, diced",
      "2 cloves garlic, minced",
      "1 tbsp curry powder",
      "1 tsp turmeric",
      "1 cup basmati rice, cooked",
      "Fresh cilantro"
    ],
    instructions: "1. Sauté onion and garlic in a large pot until fragrant\n2. Add curry powder and turmeric, cook 1 minute\n3. Add lentils, tomatoes, and coconut milk\n4. Simmer for 20 minutes until lentils are tender\n5. Stir in spinach and cook until wilted\n6. Season with salt and pepper\n7. Serve over basmati rice\n8. Garnish with fresh cilantro",
    prepTime: 10,
    cookTime: 30,
    servings: 1,
    tags: ["Vegan", "Protein-Rich", "Indian-Inspired"],
    isPublic: true
  },
  {
    name: "Balanced Chicken Quinoa Bowl",
    category: "Balanced",
    mealType: "Dinner",
    calories: 510,
    protein: 42,
    carbs: 48,
    fats: 16,
    ingredients: [
      "6 oz grilled chicken breast",
      "3/4 cup cooked quinoa",
      "1 cup roasted vegetables (zucchini, bell pepper, onion)",
      "1/4 avocado, sliced",
      "2 tbsp Greek yogurt",
      "1 tbsp olive oil",
      "Lime wedge",
      "Cilantro, cumin"
    ],
    instructions: "1. Season chicken with cumin, salt, and pepper\n2. Grill chicken for 6-7 minutes per side until cooked through\n3. Toss vegetables with olive oil and roast at 425°F for 20 minutes\n4. Cook quinoa according to package directions\n5. Assemble bowl with quinoa as base\n6. Add roasted vegetables and sliced chicken\n7. Top with avocado, Greek yogurt, cilantro, and lime juice",
    prepTime: 10,
    cookTime: 25,
    servings: 1,
    tags: ["Balanced", "Bowl", "Meal Prep"],
    isPublic: true
  },
  {
    name: "Paleo Herb-Crusted Pork Chop",
    category: "Paleo",
    mealType: "Dinner",
    calories: 540,
    protein: 46,
    carbs: 32,
    fats: 26,
    ingredients: [
      "7 oz bone-in pork chop",
      "1 medium sweet potato",
      "2 cups Brussels sprouts, halved",
      "2 tbsp fresh herbs (thyme, rosemary)",
      "2 cloves garlic, minced",
      "2 tbsp ghee or coconut oil",
      "Apple slices for garnish"
    ],
    instructions: "1. Preheat oven to 400°F\n2. Rub pork chop with herbs, garlic, salt, and pepper\n3. Dice sweet potato and toss with 1 tbsp ghee\n4. Roast sweet potato for 20 minutes\n5. Sear pork chop in remaining ghee, 3 minutes per side\n6. Transfer to oven and cook for 8-10 minutes\n7. Sauté Brussels sprouts in same pan for 8-10 minutes\n8. Serve pork with sweet potato and Brussels sprouts",
    prepTime: 10,
    cookTime: 30,
    servings: 1,
    tags: ["Paleo", "Hearty", "Traditional"],
    isPublic: true
  },
  {
    name: "Mediterranean Baked Chicken",
    category: "Mediterranean",
    mealType: "Dinner",
    calories: 480,
    protein: 45,
    carbs: 38,
    fats: 18,
    ingredients: [
      "6 oz chicken breast",
      "1 cup cherry tomatoes",
      "1/4 cup Kalamata olives",
      "2 tbsp feta cheese",
      "1/2 cup cooked whole wheat couscous",
      "2 tsp olive oil",
      "Fresh oregano, basil",
      "Lemon juice",
      "Garlic"
    ],
    instructions: "1. Preheat oven to 400°F\n2. Place chicken in baking dish\n3. Surround with cherry tomatoes, olives, and garlic\n4. Drizzle with olive oil and lemon juice\n5. Season with oregano, basil, salt, and pepper\n6. Bake for 25-30 minutes until chicken reaches 165°F\n7. Cook couscous according to package directions\n8. Serve chicken and vegetables over couscous\n9. Top with crumbled feta",
    prepTime: 10,
    cookTime: 30,
    servings: 1,
    tags: ["Mediterranean", "One-Pan", "Flavorful"],
    isPublic: true
  },

  // ==================== SNACK MEALS ====================
  {
    name: "Deviled Eggs (Low Carb)",
    category: "Low Carb",
    mealType: "Snack",
    calories: 180,
    protein: 14,
    carbs: 2,
    fats: 13,
    ingredients: [
      "3 hard-boiled eggs",
      "2 tbsp mayonnaise",
      "1 tsp Dijon mustard",
      "Paprika",
      "Salt and pepper",
      "Fresh chives"
    ],
    instructions: "1. Slice hard-boiled eggs in half lengthwise\n2. Remove yolks and place in a bowl\n3. Mash yolks with mayonnaise, mustard, salt, and pepper\n4. Spoon or pipe mixture back into egg whites\n5. Sprinkle with paprika and chives\n6. Refrigerate until ready to serve",
    prepTime: 10,
    cookTime: 0,
    servings: 1,
    tags: ["Low-Carb", "High-Protein", "Make-Ahead"],
    isPublic: true
  },
  {
    name: "Greek Yogurt Protein Parfait",
    category: "High Protein",
    mealType: "Snack",
    calories: 240,
    protein: 28,
    carbs: 26,
    fats: 4,
    ingredients: [
      "1 cup plain Greek yogurt (non-fat)",
      "1/2 scoop vanilla protein powder",
      "1/4 cup mixed berries",
      "2 tbsp low-fat granola",
      "1 tsp honey",
      "Cinnamon"
    ],
    instructions: "1. Mix Greek yogurt with protein powder in a bowl\n2. Layer half the yogurt mixture in a glass or bowl\n3. Add half the berries and granola\n4. Repeat layers\n5. Drizzle with honey\n6. Sprinkle with cinnamon\n7. Serve immediately",
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    tags: ["High-Protein", "Quick", "Sweet"],
    isPublic: true
  },
  {
    name: "Keto Fat Bombs",
    category: "Ketogenic",
    mealType: "Snack",
    calories: 280,
    protein: 4,
    carbs: 3,
    fats: 28,
    ingredients: [
      "3 tbsp cream cheese",
      "2 tbsp almond butter",
      "2 tbsp coconut oil",
      "1 tbsp unsweetened cocoa powder",
      "Stevia to taste",
      "Sea salt"
    ],
    instructions: "1. Soften cream cheese and coconut oil at room temperature\n2. Mix all ingredients in a bowl until smooth\n3. Spoon mixture into silicone molds or shape into balls\n4. Freeze for 1 hour until firm\n5. Store in refrigerator\n6. Eat 2-3 fat bombs as a snack",
    prepTime: 10,
    cookTime: 0,
    servings: 3,
    tags: ["Keto", "Energy", "Sweet Treat"],
    isPublic: true
  },
  {
    name: "Hummus & Veggie Sticks",
    category: "Vegan",
    mealType: "Snack",
    calories: 220,
    protein: 8,
    carbs: 28,
    fats: 10,
    ingredients: [
      "1/2 cup hummus",
      "1 cup mixed raw vegetables (carrots, celery, cucumber, bell pepper)",
      "Cherry tomatoes",
      "Lemon wedge",
      "Paprika for sprinkling"
    ],
    instructions: "1. Cut all vegetables into sticks or bite-sized pieces\n2. Arrange vegetables on a plate\n3. Place hummus in a small bowl\n4. Sprinkle hummus with paprika\n5. Add lemon wedge on the side\n6. Dip and enjoy",
    prepTime: 10,
    cookTime: 0,
    servings: 1,
    tags: ["Vegan", "Crunchy", "Fiber-Rich"],
    isPublic: true
  },
  {
    name: "Apple with Almond Butter",
    category: "Balanced",
    mealType: "Snack",
    calories: 200,
    protein: 6,
    carbs: 28,
    fats: 10,
    ingredients: [
      "1 medium apple, sliced",
      "2 tbsp almond butter",
      "Cinnamon",
      "Optional: dark chocolate chips (5-6)"
    ],
    instructions: "1. Wash and slice apple into 8-10 wedges\n2. Arrange apple slices on a plate\n3. Drizzle or spread almond butter over slices\n4. Sprinkle with cinnamon\n5. Add a few dark chocolate chips if desired\n6. Serve immediately",
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    tags: ["Balanced", "Quick", "Natural Sweetness"],
    isPublic: true
  },
  {
    name: "Paleo Trail Mix",
    category: "Paleo",
    mealType: "Snack",
    calories: 260,
    protein: 8,
    carbs: 18,
    fats: 20,
    ingredients: [
      "1/4 cup mixed nuts (almonds, walnuts, cashews)",
      "2 tbsp dried fruit (unsweetened)",
      "1 tbsp dark chocolate chips (70%+ cacao)",
      "1 tbsp pumpkin seeds",
      "1 tbsp coconut flakes (unsweetened)"
    ],
    instructions: "1. Mix all ingredients in a bowl or bag\n2. Portion into snack-sized servings\n3. Store in airtight container\n4. Grab and go when needed",
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    tags: ["Paleo", "Portable", "Energy Boost"],
    isPublic: true
  },
  {
    name: "Mediterranean Mezze Plate",
    category: "Mediterranean",
    mealType: "Snack",
    calories: 240,
    protein: 12,
    carbs: 22,
    fats: 14,
    ingredients: [
      "1/4 cup hummus",
      "2 tbsp tzatziki",
      "1/4 cup olives",
      "2 oz feta cheese",
      "4 whole wheat crackers",
      "Cherry tomatoes",
      "Cucumber slices"
    ],
    instructions: "1. Arrange all ingredients on a small plate\n2. Place hummus and tzatziki in small bowls\n3. Add olives, feta, tomatoes, and cucumber\n4. Serve with whole wheat crackers\n5. Mix and match as you eat",
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    tags: ["Mediterranean", "Variety", "Sharing-Style"],
    isPublic: true
  },

  // ==================== POST-WORKOUT MEALS ====================
  {
    name: "Post-Workout Egg White Omelette",
    category: "Low Carb",
    mealType: "Post-Workout",
    calories: 220,
    protein: 32,
    carbs: 8,
    fats: 6,
    ingredients: [
      "6 egg whites",
      "1 whole egg",
      "1/2 cup spinach",
      "1/4 cup mushrooms",
      "2 tbsp low-fat cheese",
      "Cooking spray",
      "Salt, pepper, herbs"
    ],
    instructions: "1. Whisk egg whites and whole egg together\n2. Heat non-stick pan with cooking spray\n3. Pour in eggs and cook until edges set\n4. Add spinach, mushrooms, and cheese on one side\n5. Fold omelette in half\n6. Cook 2 more minutes until cheese melts\n7. Serve immediately",
    prepTime: 5,
    cookTime: 8,
    servings: 1,
    tags: ["Post-Workout", "High-Protein", "Low-Fat"],
    isPublic: true
  },
  {
    name: "Mass Gainer Protein Shake",
    category: "High Protein",
    mealType: "Post-Workout",
    calories: 520,
    protein: 50,
    carbs: 60,
    fats: 8,
    ingredients: [
      "2 scoops whey protein powder",
      "1 cup milk",
      "1 banana",
      "1/2 cup oats",
      "1 tbsp peanut butter",
      "1 tsp honey",
      "Ice cubes"
    ],
    instructions: "1. Add all ingredients to a blender\n2. Blend on high for 30-60 seconds until smooth\n3. Add more milk if too thick\n4. Pour into a glass\n5. Drink within 30 minutes post-workout\n6. Follow with a complete meal in 1-2 hours",
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    tags: ["Post-Workout", "Mass Gainer", "Quick Recovery"],
    isPublic: true
  },
  {
    name: "Keto Post-Workout Smoothie",
    category: "Ketogenic",
    mealType: "Post-Workout",
    calories: 340,
    protein: 28,
    carbs: 8,
    fats: 24,
    ingredients: [
      "1 scoop keto protein powder",
      "1 cup unsweetened almond milk",
      "2 tbsp heavy cream",
      "1 tbsp MCT oil",
      "1/4 avocado",
      "Handful of spinach",
      "Stevia to taste",
      "Ice cubes"
    ],
    instructions: "1. Add all ingredients to blender\n2. Blend until completely smooth\n3. Adjust sweetness with stevia if needed\n4. Pour into glass\n5. Consume immediately after workout\n6. Provides protein without kicking you out of ketosis",
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    tags: ["Keto", "Post-Workout", "Low-Carb Recovery"],
    isPublic: true
  },
  {
    name: "Vegan Protein Power Smoothie",
    category: "Vegan",
    mealType: "Post-Workout",
    calories: 380,
    protein: 26,
    carbs: 54,
    fats: 8,
    ingredients: [
      "1 scoop vegan protein powder",
      "1 cup almond milk",
      "1 banana",
      "1 cup spinach",
      "1 tbsp chia seeds",
      "1 tbsp almond butter",
      "1/2 cup frozen berries",
      "Dates for sweetness (optional)"
    ],
    instructions: "1. Combine all ingredients in blender\n2. Blend on high until smooth and creamy\n3. Add more almond milk if too thick\n4. Taste and adjust sweetness\n5. Pour into glass\n6. Drink within 30 minutes of finishing workout",
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    tags: ["Vegan", "Plant Protein", "Recovery"],
    isPublic: true
  },
  {
    name: "Balanced Recovery Bowl",
    category: "Balanced",
    mealType: "Post-Workout",
    calories: 420,
    protein: 32,
    carbs: 50,
    fats: 10,
    ingredients: [
      "1 scoop vanilla protein powder",
      "1/2 cup Greek yogurt",
      "1/2 cup cooked oats",
      "1 banana, sliced",
      "1/4 cup blueberries",
      "1 tbsp honey",
      "1 tbsp sliced almonds",
      "Cinnamon"
    ],
    instructions: "1. Mix protein powder with Greek yogurt\n2. Cook oats with water or milk\n3. Combine yogurt mixture with warm oats\n4. Top with banana slices and blueberries\n5. Drizzle with honey\n6. Sprinkle with almonds and cinnamon\n7. Eat while oats are still warm",
    prepTime: 5,
    cookTime: 5,
    servings: 1,
    tags: ["Balanced", "Recovery", "Warm Meal"],
    isPublic: true
  },
  {
    name: "Paleo Sweet Potato Protein Bowl",
    category: "Paleo",
    mealType: "Post-Workout",
    calories: 390,
    protein: 34,
    carbs: 42,
    fats: 10,
    ingredients: [
      "1 medium sweet potato",
      "5 oz grilled chicken breast",
      "1/2 cup steamed broccoli",
      "1 tbsp almond butter",
      "Cinnamon",
      "Sea salt"
    ],
    instructions: "1. Bake or microwave sweet potato until tender\n2. Grill or bake chicken breast\n3. Steam broccoli for 5-7 minutes\n4. Mash sweet potato with cinnamon\n5. Slice chicken and place on sweet potato\n6. Add broccoli on the side\n7. Drizzle with almond butter\n8. Season with sea salt",
    prepTime: 5,
    cookTime: 20,
    servings: 1,
    tags: ["Paleo", "Whole Foods", "Recovery"],
    isPublic: true
  },
  {
    name: "Mediterranean Recovery Plate",
    category: "Mediterranean",
    mealType: "Post-Workout",
    calories: 450,
    protein: 36,
    carbs: 48,
    fats: 12,
    ingredients: [
      "6 oz grilled chicken breast",
      "1/2 cup cooked couscous",
      "1/4 cup hummus",
      "1/2 cup cucumber and tomato salad",
      "2 tbsp feta cheese",
      "Lemon wedge",
      "Fresh mint"
    ],
    instructions: "1. Grill seasoned chicken breast until cooked through\n2. Cook couscous according to package\n3. Dice cucumber and tomatoes\n4. Arrange couscous on plate\n5. Top with sliced chicken\n6. Add hummus and cucumber-tomato salad\n7. Crumble feta on top\n8. Squeeze lemon and garnish with mint",
    prepTime: 10,
    cookTime: 15,
    servings: 1,
    tags: ["Mediterranean", "Complete Meal", "Balanced"],
    isPublic: true
  },

  // ==================== PRE-WORKOUT MEALS ====================
  {
    name: "Pre-Workout Egg & Avocado",
    category: "Low Carb",
    mealType: "Pre-Workout",
    calories: 280,
    protein: 18,
    carbs: 12,
    fats: 20,
    ingredients: [
      "2 eggs, scrambled",
      "1/2 avocado",
      "1 cup spinach",
      "1 tsp olive oil",
      "Salt, pepper, hot sauce"
    ],
    instructions: "1. Heat olive oil in pan\n2. Sauté spinach until wilted\n3. Add eggs and scramble\n4. Season with salt and pepper\n5. Serve with sliced avocado\n6. Add hot sauce if desired\n7. Eat 45-60 minutes before workout",
    prepTime: 5,
    cookTime: 5,
    servings: 1,
    tags: ["Pre-Workout", "Quick Energy", "Low-Carb"],
    isPublic: true
  },
  {
    name: "Pre-Workout Oatmeal Power Bowl",
    category: "High Protein",
    mealType: "Pre-Workout",
    calories: 360,
    protein: 24,
    carbs: 48,
    fats: 8,
    ingredients: [
      "1/2 cup rolled oats",
      "1 scoop vanilla protein powder",
      "1 cup almond milk",
      "1/2 banana, sliced",
      "1 tbsp honey",
      "Cinnamon"
    ],
    instructions: "1. Cook oats with almond milk\n2. Stir in protein powder while hot\n3. Top with banana slices\n4. Drizzle with honey\n5. Sprinkle with cinnamon\n6. Let cool slightly before eating\n7. Consume 60-90 minutes before workout",
    prepTime: 3,
    cookTime: 5,
    servings: 1,
    tags: ["Pre-Workout", "Sustained Energy", "Warm"],
    isPublic: true
  },
  {
    name: "Keto Pre-Workout Coffee",
    category: "Ketogenic",
    mealType: "Pre-Workout",
    calories: 220,
    protein: 2,
    carbs: 2,
    fats: 24,
    ingredients: [
      "1 cup black coffee",
      "1 tbsp grass-fed butter",
      "1 tbsp MCT oil",
      "1 tbsp heavy cream",
      "Stevia (optional)",
      "Pinch of cinnamon"
    ],
    instructions: "1. Brew strong black coffee\n2. Add butter and MCT oil to blender\n3. Pour in hot coffee\n4. Add heavy cream and cinnamon\n5. Blend for 20-30 seconds until frothy\n6. Add stevia if desired\n7. Drink 30-45 minutes before workout",
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    tags: ["Keto", "Energy Boost", "Quick"],
    isPublic: true
  },
  {
    name: "Vegan Pre-Workout Energy Bites",
    category: "Vegan",
    mealType: "Pre-Workout",
    calories: 280,
    protein: 10,
    carbs: 38,
    fats: 12,
    ingredients: [
      "1 cup dates, pitted",
      "1/2 cup oats",
      "2 tbsp almond butter",
      "2 tbsp chia seeds",
      "1 tbsp maple syrup",
      "Pinch of sea salt"
    ],
    instructions: "1. Blend dates in food processor until paste forms\n2. Add oats, almond butter, chia seeds, maple syrup, and salt\n3. Pulse until well combined\n4. Roll mixture into 8-10 balls\n5. Refrigerate for 30 minutes\n6. Eat 2-3 balls 45-60 minutes before workout\n7. Store remainder in fridge for up to 1 week",
    prepTime: 15,
    cookTime: 0,
    servings: 4,
    tags: ["Vegan", "Make-Ahead", "Natural Energy"],
    isPublic: true
  },
  {
    name: "Balanced Pre-Workout Toast",
    category: "Balanced",
    mealType: "Pre-Workout",
    calories: 300,
    protein: 16,
    carbs: 38,
    fats: 10,
    ingredients: [
      "2 slices whole wheat bread",
      "2 tbsp almond butter",
      "1/2 banana, sliced",
      "1 tsp honey",
      "Cinnamon"
    ],
    instructions: "1. Toast bread until golden brown\n2. Spread almond butter evenly on toast\n3. Arrange banana slices on top\n4. Drizzle with honey\n5. Sprinkle with cinnamon\n6. Cut each slice in half\n7. Eat 60-90 minutes before workout",
    prepTime: 5,
    cookTime: 2,
    servings: 1,
    tags: ["Pre-Workout", "Simple", "Quick"],
    isPublic: true
  },
  {
    name: "Paleo Pre-Workout Fuel",
    category: "Paleo",
    mealType: "Pre-Workout",
    calories: 320,
    protein: 20,
    carbs: 32,
    fats: 14,
    ingredients: [
      "4 oz turkey breast, sliced",
      "1 medium sweet potato",
      "1 tbsp almond butter",
      "Cinnamon",
      "Sea salt"
    ],
    instructions: "1. Bake or microwave sweet potato until tender\n2. Slice turkey breast\n3. Mash sweet potato with almond butter and cinnamon\n4. Serve turkey alongside sweet potato\n5. Season with sea salt\n6. Eat 60-90 minutes before workout",
    prepTime: 5,
    cookTime: 8,
    servings: 1,
    tags: ["Paleo", "Clean Energy", "Whole Foods"],
    isPublic: true
  },
  {
    name: "Mediterranean Pre-Workout Pita",
    category: "Mediterranean",
    mealType: "Pre-Workout",
    calories: 340,
    protein: 18,
    carbs: 44,
    fats: 12,
    ingredients: [
      "1 whole wheat pita",
      "1/4 cup hummus",
      "3 oz grilled chicken",
      "Cucumber, tomato slices",
      "Fresh mint",
      "Lemon juice"
    ],
    instructions: "1. Warm pita slightly\n2. Spread hummus inside pita pocket\n3. Add sliced grilled chicken\n4. Add cucumber and tomato slices\n5. Sprinkle with fresh mint\n6. Squeeze lemon juice\n7. Eat 60-90 minutes before workout",
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    tags: ["Mediterranean", "Light", "Portable"],
    isPublic: true
  }
];

async function populateMealDatabase() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check existing meals
    const existingCount = await Meal.countDocuments();
    console.log(`📊 Found ${existingCount} existing meals in database`);

    if (existingCount > 0) {
      console.log('🗑️  Clearing existing meals...');
      await Meal.deleteMany({});
      console.log('✅ Existing meals cleared');
    }

    console.log(`📝 Creating ${meals.length} comprehensive meal recipes...`);
    
    let categoryCount: { [key: string]: number } = {};
    let mealTypeCount: { [key: string]: number } = {};

    for (const meal of meals) {
      await Meal.create(meal);
      
      // Count by category
      categoryCount[meal.category] = (categoryCount[meal.category] || 0) + 1;
      // Count by meal type
      mealTypeCount[meal.mealType] = (mealTypeCount[meal.mealType] || 0) + 1;
      
      console.log(`✅ ${meal.category} - ${meal.mealType}: ${meal.name}`);
    }

    console.log('\n🎉 Successfully created all meal recipes!');
    
    console.log('\n📊 Meals by Category:');
    Object.entries(categoryCount).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} meals`);
    });

    console.log('\n🍽️  Meals by Type:');
    Object.entries(mealTypeCount).forEach(([type, count]) => {
      console.log(`   ${type}: ${count} meals`);
    });

    console.log(`\n✅ Total: ${meals.length} meals ready in the database!`);
    console.log('✅ Meals can now be assigned to clients from the trainer dashboard!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

populateMealDatabase();
