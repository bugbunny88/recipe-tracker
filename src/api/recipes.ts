import { Recipe } from '../utils/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

// Helper function to handle API responses
const handleApiResponse = async (response: Response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
    }
    return response.json();
};

export async function fetchRecipes() {
    const response = await fetch(`${API_BASE_URL}/recipes`, {
        headers: getAuthHeaders(),
    });

    const data = await handleApiResponse(response);
    return data.recipes || [];
}

export async function fetchRecipeById(id: string) {
    const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
        headers: getAuthHeaders(),
    });

    const data = await handleApiResponse(response);
    return data.recipe;
}

export async function createRecipe(recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) {
    const response = await fetch(`${API_BASE_URL}/recipes`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(recipe),
    });

    const data = await handleApiResponse(response);
    return data.recipe;
}

export async function updateRecipe(id: string, recipe: Partial<Recipe>) {
    const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(recipe),
    });

    const data = await handleApiResponse(response);
    return data.recipe;
}

export async function deleteRecipe(id: string) {
    const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });

    await handleApiResponse(response);
}

export async function toggleFavorite(id: string) {
    const response = await fetch(`${API_BASE_URL}/recipes/${id}/favorite`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
    });

    const data = await handleApiResponse(response);
    return data;
} 