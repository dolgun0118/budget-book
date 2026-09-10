import { recipe, RecipeVariants } from "@vanilla-extract/recipes";
import { vars } from "@/styles/theme.css";

export const badgeRecipe = recipe({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: vars.radii.full,
    fontWeight: vars.fontWeight.semibold,
    lineHeight: vars.lineHeight.none,
    whiteSpace: "nowrap",
    userSelect: "none",
  },
  variants: {
    variant: {
      primary: {
        backgroundColor: vars.color.primarySubtle,
        color: vars.color.primary,
      },
      income: {
        backgroundColor: "#E8F7EE",
        color: "#248A54",
      },
      expense: {
        backgroundColor: "#FEECEE",
        color: "#DC2626",
      },
      save: {
        backgroundColor: "#EBF4FD",
        color: "#2563EB",
      },
      gold: {
        backgroundColor: "#FEF3C7",
        color: "#B45309",
      },
      secondary: {
        backgroundColor: vars.color.secondary,
        color: vars.color.secondaryForeground,
      },
      outline: {
        backgroundColor: "transparent",
        border: `1px solid ${vars.color.border}`,
        color: vars.color.textMuted,
      },
    },
    size: {
      sm: {
        fontSize: vars.fontSize.xs,
        padding: "3px 8px",
      },
      md: {
        fontSize: vars.fontSize.sm,
        padding: "5px 12px",
      },
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "sm",
  },
});

export type BadgeVariants = RecipeVariants<typeof badgeRecipe>;
