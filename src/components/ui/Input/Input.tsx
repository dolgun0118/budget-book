import * as React from "react";
import clsx from "clsx";
import { inputRecipe, InputVariants } from "./Input.css";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    NonNullable<InputVariants> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, size, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        className={clsx(inputRecipe({ size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
