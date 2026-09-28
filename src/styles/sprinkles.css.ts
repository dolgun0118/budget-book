import { defineProperties, createSprinkles } from "@vanilla-extract/sprinkles";
import { vars } from "./theme.css";

// 1. 반응형 레이아웃 및 간격 프로퍼티
const responsiveProperties = defineProperties({
  conditions: {
    mobile: {},
    tablet: { "@media": "screen and (min-width: 768px)" },
    desktop: { "@media": "screen and (min-width: 1024px)" },
  },
  defaultCondition: "mobile",
  properties: {
    display: ["none", "flex", "inline-flex", "block", "inline-block", "grid", "inline"],
    flexDirection: ["row", "column", "row-reverse", "column-reverse"],
    justifyContent: [
      "flex-start",
      "center",
      "flex-end",
      "space-between",
      "space-around",
      "space-evenly",
    ],
    alignItems: ["flex-start", "center", "flex-end", "stretch", "baseline"],
    flexWrap: ["nowrap", "wrap", "wrap-reverse"],
    flexGrow: [0, 1],
    flexShrink: [0, 1],
    gap: vars.space,
    rowGap: vars.space,
    columnGap: vars.space,
    paddingTop: vars.space,
    paddingBottom: vars.space,
    paddingLeft: vars.space,
    paddingRight: vars.space,
    marginTop: vars.space,
    marginBottom: vars.space,
    marginLeft: vars.space,
    marginRight: vars.space,
    width: ["auto", "100%", "100vw", "fit-content"],
    maxWidth: ["none", "100%", "400px", "600px", "800px", "960px", "1024px", "1200px"],
    minWidth: ["0", "100%"],
    height: ["auto", "100%", "100vh", "fit-content"],
    minHeight: ["0", "100vh", "fit-content"],
    textAlign: ["left", "center", "right"],
    position: ["static", "relative", "absolute", "fixed", "sticky"],
    overflow: ["visible", "hidden", "scroll", "auto"],
    borderRadius: vars.radii,
    fontSize: vars.fontSize,
    fontWeight: vars.fontWeight,
  },
  shorthands: {
    padding: ["paddingTop", "paddingBottom", "paddingLeft", "paddingRight"],
    p: ["paddingTop", "paddingBottom", "paddingLeft", "paddingRight"],
    paddingX: ["paddingLeft", "paddingRight"],
    px: ["paddingLeft", "paddingRight"],
    paddingY: ["paddingTop", "paddingBottom"],
    py: ["paddingTop", "paddingBottom"],
    pt: ["paddingTop"],
    pb: ["paddingBottom"],
    pl: ["paddingLeft"],
    pr: ["paddingRight"],
    margin: ["marginTop", "marginBottom", "marginLeft", "marginRight"],
    m: ["marginTop", "marginBottom", "marginLeft", "marginRight"],
    marginX: ["marginLeft", "marginRight"],
    mx: ["marginLeft", "marginRight"],
    marginY: ["marginTop", "marginBottom"],
    my: ["marginTop", "marginBottom"],
    mt: ["marginTop"],
    mb: ["marginBottom"],
    ml: ["marginLeft"],
    mr: ["marginRight"],
    rounded: ["borderRadius"],
  },
});

// 2. 색상, 테두리, 기타 프로퍼티
const colorProperties = defineProperties({
  properties: {
    color: vars.color,
    background: vars.color,
    backgroundColor: vars.color,
    borderColor: vars.color,
    borderWidth: ["0", "1px", "2px", "4px"],
    borderStyle: ["none", "solid", "dashed", "dotted"],
    lineHeight: vars.lineHeight,
    cursor: ["default", "pointer", "not-allowed"],
    userSelect: ["none", "auto", "text"],
  },
  shorthands: {
    bg: ["backgroundColor"],
  },
});

// Sprinkles 생성
export const sprinkles = createSprinkles(responsiveProperties, colorProperties);

// Sprinkles 타입 정의
export type Sprinkles = Parameters<typeof sprinkles>[0];
