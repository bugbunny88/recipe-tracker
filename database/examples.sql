-- See all users
SELECT
    *
FROM
    users
WHERE
    email = 'denisek.xo@gmail.com';

-- See all recipes with their details
SELECT
    r.id,
    r.title,
    r.description,
    r.prep_time,
    r.cook_time,
    r.servings,
    r.difficulty,
    r.is_favorite,
    u.email as user_email
FROM
    recipes r
    JOIN users u ON r.user_id = u.id;

-- See ingredients for a specific recipe
SELECT
    r.title as recipe_title,
    i.name,
    i.quantity,
    i.unit,
    i.notes
FROM
    recipes r
    JOIN ingredients i ON r.id = i.recipe_id
WHERE
    r.title = 'Classic Margherita Pizza';

-- See dietary tags for recipes
SELECT
    r.title,
    dt.name as dietary_tag
FROM
    recipes r
    JOIN recipe_dietary_tags rdt ON r.id = rdt.recipe_id
    JOIN dietary_tags dt ON rdt.tag_id = dt.id;