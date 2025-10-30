# Recipe Tracker

A full-stack recipe management application built with React, Express.js, and PostgreSQL. Create, organize, and manage your favorite recipes with a beautiful, responsive interface.

## Features

- 🔐 **User Authentication** - JWT-based authentication with secure password hashing
- 📝 **Recipe Management** - Create, edit, delete, and organize recipes
- ⭐ **Favorites System** - Mark recipes as favorites for quick access
- 🏷️ **Dietary Tags** - Categorize recipes with dietary restrictions (Vegetarian, Vegan, Gluten-Free, etc.)
- 📊 **Nutrition Information** - Track calories, protein, carbs, fat, and more
- 🔗 **Affiliate Links** - Add product recommendations to recipes
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🌙 **Dark/Light Theme** - Toggle between themes for comfortable viewing

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide React** for icons

### Backend
- **Express.js** with TypeScript
- **PostgreSQL** database
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation
- **CORS** and **Helmet** for security

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **PostgreSQL** (v13 or higher)
- **npm** or **yarn**

## PostgreSQL Setup

### Installation

#### macOS (using Homebrew)
```bash
# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Verify installation
psql --version
```

#### Ubuntu/Debian
```bash
# Update package list
sudo apt update

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify installation
psql --version
```

#### Windows
1. Download PostgreSQL from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run the installer and follow the setup wizard
3. Remember the password you set for the `postgres` user

### Database Setup

1. **Create the database:**
```bash
# Connect to PostgreSQL as superuser
psql -U postgres

# Create database
CREATE DATABASE recipe_tracker_dev;

# Create a user (optional, you can use postgres user)
CREATE USER recipe_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE recipe_tracker_dev TO recipe_user;

# Exit psql
\q
```

2. **Run the schema:**
```bash
# Apply the database schema
psql -U postgres -d recipe_tracker_dev < database/schema.sql
```

3. **Add sample data (optional):**
```bash
# Add sample recipes for testing
psql -U postgres -d recipe_tracker_dev < database/seed.sql
```

## Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd recipe-tracker
```

2. **Install dependencies:**
```bash
# Install all dependencies (frontend and backend)
npm run install:all

# Or install separately:
npm install                    # Frontend dependencies
cd server && npm install       # Backend dependencies
```

3. **Environment Setup:**

Create environment files:

**Frontend (.env):**
```bash
cp .env.example .env
```

**Backend (server/.env):**
```bash
cd server
cp env.example .env
```

Edit the backend `.env` file with your database credentials:
```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/recipe_tracker_dev
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

## Development

### Running the Application

Start both frontend and backend in development mode:

```bash
npm run dev
```

This will:
- Start the Express API server on `http://localhost:3001`
- Start the Vite dev server on `http://localhost:5173`
- Automatically proxy API requests from frontend to backend

### Individual Services

You can also run services individually:

```bash
# Frontend only
npm run dev:client

# Backend only
npm run dev:server
```

### API Endpoints

The API server provides the following endpoints:

#### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login and receive JWT token
- `GET /api/auth/me` - Get current user info (requires JWT)
- `POST /api/auth/logout` - Logout (client-side token removal)

#### Recipes
- `GET /api/recipes` - Get all recipes for current user
- `GET /api/recipes/:id` - Get single recipe by ID
- `POST /api/recipes` - Create new recipe
- `PUT /api/recipes/:id` - Update recipe
- `DELETE /api/recipes/:id` - Delete recipe
- `PATCH /api/recipes/:id/favorite` - Toggle favorite status

#### Dietary Tags
- `GET /api/dietary-tags` - Get all available dietary tags

## Production Deployment

### Building for Production

```bash
# Build both frontend and backend
npm run build

# Or build separately:
npm run build:client    # Frontend build
npm run build:server   # Backend build
```

### Running in Production

```bash
# Start the production server
npm start
```

### Environment Variables for Production

Make sure to set these environment variables in production:

**Backend (.env):**
```env
DATABASE_URL=postgresql://username:password@host:port/database_name
JWT_SECRET=your-production-jwt-secret-key
JWT_EXPIRES_IN=7d
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com
```

## Project Structure

```
recipe-tracker/
├── server/                 # Express.js backend
│   ├── src/
│   │   ├── config/        # Database configuration
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/        # API route handlers
│   │   └── index.ts       # Server entry point
│   ├── package.json
│   └── tsconfig.json
├── src/                   # React frontend
│   ├── api/              # API client functions
│   ├── components/       # React components
│   ├── contexts/         # React contexts
│   ├── pages/           # Page components
│   ├── utils/           # Utility functions and types
│   └── main.tsx         # Frontend entry point
├── database/            # Database schema and seeds
│   ├── schema.sql       # Database schema
│   └── seed.sql         # Sample data
├── package.json         # Root package.json with scripts
└── README.md
```

## Database Schema

The application uses the following main tables:

- **users** - User accounts and authentication
- **recipes** - Recipe metadata
- **ingredients** - Recipe ingredients
- **instructions** - Step-by-step cooking instructions
- **dietary_tags** - Available dietary tags
- **recipe_dietary_tags** - Many-to-many relationship between recipes and tags
- **nutrition** - Nutritional information per recipe
- **affiliate_links** - Product recommendations

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Troubleshooting

### Common Issues

**Database Connection Error:**
- Ensure PostgreSQL is running: `pg_isready`
- Check your `DATABASE_URL` in the backend `.env` file
- Verify the database exists: `psql -U postgres -l`

**Port Already in Use:**
- Change the `PORT` in the backend `.env` file
- Kill existing processes: `lsof -ti:3001 | xargs kill -9`

**CORS Errors:**
- Ensure `CORS_ORIGIN` in backend `.env` matches your frontend URL
- Check that the Vite proxy is configured correctly

**JWT Token Issues:**
- Clear localStorage: `localStorage.clear()`
- Check that `JWT_SECRET` is set in backend `.env`
- Verify token expiration settings

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with modern web technologies for optimal performance and developer experience
- Designed with accessibility and user experience in mind
- Follows security best practices for authentication and data handling
