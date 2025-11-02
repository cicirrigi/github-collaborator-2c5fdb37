/**
 * 🎨 Footer Icon - Semantic Icon Mapping
 *
 * Maps semantic icon names to Lucide React icons.
 * Prevents hardcoding and allows easy icon changes.
 */

import type React from 'react';
import {
  Info,
  BookOpen,
  Briefcase,
  Newspaper,
  Car,
  Plane,
  Building2,
  CalendarHeart,
  Mail,
  HelpCircle,
  CalendarCheck,
  MapPin,
  ShieldCheck,
  FileText,
  Cookie,
  Lock,
  Instagram,
  Linkedin,
  Twitter,
  Facebook,
  Clock,
  Crown,
  Users,
  Handshake,
  type LucideIcon,
} from 'lucide-react';

// Semantic icon mapping
const iconMap: Record<string, LucideIcon> = {
  // Company icons
  info: Info,
  'book-open': BookOpen,
  briefcase: Briefcase,
  newspaper: Newspaper,
  users: Users,
  handshake: Handshake,

  // Services icons
  car: Car,
  plane: Plane,
  'building-2': Building2,
  'calendar-heart': CalendarHeart,
  clock: Clock,
  crown: Crown,

  // Support icons
  mail: Mail,
  'help-circle': HelpCircle,
  'calendar-check': CalendarCheck,
  'map-pin': MapPin,

  // Legal icons
  'shield-check': ShieldCheck,
  'file-text': FileText,
  cookie: Cookie,
  lock: Lock,

  // Social icons
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
  facebook: Facebook,
} as const;

export interface FooterIconProps {
  /** Semantic icon name */
  readonly name: string;
  /** Icon size */
  readonly size?: number;
  /** Custom className */
  readonly className?: string;
  /** Custom color style */
  readonly style?: React.CSSProperties;
}

/**
 * 🎯 Footer Icon Component
 * Renders semantic icons with consistent sizing
 */
export function FooterIcon({
  name,
  size = 18,
  className = '',
  style,
}: FooterIconProps): React.JSX.Element {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    // TODO: Add proper error logging system
    return <div className={`w-[${size}px] h-[${size}px] ${className}`} style={style} />;
  }

  return <IconComponent size={size} className={className} style={style} />;
}

export default FooterIcon;
