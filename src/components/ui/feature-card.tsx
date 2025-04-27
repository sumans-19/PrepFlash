
import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon;
  title: string;
  description: string;
  variant?: 'default' | 'accent' | 'muted';
}

export const FeatureCard = React.forwardRef<HTMLDivElement, FeatureCardProps>(
  ({ className, icon: Icon, title, description, variant = 'default', ...props }, ref) => {
    return (
      <div 
        ref={ref}
        className={cn(
          "p-6 rounded-xl border border-border bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
          variant === 'accent' && "border-prep-accent/20 bg-prep-accent/5",
          variant === 'muted' && "border-muted bg-muted/30",
          className
        )} 
        {...props}
      >
        <div className={cn(
          "w-12 h-12 mb-5 rounded-lg flex items-center justify-center",
          variant === 'default' && "bg-prep-primary/10 text-prep-primary", 
          variant === 'accent' && "bg-prep-accent/10 text-prep-accent",
          variant === 'muted' && "bg-muted text-muted-foreground"
        )}>
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    );
  }
);

FeatureCard.displayName = "FeatureCard";
