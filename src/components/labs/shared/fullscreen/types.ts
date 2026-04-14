import { Context } from "react";

export interface FullscreenContextValue {
  element?: HTMLElement | null;
  isFullscreen: boolean;
  enterFullscreen: (element?: HTMLElement) => void;
  exitFullscreen: () => void;
  toggleFullscreen: (element?: HTMLElement) => void;
}

export type FullscreenContextType = Context<FullscreenContextValue>;

export interface WebkitElement extends HTMLElement {
  webkitRequestFullscreen(): Promise<void> | void;
}

export interface MozElement extends HTMLElement {
  mozRequestFullScreen(): Promise<void> | void;
}

export interface MSElement extends HTMLElement {
  msRequestFullscreen(): Promise<void> | void;
}

export interface WebkitDocument extends Document {
  webkitExitFullscreen(): Promise<void> | void;
}

export interface MozDocument extends Document {
  mozCancelFullScreen(): Promise<void> | void;
}

export interface MSDocument extends Document {
  msExitFullscreen(): Promise<void> | void;
}
