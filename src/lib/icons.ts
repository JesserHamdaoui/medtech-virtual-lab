// Icon size constants
export const ICON_SIZES = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  "2xl": 40,
  "3xl": 48,
} as const;

export type IconSize = keyof typeof ICON_SIZES;

// Common icon props interface
export interface IconProps {
  size?: IconSize | number;
  className?: string;
}

// Helper function to get icon size
export const getIconSize = (size: IconSize | number): number => {
  if (typeof size === "number") return size;
  return ICON_SIZES[size];
};
