interface EnglishomLogoProps {
  className?: string;
  showText?: boolean;
}

export default function EnglishomLogo({ className = "w-10 h-10", showText = false }: EnglishomLogoProps) {
  return (
    <div className="flex items-center gap-2.5 group">
      <img
        src="/logo.png"
        onError={(e) => {
          // Fallback if hosted under subpath /ques/
          if (!e.currentTarget.dataset.retried) {
            e.currentTarget.dataset.retried = "true";
            e.currentTarget.src = "/ques/logo.png";
          }
        }}
        alt="EnglishOM Logo"
        className={`${className} object-contain rounded-lg shadow-sm border border-[#7A2A2D] bg-[#3D1214] group-hover:border-[#D4AF37] transition-all duration-200 shrink-0`}
      />
      {showText && (
        <span className="font-extrabold tracking-wider text-sm sm:text-base text-foreground leading-tight group-hover:text-amber-500 transition-colors">
          ENGLISHOM
        </span>
      )}
    </div>
  );
}
