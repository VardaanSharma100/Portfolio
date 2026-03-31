// Types for skills
export interface Skill {
    name: string;
    description?: string;
}

export interface SkillCategory {
    category: string;
    items: Skill[];
}

export const skillsData: SkillCategory[] = [
    {
        category: "Programming Languages",
        items: [
            {
                name: "Python",
                description:
                    "Core language used to build deep learning architectures and data processing pipelines. It powers rapid experimentation, evaluation, and production integration.",
            },
            {
                name: "C",
                description:
                    "Used for low-level, memory-aware programming in performance-sensitive utilities. It strengthens systems understanding behind ML runtimes.",
            },
            {
                name: "C++",
                description:
                    "Applied to optimize latency-critical components and native performance paths. It is valuable for integrating high-speed inference and vision toolchains.",
            },
            {
                name: "SQL",
                description:
                    "Primary query language for transforming and validating structured datasets at scale. It supports analytics, feature extraction, and model-ready data views.",
            },
        ],
    },
    {
        category: "Machine Learning & Deep Learning",
        items: [
            {
                name: "PyTorch",
                description:
                    "Main framework for custom neural network development and flexible training loops. It enables fast research iteration and efficient model experimentation.",
            },
            {
                name: "TensorFlow",
                description:
                    "Used to train and deploy scalable deep learning workflows across hardware backends. It is strong for graph-optimized production inference.",
            },
            {
                name: "XGBoost",
                description:
                    "High-performance gradient boosting framework for tabular prediction tasks. It delivers strong baseline accuracy and robust feature importance insights.",
            },
            {
                name: "Scikit-Learn",
                description:
                    "Go-to toolkit for preprocessing, classical ML models, and rapid benchmarking. It supports end-to-end workflows from feature engineering to evaluation.",
            },
            {
                name: "Pandas",
                description:
                    "Essential library for cleaning, joining, and reshaping complex datasets. It powers dependable feature pipelines before training.",
            },
            {
                name: "NumPy",
                description:
                    "Foundation for vectorized numerical operations and matrix computations. It is used for fast transformations, simulation, and custom metric logic.",
            },
        ],
    },
    {
        category: "Generative AI & Vision",
        items: [
            {
                name: "LangChain",
                description:
                    "Framework for composing LLM chains, tools, and memory-aware agent flows. It helps orchestrate retrieval and reasoning for practical GenAI applications.",
            },
            {
                name: "Hugging Face",
                description:
                    "Model ecosystem used for transformers, tokenizers, and inference pipelines. It accelerates fine-tuning and integration of state-of-the-art foundation models.",
            },
            {
                name: "OpenCV",
                description:
                    "Computer vision toolkit for image preprocessing and feature extraction. It supports robust real-time vision pipelines for model-ready inputs.",
            },
            {
                name: "MediaPipe",
                description:
                    "Real-time perception framework for landmark and gesture tracking. It converts live camera streams into structured signals for downstream ML tasks.",
            },
        ],
    },
    {
        category: "Backend & Architecture",
        items: [
            {
                name: "FastAPI",
                description:
                    "High-performance backend framework for serving ML inference endpoints. It provides async execution and automatic OpenAPI documentation out of the box.",
            },
            {
                name: "Streamlit",
                description:
                    "Rapid app framework for building interactive ML demos and diagnostics dashboards. It shortens the path from experiment to shareable prototype.",
            },
            {
                name: "Data Structures & Algorithms",
                description:
                    "Applied to optimize runtime complexity in data and inference pipelines. They are essential for scalable backend architecture and efficient problem solving.",
            },
        ],
    },
    {
        category: "Databases & Tools",
        items: [
            {
                name: "MySQL",
                description:
                    "Relational database used for reliable storage of application and experiment data. It supports performant querying for analytics and service layers.",
            },
            {
                name: "Git",
                description:
                    "Version-control backbone for branching, reviews, and reproducible development workflows. It keeps model and backend changes traceable over time.",
            },
            {
                name: "GitHub",
                description:
                    "Collaboration platform for code hosting, issue tracking, and CI-integrated delivery. It supports maintainable documentation and portfolio-ready project releases.",
            },
        ],
    },
];
