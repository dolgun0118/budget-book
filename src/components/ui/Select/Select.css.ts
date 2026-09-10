import { recipe, RecipeVariants } from "@vanilla-extract/recipes";
import { vars } from "@/styles/theme.css";

export const selectRecipe = recipe({
  base: {
    width: "100%",
    borderRadius: vars.radii.lg,
    border: `1px solid ${vars.color.border}`,
    backgroundColor: vars.color.surface,
    color: vars.color.text,
    fontSize: vars.fontSize.sm,
    lineHeight: vars.lineHeight.normal,
    padding: `0 ${vars.space["8"]} 0 ${vars.space["3"]}`,
    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
    outline: "none",
    cursor: "pointer",
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 10px center",
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

export type SelectVariants = RecipeVariants<typeof selectRecipe>;
