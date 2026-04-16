import { ArrowUpRight, Star, GitFork } from "lucide-react";

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  href?: string;
  language?: string | null;
  stars?: number;
  forks?: number;
  className?: string;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Go: "#00ADD8",
  Rust: "#dea584",
  Java: "#b07219",
  "C#": "#178600",
  Ruby: "#701516",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Dart: "#00B4AB",
  HCL: "#844FBA",
};

const ProjectCard = ({
  title,
  description,
  tags,
  href = "#",
  language,
  stars,
  forks,
  className = "",
}: ProjectCardProps) => {
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
          <ArrowUpRight
            size={18}
            className="text-muted-foreground group-hover:text-accent transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          {description}
        </p>
      </div>

      <div>
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-md bg-secondary text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {language && (
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full"
                style={{
                  backgroundColor: LANGUAGE_COLORS[language] ?? "#8b8b8b",
                }}
              />
              {language}
            </span>
          )}
          {typeof stars === "number" && (
            <span className="flex items-center gap-1">
              <Star size={13} />
              {stars}
            </span>
          )}
          {typeof forks === "number" && forks > 0 && (
            <span className="flex items-center gap-1">
              <GitFork size={13} />
              {forks}
            </span>
          )}
        </div>
      </div>
    </a>
  );
};

export default ProjectCard;
