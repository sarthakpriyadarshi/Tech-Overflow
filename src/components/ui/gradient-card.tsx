import { cn } from "@/lib/utils";
import React from "react";

interface GradientCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
}

export const GradientCard = React.forwardRef<HTMLDivElement, GradientCardProps>(
  ({ className, children, hover = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-xl border border-emerald-500/20 bg-black/40 p-6 backdrop-blur-lg",
          hover && "transition-all duration-300 hover:scale-[1.02]",
          className
        )}
        {...props}
      >
        {children}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(66,240,192,0.1),rgba(255,255,255,0))]" />
      </div>
    );
  }
);
GradientCard.displayName = "GradientCard";
