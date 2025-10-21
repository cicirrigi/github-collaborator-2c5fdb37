# 🎨 Global Styles - Vantage Lane 2.0

This directory contains global CSS styles and animations for the Vantage Lane 2.0 project.

## 📁 Files Overview

### `globals.css`

Main global stylesheet containing luxury animations and effects:

#### 🏷️ Available Classes:

**Logo Animations:**

- `.animate-luxuryFloat` - Luxury floating animation with breathing scale effect
- `.animate-logoShimmer` - Premium shimmer sweep effect for silky brand feel

**Backdrop Effects:**

- `.navbar-backdrop` - Enhanced backdrop blur support for modern browsers

## ✨ Animation Details

### Luxury Float Animation

```css
@keyframes luxuryFloat {
  0%,
  100% {
    transform: translateY(0px) scale(1);
    filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.4));
  }
  50% {
    transform: translateY(-2px) scale(1.03);
    filter: drop-shadow(0 4px 16px rgba(251, 191, 36, 0.6));
  }
}
```

**Features:**

- 5-second infinite ease-in-out loop
- Subtle vertical float (-2px)
- Breathing scale effect (1.03x)
- Dynamic golden drop-shadow that intensifies

### Shimmer Sweep Effect

```css
@keyframes shimmerSweep {
  0%,
  95%,
  100% {
    opacity: 0;
    transform: translateX(-100%);
  }
  45%,
  55% {
    opacity: 0.25;
    transform: translateX(100%);
  }
}
```

**Features:**

- 6-second interval shimmer sweep
- Subtle light reflection effect
- Perfect for high-end brand elements
- Auto-applies via `.animate-logoShimmer`

## 🎯 Usage Examples

### Basic Logo with Float

```tsx
<div className='animate-luxuryFloat'>
  <Image src='/logo.svg' alt='Logo' width={64} height={64} />
</div>
```

### Premium Logo with Shimmer

```tsx
<div className='animate-luxuryFloat animate-logoShimmer'>
  <Image src='/logo.svg' alt='Logo' width={64} height={64} />
</div>
```

### Navbar with Backdrop

```tsx
<nav className='navbar-backdrop bg-background/30'>{/* Navigation content */}</nav>
```

## 🎨 Design Philosophy

These animations follow luxury automotive and high-end tech brand principles:

- **Subtle movement** - Never distracting, always elegant
- **Premium materials** - Golden accents and glass morphism
- **Smooth timing** - Organic ease-in-out curves
- **Brand reinforcement** - Every animation strengthens brand perception

## 🔧 Performance Notes

- All animations use `transform` and `filter` properties for GPU acceleration
- `will-change` is automatically applied by browser optimization
- Animations respect `prefers-reduced-motion` media query
- Minimal impact on layout thrashing

## 📱 Browser Support

- **Modern browsers:** Full support with hardware acceleration
- **Older browsers:** Graceful degradation without animations
- **Mobile:** Optimized for touch devices and battery life
