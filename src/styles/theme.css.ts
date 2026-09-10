import {
  createGlobalTheme,
  createThemeContract,
  createTheme,
  assignVars,
  globalStyle,
} from "@vanilla-extract/css";
import { lightColors, darkColors } from "./tokens/colors";
import { space } from "./tokens/space";
import { radii } from "./tokens/radii";
import { fontSizes, fontWeights, lineHeights } from "./tokens/typography";

// 컬러 테마 컨트랙트 정의
export const colorVars = createThemeContract(lightColors);

// 기본 라이트 테마 (:root에 전역 바인딩)
createGlobalTheme(":root", colorVars, lightColors);

// 다크 테마 클래스 (수동 클래스 토글용)
export const darkThemeClass = createTheme(colorVars, darkColors);

// OS 시스템 설정 다크모드 자동 대응
globalStyle("@media (prefers-color-scheme: dark)", {
  vars: assignVars(colorVars, darkColors),
});

// HTML data-theme="dark" 속성 지원
globalStyle("[data-theme='dark']", {
  vars: assignVars(colorVars, darkColors),
});

// 전체 디자인 토큰 통합 export
export const vars = {
  color: colorVars,
  space,
  radii,
  fontSize: fontSizes,
  fontWeight: fontWeights,
  lineHeight: lineHeights,
} as const;
