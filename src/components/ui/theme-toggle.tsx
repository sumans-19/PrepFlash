
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full w-10 h-10 hover:scale-110 transition-transform relative"
      aria-label="Toggle theme"
    >
      {/* Both icons stacked - only one fully visible depending on theme */}
      <Sun
        className={`h-5 w-5 transition-all duration-300 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${
          theme === "dark" ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-0 -rotate-90"
        }`}
      />
      <Moon
        className={`h-5 w-5 transition-all duration-300 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${
          theme === "dark" ? "opacity-0 scale-0 rotate-90" : "opacity-100 scale-100 rotate-0"
        }`}
      />
    </Button>
  );
}

export { useTheme };
