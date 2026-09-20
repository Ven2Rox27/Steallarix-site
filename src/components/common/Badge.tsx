// ============================================================
// Stellarix — Badge Component
// ============================================================

import { cn } from '../../utils/cn';

type BadgeVariant = 'default' | 'accent' | 'quality' | 'rating' | 'filler' | 'type';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    'bg-white/[0.08] text-text-secondary border border-border-subtle',
  accent:
    'bg-accent/15 text-accent-hover border border-accent/20',
  quality:
    'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20',
  rating:
    'bg-accent-amber/10 text-accent-amber border border-accent-amber/20',
  filler:
    'bg-warning/10 text-warning border border-warning/20',
  type:
    'bg-white/[0.06] text-text-secondary border border-border-subtle uppercase tracking-wider',
};

export default function Badge({
  children,
  variant = 'default',
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold leading-none whitespace-nowrap',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
