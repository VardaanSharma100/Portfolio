import { Link, Navigate, useParams } from "react-router-dom";
import { GoArrowLeft, GoLinkExternal } from "react-icons/go";
import { SiGithub } from "react-icons/si";
import { CardSpotlight } from "@/components/ui/aceternity/card-spotlight";
import { SEO } from "@/components/seo/SEO";
import { Badge } from "@/components/ui/common/badge";
import { Button } from "@/components/ui/common/button";
import { skillsData } from "@/config/skillsData";
import { getProjectBySlug, portfolioProjects } from "@/config/projectsData";

const skillDescriptionMap = new Map(
    skillsData
        .flatMap((category) => category.items)
        .filter((item): item is { name: string; description: string } =>
            Boolean(item.description)
        )
        .map((item) => [item.name.toLowerCase(), item.description])
);

const extraTechDescriptions: Record<string, string> = {
    "machine learning":
        "A branch of AI focused on training models to learn patterns from data and make predictions.",
    "deep learning":
        "A subset of machine learning that uses multi-layer neural networks for complex perception and prediction tasks.",
    cnn: "Convolutional Neural Networks are specialized neural models for extracting spatial features from images and video.",
    lstm: "Long Short-Term Memory networks are recurrent architectures designed to model sequences and long-range temporal patterns.",
    transformer:
        "A neural architecture based on attention mechanisms that excels at sequence understanding and generation.",
    "gen ai":
        "Generative AI focuses on creating new content such as text, images, audio, or code from learned patterns.",
    "groq ai":
        "Groq AI refers to using Groq-powered LLM inference for high-speed, low-latency generative AI responses.",
    librosa:
        "A Python audio-analysis library used for feature extraction, spectrogram generation, and signal preprocessing.",
};

function getTechDescription(tech: string): string {
    const normalized = tech.trim().toLowerCase();
    return (
        skillDescriptionMap.get(normalized) ||
        extraTechDescriptions[normalized] ||
        `${tech} is a core technology used in this project workflow.`
    );
}

