
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type NavigationArrowProps = {
  onClick?: () => void;
  direction?: "left" | "right";
  className?: string;
};

const NavigationArrow = ({
  onClick,
  direction = "right",
  className,
}: NavigationArrowProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "absolute top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-primary/80 text-primary-foreground shadow-md transition-all hover:bg-primary hover:scale-110 cursor-pointer",
        direction === "left" ? "left-0 -translate-x-1/2" : "right-0 translate-x-1/2",
        className
      )}
    >
      {direction === "left" ? (
        <ChevronRight className="h-5 w-5 rotate-180" />
      ) : (
        <ChevronRight className="h-5 w-5" />
      )}
    </div>
  );
};

export default NavigationArrow;
