import * as React from "react";
import clsx from "clsx";
import { badgeRecipe, BadgeVariants } from "./Badge.css";

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    NonNullable<BadgeVariants> {}

export function Badge({ className, variant, size, children, ...props }: BadgeProps) {
  return (
    <span className={clsx(badgeRecipe({ variant, size }), className)} {...props}>
      {children}
    </span>
  );
}
