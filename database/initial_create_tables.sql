-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- Enable Row Level Security (RLS)
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_dietary_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_links ENABLE ROW LEVEL SECURITY;

-- RLS Policies for recipes
CREATE POLICY "Users can view their own recipes"
  ON recipes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own recipes"
  ON recipes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recipes"
  ON recipes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recipes"
  ON recipes FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for ingredients
CREATE POLICY "Users can view their recipes' ingredients"
  ON ingredients FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM recipes
    WHERE recipes.id = ingredients.recipe_id
    AND recipes.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert ingredients to their recipes"
  ON ingredients FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM recipes
    WHERE recipes.id = ingredients.recipe_id
    AND recipes.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their recipes' ingredients"
  ON ingredients FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM recipes
    WHERE recipes.id = ingredients.recipe_id
    AND recipes.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their recipes' ingredients"
  ON ingredients FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM recipes
    WHERE recipes.id = ingredients.recipe_id
    AND recipes.user_id = auth.uid()
  ));

-- RLS Policies for instructions
CREATE POLICY "Users can view their recipes' instructions"
  ON instructions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM recipes
    WHERE recipes.id = instructions.recipe_id
    AND recipes.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert instructions to their recipes"
  ON instructions FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM recipes
    WHERE recipes.id = instructions.recipe_id
    AND recipes.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their recipes' instructions"
  ON instructions FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM recipes
    WHERE recipes.id = instructions.recipe_id
    AND recipes.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their recipes' instructions"
  ON instructions FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM recipes
    WHERE recipes.id = instructions.recipe_id
    AND recipes.user_id = auth.uid()
  ));

-- RLS Policies for recipe_dietary_tags
CREATE POLICY "Users can view their recipes' dietary tags"
  ON recipe_dietary_tags FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM recipes
    WHERE recipes.id = recipe_dietary_tags.recipe_id
    AND recipes.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert dietary tags to their recipes"
  ON recipe_dietary_tags FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM recipes
    WHERE recipes.id = recipe_dietary_tags.recipe_id
    AND recipes.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their recipes' dietary tags"
  ON recipe_dietary_tags FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM recipes
    WHERE recipes.id = recipe_dietary_tags.recipe_id
    AND recipes.user_id = auth.uid()
  ));

-- RLS Policies for nutrition
CREATE POLICY "Users can view their recipes' nutrition"
  ON nutrition FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM recipes
    WHERE recipes.id = nutrition.recipe_id
    AND recipes.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert nutrition to their recipes"
  ON nutrition FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM recipes
    WHERE recipes.id = nutrition.recipe_id
    AND recipes.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their recipes' nutrition"
  ON nutrition FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM recipes
    WHERE recipes.id = nutrition.recipe_id
    AND recipes.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their recipes' nutrition"
  ON nutrition FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM recipes
    WHERE recipes.id = nutrition.recipe_id
    AND recipes.user_id = auth.uid()
  ));

-- RLS Policies for affiliate_links
CREATE POLICY "Users can view their recipes' affiliate links"
  ON affiliate_links FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM recipes
    WHERE recipes.id = affiliate_links.recipe_id
    AND recipes.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert affiliate links to their recipes"
  ON affiliate_links FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM recipes
    WHERE recipes.id = affiliate_links.recipe_id
    AND recipes.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their recipes' affiliate links"
  ON affiliate_links FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM recipes
    WHERE recipes.id = affiliate_links.recipe_id
    AND recipes.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their recipes' affiliate links"
  ON affiliate_links FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM recipes
    WHERE recipes.id = affiliate_links.recipe_id
    AND recipes.user_id = auth.uid()
  ));

-- Public access policy for dietary_tags (anyone can view)
ALTER TABLE dietary_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view dietary tags"
  ON dietary_tags FOR SELECT
  USING (true);

-- Only allow authenticated users to insert dietary tags
CREATE POLICY "Authenticated users can insert dietary tags"
  ON dietary_tags FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');