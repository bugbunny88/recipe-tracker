import { Router, Request, Response } from 'express';
import { body, validationResult, param } from 'express-validator';
import { query } from '../config/database';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Validation rules
const recipeValidation = [
  body('title').notEmpty().trim().withMessage('Title is required'),
  body('description').notEmpty().trim().withMessage('Description is required'),
  body('prepTime').isInt({ min: 0 }).withMessage('Prep time must be a non-negative integer'),
  body('cookTime').isInt({ min: 0 }).withMessage('Cook time must be a non-negative integer'),
  body('servings').isInt({ min: 1 }).withMessage('Servings must be a positive integer'),
  body('difficulty').isIn(['Easy', 'Medium', 'Hard']).withMessage('Difficulty must be Easy, Medium, or Hard'),
  body('imageUrl').isURL().withMessage('Image URL must be a valid URL'),
  body('ingredients').isArray({ min: 1 }).withMessage('At least one ingredient is required'),
  body('instructions').isArray({ min: 1 }).withMessage('At least one instruction is required'),
  body('nutrition').isObject().withMessage('Nutrition information is required'),
];

// Transform recipe data from database format to API format
const transformRecipe = (recipe: any) => {
  return {
    id: recipe.id,
    title: recipe.title,
    description: recipe.description,
    prepTime: recipe.prep_time,
    cookTime: recipe.cook_time,
    servings: recipe.servings,
    difficulty: recipe.difficulty,
    imageUrl: recipe.image_url,
    createdAt: recipe.created_at,
    updatedAt: recipe.updated_at,
    isFavorite: recipe.is_favorite,
    ingredients: recipe.ingredients || [],
    instructions: recipe.instructions || [],
    dietaryTags: recipe.dietary_tags || [],
    nutrition: recipe.nutrition || {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    },
    affiliateLinks: recipe.affiliate_links || []
  };
};

