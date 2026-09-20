import { forwardRef } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { jsx } from "react/jsx-runtime";
//#region src/utils/cn.ts
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
//#endregion
//#region src/components/common/Badge.tsx
var variantStyles$1 = {
	default: "bg-white/[0.08] text-text-secondary border border-border-subtle",
	accent: "bg-accent/15 text-accent-hover border border-accent/20",
	quality: "bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20",
	rating: "bg-accent-amber/10 text-accent-amber border border-accent-amber/20",
	filler: "bg-warning/10 text-warning border border-warning/20",
	type: "bg-white/[0.06] text-text-secondary border border-border-subtle uppercase tracking-wider"
};
function Badge({ children, variant = "default", className }) {
	return /* @__PURE__ */ jsx("span", {
		className: cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold leading-none whitespace-nowrap", variantStyles$1[variant], className),
		children
	});
}
//#endregion
//#region src/components/common/Button.tsx
var variantStyles = {
	primary: "bg-gradient-to-r from-accent to-accent-magenta text-white shadow-lg shadow-accent/20 hover:shadow-accent/30 hover:brightness-110 active:brightness-95",
	secondary: "bg-white/[0.08] text-text-primary border border-border hover:bg-white/[0.12] hover:border-border-strong active:bg-white/[0.06]",
	ghost: "text-text-secondary hover:text-text-primary hover:bg-white/[0.06] active:bg-white/[0.04]",
	icon: "text-text-secondary hover:text-text-primary hover:bg-white/[0.08] active:bg-white/[0.04]",
	danger: "bg-error/10 text-error border border-error/20 hover:bg-error/20 active:bg-error/15"
};
var sizeStyles = {
	sm: "h-8 px-3 text-xs gap-1.5 rounded-lg",
	md: "h-10 px-4 text-sm gap-2 rounded-lg",
	lg: "h-12 px-6 text-base gap-2.5 rounded-xl"
};
var iconSizeStyles = {
	sm: "h-8 w-8 rounded-lg",
	md: "h-10 w-10 rounded-lg",
	lg: "h-12 w-12 rounded-xl"
};
var Button = forwardRef(({ className, variant = "primary", size = "md", href, children, ...props }, ref) => {
	const isIcon = variant === "icon";
	const classes = cn("inline-flex items-center justify-center font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-base disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap", variantStyles[variant], isIcon ? iconSizeStyles[size] : sizeStyles[size], className);
	if (href) return /* @__PURE__ */ jsx("a", {
		href,
		className: classes,
		children
	});
	return /* @__PURE__ */ jsx("button", {
		ref,
		className: classes,
		...props,
		children
	});
});
Button.displayName = "Button";
//#endregion
export { Badge as n, cn as r, Button as t };
