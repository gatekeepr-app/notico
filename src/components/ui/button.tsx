import { cn } from "../../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  const base = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none";
  const variants: Record<string, string> = {
    primary: "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]",
    secondary: "bg-[var(--color-surface-subtle)] text-[var(--color-text)] border border-[var(--color-border)] hover:bg-[var(--color-border)]",
    ghost: "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)]",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950 dark:text-red-400",
  };
  const sizes: Record<string, string> = {
    sm: "h-7 px-2.5 text-xs",
    md: "h-9 px-3.5 text-sm",
    lg: "h-10 px-4 text-sm",
  };
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}
