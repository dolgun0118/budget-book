import * as React from "react";
import clsx from "clsx";
import { selectRecipe, SelectVariants } from "./Select.css";

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size">,
    NonNullable<SelectVariants> {}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, size, children, ...props }, ref) => {
    return (
      <select
        className={clsx(selectRecipe({ size }), className)}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = "Select";
