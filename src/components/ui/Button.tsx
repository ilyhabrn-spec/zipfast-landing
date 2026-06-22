import type {
  ButtonHTMLAttributes,
  AnchorHTMLAttributes,
  ReactNode,
} from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type BaseProps = {
  variant?: ButtonVariant;
  children: ReactNode;
  className?: string;
};

type ButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };

type LinkProps = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-accent-foreground hover:bg-accent-secondary shadow-lg shadow-accent/25",
  secondary:
    "border border-[var(--border-accent-soft)] bg-canvas-card text-accent hover:border-accent hover:bg-surface",
  ghost: "text-muted hover:text-accent hover:bg-surface",
};

export function Button({
  variant = "primary",
  children,
  className = "",
  href,
  ...props
}: ButtonProps | LinkProps) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background ${variants[variant]} ${className}`;

  if (href) {
    const anchorProps = props as Omit<
      AnchorHTMLAttributes<HTMLAnchorElement>,
      keyof BaseProps
    >;
    return (
      <a href={href} className={classes} {...anchorProps}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...(props as ButtonProps)}>
      {children}
    </button>
  );
}
