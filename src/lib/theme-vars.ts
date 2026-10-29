import type { ThemeTokens } from "./types";

export interface ThemeVars {
  brand: string;
  brandRgb: string;
  onBrand: string;
  paper: string;
  paperRgb: string;
  ink: string;
  inkRgb: string;
  accent: string;
  accentRgb: string;
}

const DEFAULTS = { primary: "#14532d", surface: "#f6f3ec", ink: "#1c1917", accent: "#8a6a32" };

function validHex(value: string | undefined | null): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  return /^#[0-9a-fA-F]{6}$/.test(trimmed) ? trimmed.toLowerCase() : null;
}

function hexToRgb(hex: string): string {
  const num = Number.parseInt(hex.slice(1), 16);
  return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
}

function linearize(value: number): number {
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const r = linearize(Number.parseInt(hex.slice(1, 3), 16) / 255);
  const g = linearize(Number.parseInt(hex.slice(3, 5), 16) / 255);
  const b = linearize(Number.parseInt(hex.slice(5, 7), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(fg: string, bg: string): number {
  const l1 = luminance(fg);
  const l2 = luminance(bg);
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

function readableOn(bg: string): "#111111" | "#ffffff" {
  const white = contrastRatio("#ffffff", bg);
  const ink = contrastRatio("#111111", bg);
  if (white >= 4.5 && white >= ink) return "#ffffff";
  if (ink >= 4.5) return "#111111";
  return white >= ink ? "#ffffff" : "#111111";
}

/** Same resolution on server (layout) and client (ThemeSync) so a re-apply never shifts colors. */
export function resolveThemeVars(theme?: Partial<ThemeTokens> | null): ThemeVars {
  const brand = validHex(theme?.primary) ?? DEFAULTS.primary;
  const paper = validHex(theme?.surface) ?? DEFAULTS.surface;
  const ink = validHex(theme?.ink) ?? DEFAULTS.ink;
  const accent = validHex(theme?.accent) ?? DEFAULTS.accent;
  return {
    brand,
    brandRgb: hexToRgb(brand),
    onBrand: validHex(theme?.onPrimary) ?? readableOn(brand),
    paper,
    paperRgb: hexToRgb(paper),
    ink,
    inkRgb: hexToRgb(ink),
    accent,
    accentRgb: hexToRgb(accent),
  };
}

export function hasThemePrimary(theme?: Partial<ThemeTokens> | null): boolean {
  return validHex(theme?.primary) !== null;
}

export function themeKey(vars: ThemeVars): string {
  return [vars.brand, vars.onBrand, vars.paper, vars.ink, vars.accent].join("|");
}

export function themeStyle(vars: ThemeVars): Record<string, string> {
  return {
    "--brand": vars.brand,
    "--brand-rgb": vars.brandRgb,
    "--on-brand": vars.onBrand,
    "--paper": vars.paper,
    "--paper-rgb": vars.paperRgb,
    "--ink": vars.ink,
    "--ink-rgb": vars.inkRgb,
    "--accent": vars.accent,
    "--accent-rgb": vars.accentRgb,
  };
}

export function themeCss(vars: ThemeVars): string {
  const decls = Object.entries(themeStyle(vars))
    .map(([name, value]) => `${name}:${value}`)
    .join(";");
  return `:root{color-scheme:light;${decls};--card:#fffdf8;--card-rgb:255, 253, 248;}`;
}
