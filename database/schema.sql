-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table for local authentication
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recipes table
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  prep_time INTEGER NOT NULL,
  cook_time INTEGER NOT NULL,
  servings INTEGER NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  is_favorite BOOLEAN DEFAULT FALSE
);

-- Ingredients table
CREATE TABLE ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quantity TEXT NOT NULL,
  unit TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Instructions table
CREATE TABLE instructions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dietary tags table
CREATE TABLE dietary_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL
);

-- Recipe-dietary tags relationship table
CREATE TABLE recipe_dietary_tags (
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES dietary_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (recipe_id, tag_id)
);

-- Nutrition table
CREATE TABLE nutrition (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE UNIQUE,
  calories INTEGER NOT NULL,
  protein INTEGER NOT NULL,
  carbs INTEGER NOT NULL,
  fat INTEGER NOT NULL,
  sugar INTEGER,
  fiber INTEGER,
  sodium INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Affiliate links table
CREATE TABLE affiliate_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Populate dietary tags with default values
INSERT INTO dietary_tags (name) VALUES
  ('Vegetarian'),
  ('Vegan'),
  ('Gluten-Free'),
  ('Dairy-Free'),
  ('Nut-Free'),
  ('Low-Carb'),
  ('Keto'),
  ('Paleo'),
  ('Whole30'),
  ('Pescatarian'),
  ('High-Protein');

-- Create indexes for better performance
CREATE INDEX idx_recipes_user_id ON recipes(user_id);
CREATE INDEX idx_ingredients_recipe_id ON ingredients(recipe_id);
CREATE INDEX idx_instructions_recipe_id ON instructions(recipe_id);
CREATE INDEX idx_recipe_dietary_tags_recipe_id ON recipe_dietary_tags(recipe_id);
CREATE INDEX idx_nutrition_recipe_id ON nutrition(recipe_id);
CREATE INDEX idx_affiliate_links_recipe_id ON affiliate_links(recipe_id);
CREATE INDEX idx_users_email ON users(email);
