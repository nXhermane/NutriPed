import { Platform } from "react-native";
import {
  moderateScale,
  scale,
  mvs,
  verticalScale,
  ImageStyle,
} from "react-native-size-matters";

export const isMobile = Platform.OS === "android" || Platform.OS === "ios";

const ms = (x: number, webValue: number) => {
  return isMobile ? scale(x) + "px" : `${webValue}rem`;
};
export const msPx = (x: number) => {
  return isMobile ? scale(x) + "px" : `${x}px`;
};
const s = (x: number, webValue: number) => {
  return isMobile ? scale(x) + "px" : `${webValue}rem`;
};
export const sPx = (x: number): `${number}px` => {
  return isMobile ? `${scale(x)}px` : `${x}px`;
};
export function rnS(x: number) {
  return scale(x);
}
export function rnVs(y: number) {
  return verticalScale(y);
}

const vs = (y: number, webValue: number) => {
  return isMobile ? verticalScale(y) + "px" : `${webValue}rem`;
};
export const vsPx = (y: number) => {
  return isMobile ? verticalScale(y) + "px" : `${y}px`;
};
const scalingPoints = {
  "--fs-xs": ms(12, 0.75),
  "--lh-xs": ms(16, 1),

  "--fs-sm": ms(14, 0.875),
  "--lh-sm": ms(20, 1.25),

  "--fs-base": ms(16, 1),
  "--lh-base": ms(24, 1.5),

  "--fs-lg": ms(18, 1.25),
  "--lh-lg": ms(28, 1.75),

  "--fs-xl": ms(20, 1.25),
  "--lh-xl": ms(28, 1.75),

  "--fs-2xl": ms(24, 1.5),
  "--lh-2xl": ms(32, 2),

  "--fs-3xl": ms(30, 1.875),
  "--lh-3xl": ms(36, 2.25),

  "--fs-4xl": ms(36, 2.25),
  "--lh-4xl": ms(40, 2.5),

  "--fs-5xl": ms(48, 3),
  "--lh-5xl": ms(48, 3),

  "--fs-6xl": ms(60, 3.75),
  "--lh-6xl": ms(60, 3.75),

  "--spacing-0": s(0, 0),
  "--spacing-1": s(4, 0.25),
  "--spacing-2": s(8, 0.5),
  "--spacing-3": s(12, 0.75),
  "--spacing-4": s(16, 1),
  "--spacing-5": s(20, 1.25),
  "--spacing-6": s(24, 1.5),
  "--spacing-7": s(28, 1.75),
  "--spacing-8": s(32, 2),
  "--spacing-9": s(36, 2.25),
  "--spacing-10": s(40, 2.5),
  "--spacing-11": s(44, 2.75),
  "--spacing-12": s(48, 3),
  "--spacing-14": s(56, 3.5),
  "--spacing-16": s(64, 4),
  "--spacing-20": s(80, 5),
  "--spacing-24": s(96, 6),
  "--spacing-22": s(100, 6.25),
  "--spacing-28": s(112, 7),
  "--spacing-32": s(128, 8),
  "--spacing-36": s(144, 9),
  "--spacing-40": s(160, 10),
  "--spacing-44": s(176, 11),
  "--spacing-48": s(192, 12),
  "--spacing-52": s(208, 13),
  "--spacing-56": s(224, 14),
  "--spacing-60": s(240, 15),
  "--spacing-64": s(256, 16),
  "--spacing-72": s(288, 18),
  "--spacing-80": s(320, 20),
  "--spacing-96": s(384, 24),
  "--border-radius-xs": s(4, 0.25),
  "--border-radius-sm": s(6, 0.375),
  "--border-radius-base": s(8, 0.5),
  "--border-radius-lg": s(12, 0.75),
  "--border-radius-xl": s(16, 1),
  "--border-radius-2xl": s(24, 1.5),
  "--border-radius-3xl": s(32, 2),
  "--border-radius-full": s(9999, 62.5),
  "--border-width-xs": s(1, 0.0625),
  "--border-width-sm": s(2, 0.125),
  "--border-width-base": s(3, 0.1875),
  "--border-width-lg": s(4, 0.25),
  "--border-width-xl": s(6, 0.375),
  "--border-width-2xl": s(8, 0.5),
  "--border-width-3xl": s(12, 0.75),
  "--border-width-4xl": s(16, 1),
  "--border-width-5xl": s(20, 1.25),
  "--shadow-xs": s(1, 0.0625),
  "--shadow-sm": s(2, 0.125),
  "--shadow-base": s(3, 0.1875),
  "--shadow-lg": s(4, 0.25),
  "--shadow-xl": s(6, 0.375),
  "--shadow-2xl": s(8, 0.5),
  "--shadow-3xl": s(12, 0.75),
  "--shadow-4xl": s(16, 1),
  "--shadow-5xl": s(20, 1.25),
  "--v-spacing-0": vs(0, 0),
  "--v-spacing-1": vs(4, 0.25),
  "--v-spacing-2": vs(8, 0.5),
  "--v-spacing-3": vs(12, 0.75),
  "--v-spacing-4": vs(16, 1),
  "--v-spacing-5": vs(20, 1.25),
  "--v-spacing-6": vs(24, 1.5),
  "--v-spacing-7": vs(28, 1.75),
  "--v-spacing-8": vs(32, 2),
  "--v-spacing-9": vs(36, 2.25),
  "--v-spacing-10": vs(40, 2.5),
  "--v-spacing-11": vs(44, 2.75),
  "--v-spacing-12": vs(48, 3),
  "--v-spacing-14": vs(56, 3.5),
  "--v-spacing-16": vs(64, 4),
  "--v-spacing-20": vs(80, 5),
  "--v-spacing-24": vs(96, 6),
  "--v-spacing-22": vs(100, 6.25),
  "--v-spacing-28": vs(112, 7),
  "--v-spacing-32": vs(128, 8),
  "--v-spacing-36": vs(144, 9),
  "--v-spacing-40": vs(160, 10),
  "--v-spacing-44": vs(176, 11),
  "--v-spacing-48": vs(192, 12),
  "--v-spacing-52": vs(208, 13),
  "--v-spacing-56": vs(224, 14),
  "--v-spacing-60": vs(240, 15),
  "--v-spacing-64": vs(256, 16),
  "--v-spacing-72": vs(288, 18),
  "--v-spacing-80": vs(320, 20),
  "--v-spacing-96": vs(384, 24),
};

export default scalingPoints;
