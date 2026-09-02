/**
 * Shared p5 canvas font settings, used by every sim's sketch draw
 * functions so ruler/label text renders identically across labs.
 * p5's textFont() needs a concrete font name (not a full CSS stack),
 * so this uses the generic "monospace" keyword — closest match to
 * the host app's --font-mono without bundling a font file into the
 * canvas.
 */
export const CANVAS_MONO_FONT = "monospace";

/** Standard size for small ruler/axis tick labels drawn on canvas. */
export const CANVAS_LABEL_SIZE = 12;
