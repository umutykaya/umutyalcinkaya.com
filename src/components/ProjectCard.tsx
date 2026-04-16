import { ArrowUpRight } from "lucide-react";

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  href?: string;
  className?: string;
}

const ProjectCard = ({ title, description, tags, href = "#", className = "" }: ProjectCardProps) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative flex flex-col justify-between p-6 rounded-2xl border border-border/50 bg-card hover:border-accent/30 transition-all duration-300 hover:glow ${className}`}
    >
      <div>
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-gradient transition-colors duration-300">
            {title}
          </h3>
          <ArrowUpRight size={18} className="text-muted-foreground group-hover:text-accent transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">{description}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="text-xs px-2.5 py-1 rounded-md bg-secondary text-muted-foreground">
            {tag}
          </span>
        ))}
      </div>
    </a>
  );
};

export default ProjectCard;
