const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/projects/find-song-by-singing";

export const postAudio = async (blob) => {
    const formData = new FormData();
    formData.append("file", blob, "hum.wav");

    try {
        const response = await fetch(`${API_BASE_URL}/`, {
            method: "POST",
            body: formData,
        });
        const data = await response.json();
        return data.prediction;
    } catch (e) {
        console.error("API error", e);
        return "Error";
    }
};