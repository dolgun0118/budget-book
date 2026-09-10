import { recipe, RecipeVariants } from "@vanilla-extract/recipes";
import { vars } from "@/styles/theme.css";

export const buttonRecipe = recipe({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: vars.space["2"],
    whiteSpace: "nowrap",
    borderRadius: vars.radii.lg,
    fontSize: vars.fontSize.sm,
    fontWeight: vars.fontWeight.medium,
    lineHeight: vars.lineHeight.none,
    transition: "background-color 0.15s ease, border-color 0.15s ease, opacity 0.15s ease",
    cursor: "pointer",
    border: "1px solid transparent",
    outline: "none",
    userSelect: "none",
    ":disabled": {
      opacity: 0.5,
      pointerEvents: "none",
      cursor: "not-allowed",
    },
    ":focus-visible": {
      boxShadow: `0 0 0 2px ${vars.color.surface}, 0 0 0 4px ${vars.color.borderFocus}`,
    },
  },

  variants: {
    variant: {
      default: {
        backgroundColor: vars.color.primary,
        color: vars.color.primaryForeground,
        ":hover": {
          backgroundColor: vars.color.primaryHover,
        },
        ":active": {
          backgroundColor: vars.color.primaryActive,
        },
      },
      secondary: {
        backgroundColor: vars.color.secondary,
        color: vars.color.secondaryForeground,
        ":hover": {
          backgroundColor: vars.color.secondaryHover,
        },
      },
      outline: {
        backgroundColor: "transparent",
        borderColor: vars.color.border,
        color: vars.color.text,
        ":hover": {
          backgroundColor: vars.color.surfaceSubtle,
          borderColor: vars.color.borderHover,
        },
      },
      ghost: {
        backgroundColor: "transparent",
        color: vars.color.text,
        ":hover": {
          backgroundColor: vars.color.surfaceSubtle,
        },
      },
      destructive: {
        backgroundColor: vars.color.destructive,
        color: vars.color.destructiveForeground,
        ":hover": {
          backgroundColor: vars.color.destructiveHover,
        },
      },
      link: {
        backgroundColor: "transparent",
        color: vars.color.primary,
        textUnderlineOffset: "4px",
        ":hover": {
          textDecoration: "underline",
        },
      },
    },

    size: {
      default: {
        height: "2.5rem", // 40px
        padding: `0 ${vars.space["4"]}`,
      },
      sm: {
        height: "2.25rem", // 36px
        padding: `0 ${vars.space["3"]}`,
        fontSize: vars.fontSize.xs,
        borderRadius: vars.radii.md,
      },
      lg: {
        height: "2.75rem", // 44px
        padding: `0 ${vars.space["6"]}`,
        fontSize: vars.fontSize.base,
      },
      icon: {
        height: "2.5rem",
        width: "2.5rem",
        padding: 0,
      },
    },
  },

  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export type ButtonVariants = RecipeVariants<typeof buttonRecipe>;
