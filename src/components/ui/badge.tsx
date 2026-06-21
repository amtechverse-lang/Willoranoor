import * as React from "react";
import { cn } from "@/lib/utils";

function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "secondary" | "outline";
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variant === "default" && "border-transparent bg-gold text-charcoal",
        variant === "secondary" &&
          "border-transparent bg-beige-dark text-charcoal",
        variant === "outline" && "border-charcoal/20 text-charcoal",
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
