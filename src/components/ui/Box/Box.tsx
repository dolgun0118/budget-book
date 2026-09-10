import React, { ElementType, ComponentPropsWithRef } from "react";
import clsx from "clsx";
import { sprinkles, Sprinkles } from "@/styles/sprinkles.css";

type AsProp<T extends ElementType> = {
  as?: T;
};

export type BoxProps<T extends ElementType = "div"> = AsProp<T> &
  Sprinkles &
  Omit<ComponentPropsWithRef<T>, keyof AsProp<T> | keyof Sprinkles>;

export function Box<T extends ElementType = "div">({
  as,
  className,
  children,
  ref,
  ...props
}: BoxProps<T> & { ref?: React.ComponentPropsWithRef<T>["ref"] }) {
  const Component = as || "div";
  const atomProps: Record<string, unknown> = {};
  const nativeProps: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(props)) {
    if (sprinkles.properties.has(key as keyof Sprinkles)) {
      atomProps[key] = value;
    } else {
      nativeProps[key] = value;
    }
  }

  const classes = clsx(sprinkles(atomProps), className);

  return React.createElement(
    Component,
    {
      ref,
      className: classes,
      ...nativeProps,
    },
    children
  );
}
