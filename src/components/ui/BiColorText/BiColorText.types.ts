/**
 * 🎨 BiColorText Component Types
 * Type definitions for bi-color text component
 */


export interface BiColorTextProps {
  /** First part of text (primary color) */
  firstText: string;
  
  /** Second part of text (accent color) */
  secondText: string;
  
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  
  /** Font weight */
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  
  /** Text alignment */
  align?: 'left' | 'center' | 'right';
  
  /** Custom className */
  className?: string;
  
  /** Custom primary color (defaults to theme primary) */
  primaryColor?: string;
  
  /** Custom accent color (defaults to theme accent/gold) */
  accentColor?: string;
  
  /** HTML element to render as */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
}

export type BiColorTextSize = NonNullable<BiColorTextProps['size']>;
export type BiColorTextWeight = NonNullable<BiColorTextProps['weight']>;
export type BiColorTextAlign = NonNullable<BiColorTextProps['align']>;
export type BiColorTextElement = NonNullable<BiColorTextProps['as']>;
