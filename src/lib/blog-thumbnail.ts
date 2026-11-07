/** Deterministic hue (0-359) derived from a string, so each post gets a stable color. */
export function hashHue(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash % 360;
}

export function thumbnailGradient(slug: string): { from: string; to: string } {
  const hue = hashHue(slug);
  return {
    from: `hsl(${hue} 65% 38%)`,
    to: `hsl(${(hue + 50) % 360} 70% 24%)`,
  };
}
