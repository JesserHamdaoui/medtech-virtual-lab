// Display configuration
// 250 (not 300 = canvas-height/2) accounts for the Controls bar
// overlaid at the bottom of the 600px canvas (~87px tall), so the
// cord sits near the vertical center of the *visible* area above it.
// Kept as a multiple of PX_PER_CM (50) so ruler labels land on
// whole-number cm marks instead of fractions.
export const FIXED_Y = 250;
export const BALL_RADIUS = 10;
export const BALL_COUNT = 81;
export const BALL_SPACING = 12;

// Physics constants
export const AMPLITUDE_MULTIPLIER = 50;
export const FRAMES_PER_SECOND = 50;

// Reference-line / ruler constants
export const LINE_PROXIMITY_THRESHOLD = 10;
export const DOUBLE_CLICK_DELAY = 300;
export const DASH_PATTERN = [5, 15];
export const RULER_OFFSET = 50;
export const PX_PER_CM = 50;
