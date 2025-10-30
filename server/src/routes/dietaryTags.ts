import { Router, Request, Response } from 'express';
import { query } from '../config/database';

const router = Router();

/**
 * @swagger
 * /api/dietary-tags:
 *   get:
 *     summary: Get all dietary tags
 *     tags: [Dietary Tags]
 *     responses:
 *       200:
 *         description: Dietary tags retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tags:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/DietaryTag'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await query('SELECT id, name FROM dietary_tags ORDER BY name');
        res.json({ tags: result.rows });
    } catch (error) {
        console.error('Get dietary tags error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
