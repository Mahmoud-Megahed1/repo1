interface EnglishomLogoProps {
  className?: string;
  showText?: boolean;
}

export default function EnglishomLogo({ className = "w-10 h-10", showText = false }: EnglishomLogoProps) {
  return (
    <div className="flex items-center gap-2.5 group">
      <div className={`${className} bg-[#3D1214] border border-[#7A2A2D] rounded-xl flex flex-col items-center justify-center p-1.5 shadow-md group-hover:border-[#D4AF37] transition-all duration-200 shrink-0`}>
        {/* Golden Roof / Chevron Icon */}
        <svg viewBox="0 0 100 100" className="w-full h-full text-[#D4AF37]" fill="currentColor">
          {/* Top Outer Roof Chevron */}
          <path d="M50 12 L85 40 L75 48 L50 28 L25 48 L15 40 Z" />
          {/* Inner Roof Chevron */}
          <path d="M50 32 L75 52 L67 58 L50 44 L33 58 L25 52 Z" />
          {/* House Base & Grid */}
          <path d="M30 60 L70 60 L70 85 L30 85 Z M42 66 L42 74 L58 74 L58 66 Z M42 77 L42 81 L58 81 L58 77 Z" />
        </svg>
      </div>
      {showText && (
        <span className="font-extrabold tracking-wider text-sm sm:text-base text-foreground leading-tight group-hover:text-amber-500 transition-colors">
          ENGLISHOM
        </span>
      )}
    </div>
  );
}
