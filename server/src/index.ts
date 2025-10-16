import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Import routes
import authRoutes from './routes/auth';
import recipeRoutes from './routes/recipes';
import dietaryTagsRoutes from './routes/dietaryTags';

// Import database connection
import { testConnection } from './config/database';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Recipe Tracker API',
            version: '1.0.0',
            description: 'A comprehensive API for managing recipes, ingredients, and dietary preferences',
            contact: {
                name: 'Recipe Tracker Team',
            },
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'User ID',
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'User email address',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'User creation timestamp',
                        },
                    },
                },
                Recipe: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Recipe ID',
                        },
                        title: {
                            type: 'string',
                            description: 'Recipe title',
                        },
                        description: {
                            type: 'string',
                            description: 'Recipe description',
                        },
                        prepTime: {
                            type: 'integer',
                            minimum: 0,
                            description: 'Preparation time in minutes',
                        },
                        cookTime: {
                            type: 'integer',
                            minimum: 0,
                            description: 'Cooking time in minutes',
                        },
                        servings: {
                            type: 'integer',
                            minimum: 1,
                            description: 'Number of servings',
                        },
                        difficulty: {
                            type: 'string',
                            enum: ['Easy', 'Medium', 'Hard'],
                            description: 'Recipe difficulty level',
                        },
                        imageUrl: {
                            type: 'string',
                            format: 'uri',
                            description: 'Recipe image URL',
                        },
                        isFavorite: {
                            type: 'boolean',
                            description: 'Whether recipe is marked as favorite',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Recipe creation timestamp',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Recipe last update timestamp',
                        },
                        ingredients: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/Ingredient',
                            },
                        },
                        instructions: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/Instruction',
                            },
                        },
                        dietaryTags: {
                            type: 'array',
                            items: {
                                type: 'string',
                            },
                            description: 'Dietary tags (e.g., vegetarian, gluten-free)',
                        },
                        nutrition: {
                            $ref: '#/components/schemas/Nutrition',
                        },
                        affiliateLinks: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/AffiliateLink',
                            },
                        },
                    },
                },
                Ingredient: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                        },
                        name: {
                            type: 'string',
                            description: 'Ingredient name',
                        },
                        quantity: {
                            type: 'string',
                            description: 'Ingredient quantity',
                        },
                        unit: {
                            type: 'string',
                            description: 'Ingredient unit',
                        },
                        notes: {
                            type: 'string',
                            description: 'Additional notes for the ingredient',
                        },
                    },
                },
                Instruction: {
                    type: 'object',
                    properties: {
                        step_number: {
                            type: 'integer',
                            description: 'Step number',
                        },
                        content: {
                            type: 'string',
                            description: 'Instruction content',
                        },
                    },
                },
                Nutrition: {
                    type: 'object',
                    properties: {
                        calories: {
                            type: 'number',
                            description: 'Calories per serving',
                        },
                        protein: {
                            type: 'number',
                            description: 'Protein in grams',
                        },
                        carbs: {
                            type: 'number',
                            description: 'Carbohydrates in grams',
                        },
                        fat: {
                            type: 'number',
                            description: 'Fat in grams',
                        },
                        sugar: {
                            type: 'number',
                            description: 'Sugar in grams',
                        },
                        fiber: {
                            type: 'number',
                            description: 'Fiber in grams',
                        },
                        sodium: {
                            type: 'number',
                            description: 'Sodium in milligrams',
                        },
                    },
                },
                AffiliateLink: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                        },
                        title: {
                            type: 'string',
                            description: 'Link title',
                        },
                        url: {
                            type: 'string',
                            format: 'uri',
                            description: 'Affiliate link URL',
                        },
                        description: {
                            type: 'string',
                            description: 'Link description',
                        },
                    },
                },
                DietaryTag: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                        },
                        name: {
                            type: 'string',
                            description: 'Dietary tag name',
                        },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        error: {
                            type: 'string',
                            description: 'Error message',
                        },
                        details: {
                            type: 'array',
                            items: {
                                type: 'object',
                            },
                            description: 'Additional error details',
                        },
                    },
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.ts'], // Path to the API files
};

const specs = swaggerJsdoc(swaggerOptions);

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

// CORS configuration
const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Recipe Tracker API Documentation'
}));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/dietary-tags', dietaryTagsRoutes);

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Global error handler:', err);

    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'Invalid JSON in request body' });
    }

    res.status(500).json({
        error: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { details: err.message })
    });
});

// Start server
const startServer = async () => {
    try {
        // Test database connection
        const dbConnected = await testConnection();
        if (!dbConnected) {
            console.error('Failed to connect to database. Exiting...');
            process.exit(1);
        }

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📊 Health check: http://localhost:${PORT}/health`);
            console.log(`🔗 API base URL: http://localhost:${PORT}/api`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...');
    process.exit(0);
});

startServer();
