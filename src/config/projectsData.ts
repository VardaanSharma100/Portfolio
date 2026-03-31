export interface PortfolioProject {
    slug: string;
    title: string;
    description: string;
    overview: string;
    highlights: string[];
    techStack: string[];
    imageUrl: string;
    githubUrl: string;
    liveUrl?: string;
    embeddedAppPath: string;
    workspacePath: string;
    frontendPath?: string;
    backendPath?: string;
}

export const portfolioProjects: PortfolioProject[] = [
    {
        slug: "deepfake-detection",
        title: "Deepfake Detection",
        description:
            "A multimodal deepfake detection system engineered to identify manipulated content across image, video, audio, and text formats.",
        overview:
            "This project combines multiple ML pipelines in one platform so users can test different media types from a single interface.",
        highlights: [
            "Supports image, video, audio, and text verification workflows.",
            "Includes dedicated preprocessing and pipeline modules for robust inference.",
            "Pairs a Python backend with a lightweight frontend for interactive testing.",
        ],
        techStack: ["Deep Learning", "CNN", "PyTorch", "OpenCV", "Gen AI"],
        imageUrl: "/Deepfake-Detection.png",
        githubUrl: "https://github.com/VardaanSharma100/Deepfake-Detection",
        embeddedAppPath: "/deepfake-detection/running/",
        workspacePath: "frontend/projects/Deepfake-Detection",
        frontendPath: "frontend/projects/Deepfake-Detection",
        backendPath: "backend/projects/Deepfake-Detection",
    },
    {
        slug: "sign-language-translation",
        title: "Sign Language Translation",
        description:
            "A transformer-based translation engine that converts real-time sign language gestures into coherent, structured sentences.",
        overview:
            "A translation-focused ML system designed to improve communication accessibility by mapping gesture sequences to natural language.",
        highlights: [
            "Uses sequence modeling for gesture-to-text translation.",
            "Integrates real-time landmark extraction with model inference.",
            "Designed as a full project scaffold with both backend and frontend folders.",
        ],
        techStack: ["Transformer", "PyTorch", "MediaPipe"],
        imageUrl: "/Sign-Language-Translation.png",
        githubUrl:
            "https://github.com/VardaanSharma100/Sign-Language-Translation",
        embeddedAppPath: "/sign-language-translation/running/",
        workspacePath: "frontend/projects/Sign Language Translation",
        frontendPath: "frontend/projects/Sign Language Translation",
        backendPath: "backend/projects/Sign Language Translation",
    },
    {
        slug: "find-song-by-singing",
        title: "Find Song by Singing",
        description:
            "A Siamese-based neural network architecture that identifies and retrieves songs by converting user humming or singing into vector embeddings.",
        overview:
            "This retrieval system turns hummed audio into embeddings and matches them against indexed tracks for quick song discovery.",
        highlights: [
            "Built around similarity learning with Siamese network techniques.",
            "Covers training, indexing, and inference scripts in one project.",
            "Supports practical use cases such as partial melody and humming queries.",
        ],
        techStack: ["CNN", "LSTM", "Deep Learning", "Librosa", "PyTorch"],
        imageUrl: "/Find-Song-by-Singing.png",
        githubUrl: "https://github.com/VardaanSharma100/Find-song-by-singing",
        embeddedAppPath: "/find-song-by-singing/running/",
        workspacePath: "frontend/projects/Hum to Search",
        frontendPath: "frontend/projects/Hum to Search",
        backendPath: "backend/projects/Hum to Search",
    },
    {
        slug: "cab-demand-forecasting",
        title: "Cab Demand Forecasting",
        description:
            "A dynamic prediction engine that forecasts cab demand and estimates pricing based on geographical location, time matrices, and traffic parameters.",
        overview:
            "A full-stack forecasting solution for mobility analytics, combining feature engineering, model serving, and a frontend prediction dashboard.",
        highlights: [
            "Uses ML models such as XGBoost for demand and pricing signals.",
            "Includes data, logs, and model artifacts for reproducible workflows.",
            "Exposes prediction endpoints through a Python API backend.",
        ],
        techStack: [
            "Machine Learning",
            "XGBoost",
            "Scikit-Learn",
            "Pandas",
            "FastAPI",
        ],
        imageUrl: "/Cab-Demand-Forecasting.png",
        githubUrl: "https://github.com/VardaanSharma100/Cab-Demand-Forecasting",
        embeddedAppPath: "/cab-demand-forecasting/running/",
        workspacePath: "frontend/projects/Cab Demand Forecasting",
        frontendPath: "frontend/projects/Cab Demand Forecasting",
        backendPath: "backend/projects/Cab Demand Forecasting",
    },
    {
        slug: "multilingual-news-detector",
        title: "Multilingual News Detector",
        description:
            "An LLM-powered verification system designed to classify news articles as real or fake across multiple regional Indian languages.",
        overview:
            "A multilingual fact-checking assistant focused on regional language coverage with model-driven fake news detection.",
        highlights: [
            "Targets multiple Indian languages in one detection flow.",
            "Provides clear backend logic for classification and API delivery.",
            "Separated frontend and backend apps for modular deployment.",
        ],
        techStack: ["Gen AI", "FastAPI"],
        imageUrl: "/Multilingual-News-Detector.png",
        githubUrl:
            "https://github.com/VardaanSharma100/News-Detector-in-Indian-Languages",
        embeddedAppPath: "/multilingual-news-detector/running/",
        workspacePath: "frontend/projects/Fake News Detector in Indian Languages",
        frontendPath: "frontend/projects/Fake News Detector in Indian Languages",
        backendPath: "backend/projects/Fake News Detector in Indian Languages",
    },
    {
        slug: "ai-research-assistant",
        title: "AI Research Assistant",
        description:
            "An intelligent conversational agent equipped with memory and context-retention history, optimized specifically for academic research and data synthesis.",
        overview:
            "A research-oriented assistant that blends retrieval and conversational context to streamline literature understanding and synthesis.",
        highlights: [
            "Focuses on research workflows and context-aware interactions.",
            "Includes separate backend and frontend stacks for extensibility.",
            "Designed for long-form, iterative academic query sessions.",
        ],
        techStack: ["Groq AI", "Gen AI", "LangChain"],
        imageUrl: "/AI-Research-Assistant.png",
        githubUrl: "https://github.com/VardaanSharma100/AI-Research-assistant",
        embeddedAppPath: "/ai-research-assistant/running/",
        workspacePath: "frontend/projects/AI-Research-assistant",
        frontendPath: "frontend/projects/AI-Research-assistant",
        backendPath: "backend/projects/AI-Research-assistant",
    },
];

