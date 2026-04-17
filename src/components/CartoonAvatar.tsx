const CartoonAvatar = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 400 400"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Background circle */}
    <circle cx="200" cy="200" r="200" fill="#E8F4FD" />

    {/* Neck */}
    <rect x="165" y="270" width="70" height="40" rx="10" fill="#F0C8A0" />

    {/* Shirt / Body */}
    <path
      d="M120 310 Q120 290 165 290 L235 290 Q280 290 280 310 L290 400 L110 400 Z"
      fill="#D4C4A8"
    />
    {/* Shirt collar / inner tee */}
    <path
      d="M175 290 Q200 320 225 290"
      stroke="#2D2D2D"
      strokeWidth="3"
      fill="#2D2D2D"
    />
    {/* Shirt collar lines */}
    <line x1="165" y1="290" x2="155" y2="330" stroke="#C4B498" strokeWidth="2" />
    <line x1="235" y1="290" x2="245" y2="330" stroke="#C4B498" strokeWidth="2" />

    {/* Face */}
    <ellipse cx="200" cy="200" rx="85" ry="95" fill="#F0C8A0" />

    {/* Ears */}
    <ellipse cx="115" cy="200" rx="16" ry="22" fill="#F0C8A0" />
    <ellipse cx="115" cy="200" rx="10" ry="14" fill="#E8B890" />
    <ellipse cx="285" cy="200" rx="16" ry="22" fill="#F0C8A0" />
    <ellipse cx="285" cy="200" rx="10" ry="14" fill="#E8B890" />

    {/* Hair */}
    <path
      d="M115 180 Q115 100 200 90 Q285 100 285 180 Q285 140 260 125 Q240 115 200 110 Q160 115 140 125 Q115 140 115 180Z"
      fill="#2D1B0E"
    />
    {/* Hair top volume */}
    <path
      d="M130 160 Q130 85 200 75 Q270 85 270 160 Q265 120 240 105 Q215 92 200 90 Q185 92 160 105 Q135 120 130 160Z"
      fill="#3D2B1E"
    />
    {/* Hair side left */}
    <path
      d="M115 180 Q112 160 120 140 Q115 155 118 180Z"
      fill="#2D1B0E"
    />
    {/* Hair side right */}
    <path
      d="M285 180 Q288 160 280 140 Q285 155 282 180Z"
      fill="#2D1B0E"
    />

    {/* Eyebrows */}
    <path
      d="M150 170 Q165 162 180 168"
      stroke="#2D1B0E"
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M220 168 Q235 162 250 170"
      stroke="#2D1B0E"
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
    />

    {/* Eyes */}
    <ellipse cx="165" cy="195" rx="14" ry="15" fill="white" />
    <ellipse cx="235" cy="195" rx="14" ry="15" fill="white" />
    <ellipse cx="167" cy="197" rx="7" ry="8" fill="#3D2B1E" />
    <ellipse cx="237" cy="197" rx="7" ry="8" fill="#3D2B1E" />
    <ellipse cx="169" cy="194" rx="3" ry="3" fill="white" />
    <ellipse cx="239" cy="194" rx="3" ry="3" fill="white" />

    {/* Nose */}
    <path
      d="M195 215 Q200 230 205 215"
      stroke="#D4A880"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
    />

    {/* Smile */}
    <path
      d="M165 245 Q200 275 235 245"
      stroke="#C47050"
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
    />
    {/* Teeth hint */}
    <path
      d="M175 250 Q200 268 225 250"
      fill="white"
    />

    {/* Subtle cheek blush */}
    <ellipse cx="140" cy="235" rx="15" ry="8" fill="#F0B0A0" opacity="0.3" />
    <ellipse cx="260" cy="235" rx="15" ry="8" fill="#F0B0A0" opacity="0.3" />
  </svg>
);

export default CartoonAvatar;
