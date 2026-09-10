import { recipe, RecipeVariants } from "@vanilla-extract/recipes";
import { vars } from "@/styles/theme.css";

export const inputRecipe = recipe({
  base: {
    width: "100%",
    borderRadius: vars.radii.lg,
    border: `1px solid ${vars.color.border}`,
    backgroundColor: vars.color.surface,
    color: vars.color.text,
    fontSize: vars.fontSize.sm,
    lineHeight: vars.lineHeight.normal,
    padding: `0 ${vars.space["3"]}`,
    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
    outline: "none",
    "::placeholder": {
      color: vars.color.textSubtle,
    },
    ":focus": {
      borderColor: vars.color.borderFocus,
      boxShadow: `0 0 0 3px ${vars.color.primarySubtle}`,
    },
    ":disabled": {
      opacity: 0.6,
      cursor: "not-allowed",
      backgroundColor: vars.color.surfaceSubtle,
    },
  },
  variants: {
    size: {
      sm: {
        height: "2.25rem", // 36px
        fontSize: vars.fontSize.xs,
      },
      default: {
        height: "2.5rem", // 40px
        fontSize: vars.fontSize.sm,
      },
      lg: {
        height: "2.75rem", // 44px
        fontSize: vars.fontSize.base,
      },
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export type InputVariants = RecipeVariants<typeof inputRecipe>;
