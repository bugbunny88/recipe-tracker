import { Recipe } from './types';
import { v4 as uuidv4 } from 'uuid';

export const dietaryTags = [
  'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free',
  'Low-Carb', 'Keto', 'Paleo', 'Whole30', 'Pescatarian', 'High-Protein'
];

export const mockRecipes: Recipe[] = [
  {
    id: uuidv4(),
    title: 'Authentic Mexican Guacamole',
    description: 'A simple, authentic Mexican guacamole recipe with fresh ingredients that bring out the flavors of avocado.',
    prepTime: 15,
    cookTime: 0,
    servings: 4,
    difficulty: 'Easy',
    ingredients: [
      {
        id: uuidv4(),
        name: 'Ripe Avocados',
        quantity: '3',
        unit: 'whole',
        notes: 'Hass avocados preferred'
      },
      {
        id: uuidv4(),
        name: 'Lime',
        quantity: '1',
        unit: 'whole',
        notes: 'Juiced'
      },
      {
        id: uuidv4(),
        name: 'Red Onion',
        quantity: '1/4',
        unit: 'cup',
        notes: 'Finely diced'
      },
      {
        id: uuidv4(),
        name: 'Cilantro',
        quantity: '2',
        unit: 'tablespoons',
        notes: 'Chopped'
      },
      {
        id: uuidv4(),
        name: 'Jalapeño',
        quantity: '1',
        unit: 'whole',
        notes: 'Seeded and minced',
        substitutes: ['Serrano pepper', 'Green chili']
      },
      {
        id: uuidv4(),
        name: 'Salt',
        quantity: '1/2',
        unit: 'teaspoon',
        notes: 'Or to taste'
      }
    ],
    instructions: [
      'Cut avocados in half, remove the pit, and scoop into a bowl.',
      'Add lime juice and mash avocados with a fork to desired consistency.',
      'Stir in onion, cilantro, and jalapeño.',
      'Season with salt to taste.',
      'Serve immediately or cover tightly with plastic wrap (press down on the surface) and refrigerate.'
    ],
    dietaryTags: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free'],
    imageUrl: 'https://images.pexels.com/photos/5865065/pexels-photo-5865065.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    createdAt: new Date(2023, 5, 10).toISOString(),
    updatedAt: new Date(2023, 5, 10).toISOString(),
    nutrition: {
      calories: 250,
      protein: 3,
      carbs: 15,
      fat: 22,
      fiber: 10,
      sodium: 380
    },
    isFavorite: true,
    affiliateLinks: [
      {
        id: uuidv4(),
        title: 'Premium Hass Avocados',
        url: 'https://example.com/avocados',
        description: 'Perfectly ripe Hass avocados delivered to your door'
      },
      {
        id: uuidv4(),
        title: 'Authentic Molcajete',
        url: 'https://example.com/molcajete',
        description: 'Traditional Mexican mortar and pestle for making perfect guacamole'
      }
    ]
  },
  {
    id: uuidv4(),
    title: 'Classic Cuban Ropa Vieja',
    description: 'A traditional Cuban shredded beef dish with a rich tomato sauce, peppers, and olives.',
    prepTime: 30,
    cookTime: 180,
    servings: 6,
    difficulty: 'Medium',
    ingredients: [
      {
        id: uuidv4(),
        name: 'Flank Steak',
        quantity: '2',
        unit: 'pounds',
        notes: 'Or skirt steak',
        substitutes: ['Chuck roast']
      },
      {
        id: uuidv4(),
        name: 'Olive Oil',
        quantity: '3',
        unit: 'tablespoons'
      },
      {
        id: uuidv4(),
        name: 'Bell Peppers',
        quantity: '2',
        unit: 'whole',
        notes: 'Sliced, one red and one green'
      },
      {
        id: uuidv4(),
        name: 'Onion',
        quantity: '1',
        unit: 'large',
        notes: 'Sliced'
      },
      {
        id: uuidv4(),
        name: 'Garlic',
        quantity: '4',
        unit: 'cloves',
        notes: 'Minced'
      },
      {
        id: uuidv4(),
        name: 'Crushed Tomatoes',
        quantity: '14',
        unit: 'ounces',
        notes: 'Canned'
      },
      {
        id: uuidv4(),
        name: 'Beef Broth',
        quantity: '1',
        unit: 'cup'
      },
      {
        id: uuidv4(),
        name: 'Green Olives',
        quantity: '1/2',
        unit: 'cup',
        notes: 'Sliced'
      },
      {
        id: uuidv4(),
        name: 'Cumin',
        quantity: '1',
        unit: 'teaspoon'
      },
      {
        id: uuidv4(),
        name: 'Oregano',
        quantity: '1',
        unit: 'teaspoon'
      },
      {
        id: uuidv4(),
        name: 'Bay Leaves',
        quantity: '2',
        unit: 'whole'
      }
    ],
    instructions: [
      'Season the flank steak with salt and pepper.',
      'Heat olive oil in a large Dutch oven over medium-high heat. Brown the steak on both sides, then remove from the pot.',
      'In the same pot, add onions and peppers, and sauté until softened, about 5 minutes.',
      'Add garlic and cook for another minute until fragrant.',
      'Pour in crushed tomatoes and beef broth. Add cumin, oregano, and bay leaves.',
      'Return the beef to the pot, bring to a simmer, reduce heat to low, cover, and cook for about 3 hours until the meat is very tender.',
      'Remove the meat and shred it using two forks.',
      'Return the shredded meat to the sauce, add the olives, and simmer for another 15-20 minutes.',
      'Adjust seasonings to taste and serve over rice.'
    ],
    dietaryTags: ['Dairy-Free'],
    imageUrl: 'https://images.pexels.com/photos/14597516/pexels-photo-14597516.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    createdAt: new Date(2023, 6, 15).toISOString(),
    updatedAt: new Date(2023, 6, 15).toISOString(),
    nutrition: {
      calories: 380,
      protein: 35,
      carbs: 12,
      fat: 22,
      fiber: 3,
      sodium: 620
    },
    isFavorite: false
  },
  {
    id: uuidv4(),
    title: 'Brazilian Cheese Bread (Pão de Queijo)',
    description: 'Delicious gluten-free Brazilian cheese puffs made with tapioca flour.',
    prepTime: 15,
    cookTime: 25,
    servings: 20,
    difficulty: 'Easy',
    ingredients: [
      {
        id: uuidv4(),
        name: 'Tapioca Flour',
        quantity: '2',
        unit: 'cups',
        notes: 'Also called tapioca starch',
        substitutes: ['Cassava flour']
      },
      {
        id: uuidv4(),
        name: 'Milk',
        quantity: '1',
        unit: 'cup'
      },
      {
        id: uuidv4(),
        name: 'Vegetable Oil',
        quantity: '1/2',
        unit: 'cup'
      },
      {
        id: uuidv4(),
        name: 'Eggs',
        quantity: '2',
        unit: 'large'
      },
      {
        id: uuidv4(),
        name: 'Parmesan Cheese',
        quantity: '1',
        unit: 'cup',
        notes: 'Grated'
      },
      {
        id: uuidv4(),
        name: 'Salt',
        quantity: '1',
        unit: 'teaspoon'
      }
    ],
    instructions: [
      'Preheat oven to 375°F (190°C) and line a baking sheet with parchment paper.',
      'In a saucepan, combine milk, oil, and salt. Bring to a gentle boil over medium heat.',
      'Remove from heat and immediately stir in tapioca flour until well combined.',
      'Transfer mixture to a stand mixer with a paddle attachment. Beat at medium speed until cooled slightly, about 2 minutes.',
      'Add eggs one at a time, beating well after each addition.',
      'Add grated cheese and mix until fully incorporated.',
      'Drop rounded tablespoons of the dough onto the prepared baking sheet, spacing them 2 inches apart.',
      'Bake for 20-25 minutes until puffed and golden.',
      'Serve warm for the best texture and flavor.'
    ],
    dietaryTags: ['Gluten-Free', 'Vegetarian'],
    imageUrl: 'https://images.pexels.com/photos/5500954/pexels-photo-5500954.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    createdAt: new Date(2023, 7, 20).toISOString(),
    updatedAt: new Date(2023, 7, 20).toISOString(),
    nutrition: {
      calories: 120,
      protein: 3,
      carbs: 15,
      fat: 6,
      sodium: 150
    },
    isFavorite: true,
    affiliateLinks: [
      {
        id: uuidv4(),
        title: 'Authentic Tapioca Flour',
        url: 'https://example.com/tapioca-flour',
        description: 'Premium Brazilian tapioca flour for authentic pão de queijo'
      }
    ]
  }
];