/**
 * api.ts
 * Reusable utility for HTTP API communication with the FastAPI backend.
 */

// Centralized backend URL using Vite's environment variable loading.
// Fallback to empty string for relative paths if not defined.
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

/**
 * Sends a request to the FastAPI backend model endpoint.
 * 
 * @param endpoint - The API endpoint route (e.g., "/api/projects/deepfake-detection/api/check-image").
 * @param fileOrData - FormData object containing the file or payload to process.
 * @returns The JSON response from the backend.
 */
export async function predictWithModel(endpoint: string, fileOrData: FormData | any): Promise<any> {
    const url = `${BACKEND_URL}${endpoint}`;

    try {
        const isFormData = fileOrData instanceof FormData;

        const requestOptions: RequestInit = {
            method: "POST",
            // If passing FormData, the browser will automatically set the Content-Type
            // and boundaries correctly when we omit the Content-Type header.
            body: isFormData ? fileOrData : JSON.stringify(fileOrData),
        };

        if (!isFormData) {
            requestOptions.headers = {
                "Content-Type": "application/json",
            };
        }

        const response = await fetch(url, requestOptions);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Request Failed: ${response.status} ${response.statusText} - ${errorText}`);
        }

        return await response.json();

    } catch (error) {
        console.error(`[API Error] accessing ${endpoint}:`, error);
        throw error;
    }
}
