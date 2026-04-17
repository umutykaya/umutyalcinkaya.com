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
  Dockerfile: "#384d54",
  Makefile: "#427819",
  C: "#555555",
  "C++": "#f34b7d",
  PHP: "#4F5D95",
  Lua: "#000080",
  Vue: "#41b883",
  SCSS: "#c6538c",
};

interface LanguageBarProps {
  languages: Record<string, number>;
}

const LanguageBar = ({ languages }: LanguageBarProps) => {
  const entries = Object.entries(languages).sort(([, a], [, b]) => b - a);
  const total = entries.reduce((s, [, v]) => s + v, 0);
  if (total === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex h-2 rounded-full overflow-hidden bg-secondary">
        {entries.map(([lang, bytes]) => (
          <div
            key={lang}
            className="h-full first:rounded-l-full last:rounded-r-full"
            style={{
              width: `${(bytes / total) * 100}%`,
              backgroundColor: LANGUAGE_COLORS[lang] ?? "#8b8b8b",
              minWidth: bytes / total > 0.005 ? "2px" : 0,
            }}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {entries.map(([lang, bytes]) => (
          <span key={lang} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ backgroundColor: LANGUAGE_COLORS[lang] ?? "#8b8b8b" }}
            />
            {lang}
            <span className="tabular-nums opacity-70">
              {((bytes / total) * 100).toFixed(1)}%
            </span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default LanguageBar;
