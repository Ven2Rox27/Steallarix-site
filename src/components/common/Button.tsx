// ============================================================
// Stellarix — Button Component
// ============================================================

import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'icon' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
  href?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-accent to-accent-magenta text-white shadow-lg shadow-accent/20 hover:shadow-accent/30 hover:brightness-110 active:brightness-95',
  secondary:
    'bg-white/[0.08] text-text-primary border border-border hover:bg-white/[0.12] hover:border-border-strong active:bg-white/[0.06]',
  ghost:
    'text-text-secondary hover:text-text-primary hover:bg-white/[0.06] active:bg-white/[0.04]',
  icon:
    'text-text-secondary hover:text-text-primary hover:bg-white/[0.08] active:bg-white/[0.04]',
  danger:
    'bg-error/10 text-error border border-error/20 hover:bg-error/20 active:bg-error/15',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-lg',
  md: 'h-10 px-4 text-sm gap-2 rounded-lg',
  lg: 'h-12 px-6 text-base gap-2.5 rounded-xl',
};

const iconSizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 w-8 rounded-lg',
  md: 'h-10 w-10 rounded-lg',
  lg: 'h-12 w-12 rounded-xl',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'primary', size = 'md', href, children, ...props },
    ref
  ) => {
    const isIcon = variant === 'icon';
    const classes = cn(
      'inline-flex items-center justify-center font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-base disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap',
      variantStyles[variant],
      isIcon ? iconSizeStyles[size] : sizeStyles[size],
      className
    );

    if (href) {
      return (
        <a href={href} className={classes}>
          {children}
        </a>
      );
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
