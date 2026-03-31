import { useNavigate } from "react-router-dom";
import ProjectCard from "../../components/ui/common/project-card";
import { portfolioProjects } from "@/config/projectsData";

export default function Projects() {
  const navigate = useNavigate();

  return (
    <div className="pt-4" id="projects">
      <h1 className="text-3xl font-bold mb-2">FEATURED PROJECTS</h1>
      <p className="text-neutral-600 dark:text-neutral-400 mb-2">
        A showcase of my machine learning work, highlighting the technologies I've used and the problems I've solved.
      </p>
      <section className="p-6 md:p-12 bg-gradient-to-b max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 auto-rows-[1fr] justify-items-stretch ">
          {portfolioProjects.map((project) => (
            <ProjectCard
              key={project.slug}
              title={project.title}
              description={project.description}
              techStack={project.techStack}
              imageUrl={project.imageUrl}
              githubUrl={project.githubUrl}
              onCardClick={() => navigate(`/${project.slug}`)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