export default function ProjectDetails(): JSX.Element {
    const { projectSlug } = useParams<{ projectSlug: string }>();
    const project = projectSlug ? getProjectBySlug(projectSlug) : undefined;

    if (!project) {
        return <Navigate to="/" replace />;
    }

    const projectRunningRoute = project.embeddedAppPath;

    const relatedProjects = portfolioProjects
        .filter((item) => item.slug !== project.slug)
        .slice(0, 3);

    return (
        <main className="min-h-screen pt-28 pb-16 px-6 md:px-10">
            <SEO
                title={`${project.title} | Vardaan Sharma`}
                description={project.description}
                keywords={`${project.title}, ${project.techStack.join(", ")}, machine learning project`}
                url={`https://vardaansharma.com/${project.slug}`}
                type="article"
            />

            <div className="max-w-6xl mx-auto space-y-8">
                <section className="rounded-3xl border border-black/[0.08] dark:border-white/[0.14] p-6 md:p-10 bg-white/90 dark:bg-neutral-900/60 backdrop-blur-sm">
                    <p className="text-sm uppercase tracking-[0.22em] text-emerald-600 dark:text-emerald-400 mb-3">
                        Featured Project
                    </p>
                    <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
                        {project.title}
                    </h1>
                    <p className="text-base md:text-lg text-neutral-700 dark:text-neutral-300 max-w-3xl mb-6">
                        {project.description}
                    </p>

                    <div className="flex flex-wrap gap-3">
                        <Button asChild variant="outline" className="rounded-2xl">
                            <Link to="/" state={{ scrollToSection: "projects" }}>
                                <GoArrowLeft className="size-4" />
                                Back to Projects
                            </Link>
                        </Button>

                        <Button asChild className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white">
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                <SiGithub className="size-4" />
                                GitHub Repository
                            </a>
                        </Button>
                    </div>
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
                    <article className="rounded-3xl border border-black/[0.08] dark:border-white/[0.14] p-4 md:p-5 bg-white/80 dark:bg-neutral-900/50">
                        <a href={projectRunningRoute} className="group block mb-5">
                            <img
                                src={project.imageUrl}
                                alt={project.title}
                                width={1200}
                                height={675}
                                className="w-full h-auto aspect-video object-cover rounded-2xl transition-opacity group-hover:opacity-90"
                            />
                        </a>
                        <h2 className="text-xl md:text-2xl font-semibold mb-3">Project Overview</h2>
                        <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                            {project.overview}
                        </p>
                    </article>

                    <aside className="space-y-6">
                        <div className="rounded-3xl border border-black/[0.08] dark:border-white/[0.14] p-5 bg-white/80 dark:bg-neutral-900/50">
                            <h2 className="text-lg font-semibold mb-3">Tech Stack</h2>
                            <div className="flex flex-wrap gap-2">
                                {project.techStack.map((tech) => {
                                    const description = getTechDescription(tech);

                                    return (
                                        <div key={tech} className="relative group/tech">
                                            <Badge
                                                variant="secondary"
                                                tabIndex={0}
                                                aria-label={`What is ${tech}?`}
                                                className="rounded-2xl px-3 py-1 text-sm font-medium cursor-help transition-transform ease-in-out duration-300 bg-gray-100 dark:bg-neutral-900 text-neutral-900 dark:text-white hover:bg-emerald-600 dark:hover:bg-emerald-600 hover:text-white hover:scale-105"
                                            >
                                                {tech}
                                            </Badge>

                                            <div className="pointer-events-none absolute left-1/2 top-full z-40 mt-2 w-64 -translate-x-1/2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900 px-3 py-2 text-left opacity-0 translate-y-1 transition-all duration-200 group-hover/tech:opacity-100 group-hover/tech:translate-y-0 group-focus-within/tech:opacity-100 group-focus-within/tech:translate-y-0">
                                                <p className="text-xs font-semibold text-neutral-900 dark:text-white mb-1">
                                                    {tech}
                                                </p>
                                                <p className="text-xs leading-relaxed text-neutral-700 dark:text-neutral-300">
                                                    {description}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="rounded-3xl border border-black/[0.08] dark:border-white/[0.14] p-5 bg-white/80 dark:bg-neutral-900/50">
                            <h2 className="text-lg font-semibold mb-2">Run Project</h2>
                            <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-4">
                                Open the full interactive app for this project.
                            </p>
                            <Button asChild variant="outline" className="w-full rounded-2xl">
                                <a href={projectRunningRoute}>
                                    <GoLinkExternal className="size-4" />
                                    Run the Project
                                </a>
                            </Button>
                        </div>
                    </aside>
                </section>

                <section className="rounded-3xl border border-black/[0.08] dark:border-white/[0.14] p-6 md:p-8 bg-white/80 dark:bg-neutral-900/50">
                    <h2 className="text-xl md:text-2xl font-semibold mb-4">Key Highlights</h2>
                    <ul className="space-y-3 text-neutral-700 dark:text-neutral-300 list-disc pl-6">
                        {project.highlights.map((highlight) => (
                            <li key={highlight}>{highlight}</li>
                        ))}
                    </ul>
                </section>

                <section className="rounded-3xl border border-black/[0.08] dark:border-white/[0.14] p-6 md:p-8 bg-white/80 dark:bg-neutral-900/50">
                    <h2 className="text-xl md:text-2xl font-semibold mb-4">Explore More Projects</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {relatedProjects.map((item) => (
                            <CardSpotlight
                                key={item.slug}
                                className="p-0 rounded-2xl overflow-hidden border border-black/[0.08] dark:border-white/[0.12] shadow-sm hover:shadow-lg transition-shadow duration-500 ease-in-out"
                            >
                                <Link
                                    to={`/${item.slug}`}
                                    className="block h-full px-4 py-4 transition-colors hover:bg-emerald-50/60 dark:hover:bg-emerald-900/20"
                                >
                                    <p className="font-semibold mb-1">{item.title}</p>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3">
                                        {item.description}
                                    </p>
                                </Link>
                            </CardSpotlight>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}