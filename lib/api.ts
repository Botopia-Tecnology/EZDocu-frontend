
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type FetchOptions = RequestInit & {
    token?: string;
};

export async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { token, ...fetchOptions } = options;
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
    };

    // If we had a token, we'd add it here. For now, handled by session cookies or gateway simple auth.
    // if (token) {
    //   headers['Authorization'] = `Bearer ${token}`;
    // }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...fetchOptions,
        headers,
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorBody}`);
    }

    return response.json() as Promise<T>;
}
