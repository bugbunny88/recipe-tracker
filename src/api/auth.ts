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

export async function signUp(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await handleApiResponse(response);

    // Store token in localStorage
    if (data.token) {
        localStorage.setItem('authToken', data.token);
    }

    return data;
}

export async function signIn(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await handleApiResponse(response);

    // Store token in localStorage
    if (data.token) {
        localStorage.setItem('authToken', data.token);
    }

    return data;
}

export async function signOut() {
    try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            headers: getAuthHeaders(),
        });
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        // Always remove token from localStorage
        localStorage.removeItem('authToken');
    }
}

export async function getSession() {
    const token = localStorage.getItem('authToken');
    if (!token) return null;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: getAuthHeaders(),
        });

        const data = await handleApiResponse(response);
        return {
            user: data.user,
            access_token: token
        };
    } catch (error) {
        // Token is invalid, remove it
        localStorage.removeItem('authToken');
        return null;
    }
}

export async function getUser() {
    const session = await getSession();
    return session?.user || null;
} 