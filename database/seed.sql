-- Sample data for testing
-- Insert a test user (password: 'password123')
INSERT INTO users (id, email, password_hash) VALUES 
  ('550e8400-e29b-41d4-a716-446655440000', 'test@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Insert sample recipes
INSERT INTO recipes (id, title, description, prep_time, cook_time, servings, difficulty, image_url, user_id, is_favorite) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Classic Margherita Pizza', 'A simple and delicious Italian pizza with fresh tomatoes, mozzarella, and basil.', 20, 15, 4, 'Easy', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500', '550e8400-e29b-41d4-a716-446655440000', true),
  ('550e8400-e29b-41d4-a716-446655440002', 'Chocolate Chip Cookies', 'Soft and chewy homemade chocolate chip cookies that are perfect for any occasion.', 15, 12, 24, 'Easy', 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500', '550e8400-e29b-41d4-a716-446655440000', false);

-- Insert ingredients for Margherita Pizza
INSERT INTO ingredients (recipe_id, name, quantity, unit, notes) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Pizza dough', '1', 'lb', 'store-bought or homemade'),
  ('550e8400-e29b-41d4-a716-446655440001', 'Tomato sauce', '1/2', 'cup', 'simple marinara'),
  ('550e8400-e29b-41d4-a716-446655440001', 'Fresh mozzarella', '8', 'oz', 'sliced'),
  ('550e8400-e29b-41d4-a716-446655440001', 'Fresh basil', '1/4', 'cup', 'torn'),
  ('550e8400-e29b-41d4-a716-446655440001', 'Olive oil', '2', 'tbsp', 'extra virgin'),
  ('550e8400-e29b-41d4-a716-446655440001', 'Salt', '1', 'tsp', 'to taste');

-- Insert ingredients for Chocolate Chip Cookies
INSERT INTO ingredients (recipe_id, name, quantity, unit, notes) VALUES
  ('550e8400-e29b-41d4-a716-446655440002', 'All-purpose flour', '2 1/4', 'cups', ''),
  ('550e8400-e29b-41d4-a716-446655440002', 'Butter', '1', 'cup', 'softened'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Brown sugar', '3/4', 'cup', 'packed'),
  ('550e8400-e29b-41d4-a716-446655440002', 'White sugar', '1/2', 'cup', ''),
  ('550e8400-e29b-41d4-a716-446655440002', 'Eggs', '2', 'large', ''),
  ('550e8400-e29b-41d4-a716-446655440002', 'Vanilla extract', '2', 'tsp', ''),
  ('550e8400-e29b-41d4-a716-446655440002', 'Baking soda', '1', 'tsp', ''),
  ('550e8400-e29b-41d4-a716-446655440002', 'Salt', '1', 'tsp', ''),
  ('550e8400-e29b-41d4-a716-446655440002', 'Chocolate chips', '2', 'cups', 'semi-sweet');

-- Insert instructions for Margherita Pizza
INSERT INTO instructions (recipe_id, step_number, content) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 1, 'Preheat oven to 475°F (245°C).'),
  ('550e8400-e29b-41d4-a716-446655440001', 2, 'Roll out the pizza dough on a floured surface to desired thickness.'),
  ('550e8400-e29b-41d4-a716-446655440001', 3, 'Transfer dough to a pizza pan or baking sheet.'),
  ('550e8400-e29b-41d4-a716-446655440001', 4, 'Spread tomato sauce evenly over the dough.'),
  ('550e8400-e29b-41d4-a716-446655440001', 5, 'Arrange mozzarella slices on top of the sauce.'),
  ('550e8400-e29b-41d4-a716-446655440001', 6, 'Drizzle with olive oil and sprinkle with salt.'),
  ('550e8400-e29b-41d4-a716-446655440001', 7, 'Bake for 12-15 minutes until crust is golden and cheese is bubbly.'),
  ('550e8400-e29b-41d4-a716-446655440001', 8, 'Remove from oven and top with fresh basil before serving.');

-- Insert instructions for Chocolate Chip Cookies
INSERT INTO instructions (recipe_id, step_number, content) VALUES
  ('550e8400-e29b-41d4-a716-446655440002', 1, 'Preheat oven to 375°F (190°C).'),
  ('550e8400-e29b-41d4-a716-446655440002', 2, 'In a large bowl, cream together butter and both sugars until light and fluffy.'),
  ('550e8400-e29b-41d4-a716-446655440002', 3, 'Beat in eggs one at a time, then stir in vanilla.'),
  ('550e8400-e29b-41d4-a716-446655440002', 4, 'In a separate bowl, combine flour, baking soda, and salt.'),
  ('550e8400-e29b-41d4-a716-446655440002', 5, 'Gradually blend flour mixture into the butter mixture.'),
  ('550e8400-e29b-41d4-a716-446655440002', 6, 'Stir in chocolate chips.'),
  ('550e8400-e29b-41d4-a716-446655440002', 7, 'Drop rounded tablespoons of dough onto ungreased cookie sheets.'),
  ('550e8400-e29b-41d4-a716-446655440002', 8, 'Bake for 9-11 minutes until golden brown.'),
  ('550e8400-e29b-41d4-a716-446655440002', 9, 'Cool on baking sheet for 2 minutes before removing to wire rack.');

-- Insert nutrition for Margherita Pizza
INSERT INTO nutrition (recipe_id, calories, protein, carbs, fat, fiber, sodium) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 320, 15, 35, 12, 2, 680);

-- Insert nutrition for Chocolate Chip Cookies
INSERT INTO nutrition (recipe_id, calories, protein, carbs, fat, fiber, sodium) VALUES
  ('550e8400-e29b-41d4-a716-446655440002', 95, 1, 12, 5, 0, 85);

-- Add dietary tags to recipes
INSERT INTO recipe_dietary_tags (recipe_id, tag_id) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM dietary_tags WHERE name = 'Vegetarian')),
  ('550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM dietary_tags WHERE name = 'Vegetarian'));
