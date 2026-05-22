import { useEffect, useState } from "react";
import { ENGLISHOM_COLORS } from "@/constants/colors";

export default function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = window.scrollY;
      const scrollProgress = windowHeight > 0 ? (scrolled / windowHeight) * 100 : 0;
      setProgress(scrollProgress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 h-1 z-50 transition-all duration-300"
      style={{
        width: `${progress}%`,
        backgroundColor: ENGLISHOM_COLORS.primary,
        boxShadow: `0 0 10px ${ENGLISHOM_COLORS.primary}`,
      }}
    />
  );
}