/**
 * @swagger
 * /api/recipes:
 *   get:
 *     summary: Get all recipes for the authenticated user
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recipes retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recipes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Recipe'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await query(`
      SELECT 
        r.*,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', i.id,
              'name', i.name,
              'quantity', i.quantity,
              'unit', i.unit,
              'notes', i.notes
            )
          ) FILTER (WHERE i.id IS NOT NULL),
          '[]'::json
        ) as ingredients,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'step_number', ins.step_number,
              'content', ins.content
            ) ORDER BY ins.step_number
          ) FILTER (WHERE ins.id IS NOT NULL),
          '[]'::json
        ) as instructions,
        COALESCE(
          json_agg(
            DISTINCT dt.name
          ) FILTER (WHERE dt.name IS NOT NULL),
          '[]'::json
        ) as dietary_tags,
        COALESCE(
          jsonb_build_object(
            'calories', n.calories,
            'protein', n.protein,
            'carbs', n.carbs,
            'fat', n.fat,
            'sugar', n.sugar,
            'fiber', n.fiber,
            'sodium', n.sodium
          ),
          '{}'::jsonb
        ) as nutrition,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', al.id,
              'title', al.title,
              'url', al.url,
              'description', al.description
            )
          ) FILTER (WHERE al.id IS NOT NULL),
          '[]'::json
        ) as affiliate_links
      FROM recipes r
      LEFT JOIN ingredients i ON r.id = i.recipe_id
      LEFT JOIN instructions ins ON r.id = ins.recipe_id
      LEFT JOIN recipe_dietary_tags rdt ON r.id = rdt.recipe_id
      LEFT JOIN dietary_tags dt ON rdt.tag_id = dt.id
      LEFT JOIN nutrition n ON r.id = n.recipe_id
      LEFT JOIN affiliate_links al ON r.id = al.recipe_id
      WHERE r.user_id = $1
      GROUP BY r.id, n.calories, n.protein, n.carbs, n.fat, n.sugar, n.fiber, n.sodium
      ORDER BY r.created_at DESC
    `, [req.user!.id]);

    const recipes = result.rows.map(transformRecipe);
    res.json({ recipes });
  } catch (error) {
    console.error('Get recipes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/recipes/{id}:
 *   get:
 *     summary: Get a single recipe by ID
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Recipe ID
 *     responses:
 *       200:
 *         description: Recipe retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recipe:
 *                   $ref: '#/components/schemas/Recipe'
 *       400:
 *         description: Invalid recipe ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Recipe not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', param('id').isUUID().withMessage('Invalid recipe ID'), async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
      return;
    }

    const { id } = req.params;

    const result = await query(`
      SELECT 
        r.*,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', i.id,
              'name', i.name,
              'quantity', i.quantity,
              'unit', i.unit,
              'notes', i.notes
            )
          ) FILTER (WHERE i.id IS NOT NULL),
          '[]'::json
        ) as ingredients,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'step_number', ins.step_number,
              'content', ins.content
            ) ORDER BY ins.step_number
          ) FILTER (WHERE ins.id IS NOT NULL),
          '[]'::json
        ) as instructions,
        COALESCE(
          json_agg(
            DISTINCT dt.name
          ) FILTER (WHERE dt.name IS NOT NULL),
          '[]'::json
        ) as dietary_tags,
        COALESCE(
          jsonb_build_object(
            'calories', n.calories,
            'protein', n.protein,
            'carbs', n.carbs,
            'fat', n.fat,
            'sugar', n.sugar,
            'fiber', n.fiber,
            'sodium', n.sodium
          ),
          '{}'::jsonb
        ) as nutrition,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', al.id,
              'title', al.title,
              'url', al.url,
              'description', al.description
            )
          ) FILTER (WHERE al.id IS NOT NULL),
          '[]'::json
        ) as affiliate_links
      FROM recipes r
      LEFT JOIN ingredients i ON r.id = i.recipe_id
      LEFT JOIN instructions ins ON r.id = ins.recipe_id
      LEFT JOIN recipe_dietary_tags rdt ON r.id = rdt.recipe_id
      LEFT JOIN dietary_tags dt ON rdt.tag_id = dt.id
      LEFT JOIN nutrition n ON r.id = n.recipe_id
      LEFT JOIN affiliate_links al ON r.id = al.recipe_id
      WHERE r.id = $1
      GROUP BY r.id, n.calories, n.protein, n.carbs, n.fat, n.sugar, n.fiber, n.sodium
    `, [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Recipe not found' });
      return;
    }

    const recipe = transformRecipe(result.rows[0]);
    res.json({ recipe });
  } catch (error) {
    console.error('Get recipe error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/recipes:
 *   post:
 *     summary: Create a new recipe
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - prepTime
 *               - cookTime
 *               - servings
 *               - difficulty
 *               - imageUrl
 *               - ingredients
 *               - instructions
 *               - nutrition
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Chocolate Chip Cookies"
 *               description:
 *                 type: string
 *                 example: "Delicious homemade chocolate chip cookies"
 *               prepTime:
 *                 type: integer
 *                 minimum: 0
 *                 example: 15
 *               cookTime:
 *                 type: integer
 *                 minimum: 0
 *                 example: 12
 *               servings:
 *                 type: integer
 *                 minimum: 1
 *                 example: 24
 *               difficulty:
 *                 type: string
 *                 enum: [Easy, Medium, Hard]
 *                 example: "Easy"
 *               imageUrl:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/cookie-image.jpg"
 *               isFavorite:
 *                 type: boolean
 *                 example: false
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "All-purpose flour"
 *                     quantity:
 *                       type: string
 *                       example: "2"
 *                     unit:
 *                       type: string
 *                       example: "cups"
 *                     notes:
 *                       type: string
 *                       example: "sifted"
 *               instructions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Preheat oven to 375°F", "Mix dry ingredients", "Add wet ingredients"]
 *               dietaryTags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["vegetarian", "dairy-free"]
 *               nutrition:
 *                 type: object
 *                 properties:
 *                   calories:
 *                     type: number
 *                     example: 150
 *                   protein:
 *                     type: number
 *                     example: 2
 *                   carbs:
 *                     type: number
 *                     example: 20
 *                   fat:
 *                     type: number
 *                     example: 7
 *               affiliateLinks:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: "Cookie Sheet"
 *                     url:
 *                       type: string
 *                       format: uri
 *                       example: "https://amazon.com/cookie-sheet"
 *                     description:
 *                       type: string
 *                       example: "Perfect for baking cookies"
 *     responses:
 *       201:
 *         description: Recipe created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recipe:
 *                   $ref: '#/components/schemas/Recipe'
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', authenticateToken, recipeValidation, async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
      return;
    }

    const {
      title,
      description,
      prepTime,
      cookTime,
      servings,
      difficulty,
      imageUrl,
      ingredients,
      instructions,
      dietaryTags,
      nutrition,
      affiliateLinks,
      isFavorite = false
    } = req.body;

    // Start transaction
    const client = await query('BEGIN');

    try {
      // Create recipe
      const recipeResult = await query(`
        INSERT INTO recipes (title, description, prep_time, cook_time, servings, difficulty, image_url, user_id, is_favorite)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id, created_at, updated_at
      `, [title, description, prepTime, cookTime, servings, difficulty, imageUrl, req.user!.id, isFavorite]);

      const recipeId = recipeResult.rows[0].id;

      // Insert ingredients
      if (ingredients && ingredients.length > 0) {
        for (const ingredient of ingredients) {
          await query(`
            INSERT INTO ingredients (recipe_id, name, quantity, unit, notes)
            VALUES ($1, $2, $3, $4, $5)
          `, [recipeId, ingredient.name, ingredient.quantity, ingredient.unit, ingredient.notes || null]);
        }
      }

      // Insert instructions
      if (instructions && instructions.length > 0) {
        for (let i = 0; i < instructions.length; i++) {
          await query(`
            INSERT INTO instructions (recipe_id, step_number, content)
            VALUES ($1, $2, $3)
          `, [recipeId, i + 1, instructions[i]]);
        }
      }

      // Insert nutrition
      if (nutrition) {
        await query(`
          INSERT INTO nutrition (recipe_id, calories, protein, carbs, fat, sugar, fiber, sodium)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [
          recipeId,
          nutrition.calories || 0,
          nutrition.protein || 0,
          nutrition.carbs || 0,
          nutrition.fat || 0,
          nutrition.sugar || null,
          nutrition.fiber || null,
          nutrition.sodium || null
        ]);
      }

      // Insert dietary tags
      if (dietaryTags && dietaryTags.length > 0) {
        for (const tagName of dietaryTags) {
          // Ensure tag exists
          await query(`
            INSERT INTO dietary_tags (name) VALUES ($1)
            ON CONFLICT (name) DO NOTHING
          `, [tagName]);

          // Get tag ID and create relationship
          const tagResult = await query('SELECT id FROM dietary_tags WHERE name = $1', [tagName]);
          if (tagResult.rows.length > 0) {
            await query(`
              INSERT INTO recipe_dietary_tags (recipe_id, tag_id)
              VALUES ($1, $2)
              ON CONFLICT DO NOTHING
            `, [recipeId, tagResult.rows[0].id]);
          }
        }
      }

      // Insert affiliate links
      if (affiliateLinks && affiliateLinks.length > 0) {
        for (const link of affiliateLinks) {
          await query(`
            INSERT INTO affiliate_links (recipe_id, title, url, description)
            VALUES ($1, $2, $3, $4)
          `, [recipeId, link.title, link.url, link.description || null]);
        }
      }

      await query('COMMIT');

      // Fetch the complete recipe
      const completeRecipeResult = await query(`
        SELECT 
          r.*,
          COALESCE(
            json_agg(
              DISTINCT jsonb_build_object(
                'id', i.id,
                'name', i.name,
                'quantity', i.quantity,
                'unit', i.unit,
                'notes', i.notes
              )
            ) FILTER (WHERE i.id IS NOT NULL),
            '[]'::json
          ) as ingredients,
          COALESCE(
            json_agg(
              DISTINCT jsonb_build_object(
                'step_number', ins.step_number,
                'content', ins.content
              ) ORDER BY ins.step_number
            ) FILTER (WHERE ins.id IS NOT NULL),
            '[]'::json
          ) as instructions,
          COALESCE(
            json_agg(
              DISTINCT dt.name
            ) FILTER (WHERE dt.name IS NOT NULL),
            '[]'::json
          ) as dietary_tags,
          COALESCE(
            jsonb_build_object(
              'calories', n.calories,
              'protein', n.protein,
              'carbs', n.carbs,
              'fat', n.fat,
              'sugar', n.sugar,
              'fiber', n.fiber,
              'sodium', n.sodium
            ),
            '{}'::jsonb
          ) as nutrition,
          COALESCE(
            json_agg(
              DISTINCT jsonb_build_object(
                'id', al.id,
                'title', al.title,
                'url', al.url,
                'description', al.description
              )
            ) FILTER (WHERE al.id IS NOT NULL),
            '[]'::json
          ) as affiliate_links
        FROM recipes r
        LEFT JOIN ingredients i ON r.id = i.recipe_id
        LEFT JOIN instructions ins ON r.id = ins.recipe_id
        LEFT JOIN recipe_dietary_tags rdt ON r.id = rdt.recipe_id
        LEFT JOIN dietary_tags dt ON rdt.tag_id = dt.id
        LEFT JOIN nutrition n ON r.id = n.recipe_id
        LEFT JOIN affiliate_links al ON r.id = al.recipe_id
        WHERE r.id = $1
        GROUP BY r.id, n.calories, n.protein, n.carbs, n.fat, n.sugar, n.fiber, n.sodium
      `, [recipeId]);

      const recipe = transformRecipe(completeRecipeResult.rows[0]);
      res.status(201).json({ recipe });
    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Create recipe error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/recipes/{id}:
 *   put:
 *     summary: Update a recipe
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Recipe ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Recipe'
 *     responses:
 *       200:
 *         description: Recipe updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recipe:
 *                   $ref: '#/components/schemas/Recipe'
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Recipe not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', authenticateToken, param('id').isUUID().withMessage('Invalid recipe ID'), async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
      return;
    }

    const { id } = req.params;
    const updateData = req.body;

    // Check if recipe exists and belongs to user
    const existingRecipe = await query(
      'SELECT id FROM recipes WHERE id = $1 AND user_id = $2',
      [id, req.user!.id]
    );

    if (existingRecipe.rows.length === 0) {
      res.status(404).json({ error: 'Recipe not found' });
      return;
    }

    // Start transaction
    await query('BEGIN');

    try {
      // Update basic recipe fields
      if (updateData.title || updateData.description || updateData.prepTime !== undefined ||
        updateData.cookTime !== undefined || updateData.servings !== undefined ||
        updateData.difficulty || updateData.imageUrl || updateData.isFavorite !== undefined) {

        const updateFields = [];
        const updateValues = [];
        let paramCount = 1;

        if (updateData.title) {
          updateFields.push(`title = $${paramCount++}`);
          updateValues.push(updateData.title);
        }
        if (updateData.description) {
          updateFields.push(`description = $${paramCount++}`);
          updateValues.push(updateData.description);
        }
        if (updateData.prepTime !== undefined) {
          updateFields.push(`prep_time = $${paramCount++}`);
          updateValues.push(updateData.prepTime);
        }
        if (updateData.cookTime !== undefined) {
          updateFields.push(`cook_time = $${paramCount++}`);
          updateValues.push(updateData.cookTime);
        }
        if (updateData.servings !== undefined) {
          updateFields.push(`servings = $${paramCount++}`);
          updateValues.push(updateData.servings);
        }
        if (updateData.difficulty) {
          updateFields.push(`difficulty = $${paramCount++}`);
          updateValues.push(updateData.difficulty);
        }
        if (updateData.imageUrl) {
          updateFields.push(`image_url = $${paramCount++}`);
          updateValues.push(updateData.imageUrl);
        }
        if (updateData.isFavorite !== undefined) {
          updateFields.push(`is_favorite = $${paramCount++}`);
          updateValues.push(updateData.isFavorite);
        }

        updateFields.push(`updated_at = NOW()`);
        updateValues.push(id);

        await query(`
          UPDATE recipes 
          SET ${updateFields.join(', ')}
          WHERE id = $${paramCount}
        `, [...updateValues]);
      }

      // Update ingredients (delete and re-insert)
      if (updateData.ingredients) {
        await query('DELETE FROM ingredients WHERE recipe_id = $1', [id]);

        if (updateData.ingredients.length > 0) {
          for (const ingredient of updateData.ingredients) {
            await query(`
              INSERT INTO ingredients (recipe_id, name, quantity, unit, notes)
              VALUES ($1, $2, $3, $4, $5)
            `, [id, ingredient.name, ingredient.quantity, ingredient.unit, ingredient.notes || null]);
          }
        }
      }

      // Update instructions (delete and re-insert)
      if (updateData.instructions) {
        await query('DELETE FROM instructions WHERE recipe_id = $1', [id]);

        if (updateData.instructions.length > 0) {
          for (let i = 0; i < updateData.instructions.length; i++) {
            await query(`
              INSERT INTO instructions (recipe_id, step_number, content)
              VALUES ($1, $2, $3)
            `, [id, i + 1, updateData.instructions[i]]);
          }
        }
      }

      // Update nutrition
      if (updateData.nutrition) {
        await query(`
          INSERT INTO nutrition (recipe_id, calories, protein, carbs, fat, sugar, fiber, sodium)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (recipe_id) DO UPDATE SET
            calories = EXCLUDED.calories,
            protein = EXCLUDED.protein,
            carbs = EXCLUDED.carbs,
            fat = EXCLUDED.fat,
            sugar = EXCLUDED.sugar,
            fiber = EXCLUDED.fiber,
            sodium = EXCLUDED.sodium
        `, [
          id,
          updateData.nutrition.calories || 0,
          updateData.nutrition.protein || 0,
          updateData.nutrition.carbs || 0,
          updateData.nutrition.fat || 0,
          updateData.nutrition.sugar || null,
          updateData.nutrition.fiber || null,
          updateData.nutrition.sodium || null
        ]);
      }

      // Update dietary tags (delete and re-insert)
      if (updateData.dietaryTags) {
        await query('DELETE FROM recipe_dietary_tags WHERE recipe_id = $1', [id]);

        if (updateData.dietaryTags.length > 0) {
          for (const tagName of updateData.dietaryTags) {
            // Ensure tag exists
            await query(`
              INSERT INTO dietary_tags (name) VALUES ($1)
              ON CONFLICT (name) DO NOTHING
            `, [tagName]);

            // Get tag ID and create relationship
            const tagResult = await query('SELECT id FROM dietary_tags WHERE name = $1', [tagName]);
            if (tagResult.rows.length > 0) {
              await query(`
                INSERT INTO recipe_dietary_tags (recipe_id, tag_id)
                VALUES ($1, $2)
                ON CONFLICT DO NOTHING
              `, [id, tagResult.rows[0].id]);
            }
          }
        }
      }

      // Update affiliate links (delete and re-insert)
      if (updateData.affiliateLinks) {
        await query('DELETE FROM affiliate_links WHERE recipe_id = $1', [id]);

        if (updateData.affiliateLinks.length > 0) {
          for (const link of updateData.affiliateLinks) {
            await query(`
              INSERT INTO affiliate_links (recipe_id, title, url, description)
              VALUES ($1, $2, $3, $4)
            `, [id, link.title, link.url, link.description || null]);
          }
        }
      }

      await query('COMMIT');

      // Fetch the updated recipe
      const updatedRecipeResult = await query(`
        SELECT 
          r.*,
          COALESCE(
            json_agg(
              DISTINCT jsonb_build_object(
                'id', i.id,
                'name', i.name,
                'quantity', i.quantity,
                'unit', i.unit,
                'notes', i.notes
              )
            ) FILTER (WHERE i.id IS NOT NULL),
            '[]'::json
          ) as ingredients,
          COALESCE(
            json_agg(
              DISTINCT jsonb_build_object(
                'step_number', ins.step_number,
                'content', ins.content
              ) ORDER BY ins.step_number
            ) FILTER (WHERE ins.id IS NOT NULL),
            '[]'::json
          ) as instructions,
          COALESCE(
            json_agg(
              DISTINCT dt.name
            ) FILTER (WHERE dt.name IS NOT NULL),
            '[]'::json
          ) as dietary_tags,
          COALESCE(
            jsonb_build_object(
              'calories', n.calories,
              'protein', n.protein,
              'carbs', n.carbs,
              'fat', n.fat,
              'sugar', n.sugar,
              'fiber', n.fiber,
              'sodium', n.sodium
            ),
            '{}'::jsonb
          ) as nutrition,
          COALESCE(
            json_agg(
              DISTINCT jsonb_build_object(
                'id', al.id,
                'title', al.title,
                'url', al.url,
                'description', al.description
              )
            ) FILTER (WHERE al.id IS NOT NULL),
            '[]'::json
          ) as affiliate_links
        FROM recipes r
        LEFT JOIN ingredients i ON r.id = i.recipe_id
        LEFT JOIN instructions ins ON r.id = ins.recipe_id
        LEFT JOIN recipe_dietary_tags rdt ON r.id = rdt.recipe_id
        LEFT JOIN dietary_tags dt ON rdt.tag_id = dt.id
        LEFT JOIN nutrition n ON r.id = n.recipe_id
        LEFT JOIN affiliate_links al ON r.id = al.recipe_id
        WHERE r.id = $1
        GROUP BY r.id, n.calories, n.protein, n.carbs, n.fat, n.sugar, n.fiber, n.sodium
      `, [id]);

      const recipe = transformRecipe(updatedRecipeResult.rows[0]);
      res.json({ recipe });
    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Update recipe error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/recipes/{id}:
 *   delete:
 *     summary: Delete a recipe
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Recipe ID
 *     responses:
 *       200:
 *         description: Recipe deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Recipe deleted successfully
 *       400:
 *         description: Invalid recipe ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Recipe not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', authenticateToken, param('id').isUUID().withMessage('Invalid recipe ID'), async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
      return;
    }

    const { id } = req.params;

    const result = await query(
      'DELETE FROM recipes WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user!.id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Recipe not found' });
      return;
    }

    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Delete recipe error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/recipes/{id}/favorite:
 *   patch:
 *     summary: Toggle favorite status of a recipe
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Recipe ID
 *     responses:
 *       200:
 *         description: Favorite status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Favorite status updated
 *                 isFavorite:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid recipe ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Recipe not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch('/:id/favorite', authenticateToken, param('id').isUUID().withMessage('Invalid recipe ID'), async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
      return;
    }

    const { id } = req.params;

    const result = await query(`
      UPDATE recipes 
      SET is_favorite = NOT is_favorite, updated_at = NOW()
      WHERE id = $1 AND user_id = $2
      RETURNING is_favorite
    `, [id, req.user!.id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Recipe not found' });
      return;
    }

    res.json({
      message: 'Favorite status updated',
      isFavorite: result.rows[0].is_favorite
    });
  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
