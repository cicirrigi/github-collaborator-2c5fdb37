export type Orientation = 'vertical' | 'horizontal';

export interface DockConfig {
  orientation?: Orientation;
  maxScale?: number;
  influenceDistance?: number;
}
