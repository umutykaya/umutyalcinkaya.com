const AnimatedBackground = () => {
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden animated-bg"
      aria-hidden="true"
    >
      {/* Layer 1: Static noise grain via SVG feTurbulence filter */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        style={{ opacity: 0.05 }}
      >
        <defs>
          <filter id="kusama-noise" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
            />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#kusama-noise)" />
      </svg>

      {/* Layer 2: Faint grid lines — uses theme-aware --kusama-line variable */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.04,
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(var(--kusama-line), 0.5) 59px, rgba(var(--kusama-line), 0.5) 60px)," +
            "repeating-linear-gradient(90deg, transparent, transparent 59px, rgba(var(--kusama-line), 0.5) 59px, rgba(var(--kusama-line), 0.5) 60px)",
        }}
      />

      {/* Layer 3: CRT scanline overlay (static horizontal lines) */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(180deg, transparent 0px, transparent 3px, rgba(var(--kusama-line), 0.03) 3px, rgba(var(--kusama-line), 0.03) 4px)",
        }}
      />

      {/* Layer 3b: CRT sweeping scanline — animated top-to-bottom */}
      <div className="absolute left-0 right-0 h-[2px] kusama-sweep" />

      {/* Layer 4: Ambient glow pulse — hot pink (#ff0066) */}
      <div
        className="absolute kusama-glow-pink"
        style={{
          top: "20%",
          left: "15%",
          width: "40vw",
          height: "40vw",
          background:
            "radial-gradient(circle, rgba(255, 0, 102, var(--kusama-glow-pink-opacity)) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />

      {/* Layer 5: Ambient glow pulse — cyan (#00ffff) */}
      <div
        className="absolute kusama-glow-cyan"
        style={{
          bottom: "10%",
          right: "10%",
          width: "35vw",
          height: "35vw",
          background:
            "radial-gradient(circle, rgba(0, 255, 255, var(--kusama-glow-cyan-opacity)) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />
    </div>
  );
};

export default AnimatedBackground;