function normalizeSlug(slug: string): string {
    return slug
        .trim()
        .toLowerCase()
        .replace(/[\s_]+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

const projectBySlug = new Map<string, PortfolioProject>();
const projectAliases = new Map<string, string>([
    ["deepfake", "deepfake-detection"],
    ["signlanguage", "sign-language-translation"],
    ["sign-language", "sign-language-translation"],
    ["findsong", "find-song-by-singing"],
    ["songfinder", "find-song-by-singing"],
    ["cabdemand", "cab-demand-forecasting"],
    ["newsdetector", "multilingual-news-detector"],
    ["airesearch", "ai-research-assistant"],
]);

for (const project of portfolioProjects) {
    const normalized = normalizeSlug(project.slug);
    projectBySlug.set(normalized, project);
    projectBySlug.set(normalized.replace(/-/g, ""), project);
}

for (const [alias, canonicalSlug] of projectAliases) {
    const project = projectBySlug.get(canonicalSlug);
    if (!project) continue;
    projectBySlug.set(alias, project);
}

export function getProjectBySlug(
    slug: string
): PortfolioProject | undefined {
    const normalized = normalizeSlug(slug);
    return (
        projectBySlug.get(normalized) ||
        projectBySlug.get(normalized.replace(/-/g, ""))
    );
}