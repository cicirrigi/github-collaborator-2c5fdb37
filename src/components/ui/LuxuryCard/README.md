# 🎴 LuxuryCard Component

Reusable luxury card component with shimmer sweep effects, identical to original Vantage Lane design.

## ✨ Features

- **Shimmer sweep effect** - Identical to original design
- **Golden glow hover** - Luxury brand colors
- **Polymorphic** - Can render as any element or component
- **Type-safe** - Full TypeScript support, no `any` types
- **Zero hardcoded values** - All styles from design tokens
- **Hybrid API** - Simple props or flexible children
- **Performance optimized** - CSS-based animations

## 🚀 Usage

### Simple API (Props-based)

```tsx
import { LuxuryCard } from '@/components/ui/LuxuryCard';
import { CarFront } from 'lucide-react';
<LuxuryCard
  variant='shimmer'
  size='md'
  hover='shimmer'
  icon={<CarFront />}
  title='Premium Fleet'
  description='Luxury vehicles available 24/7'
  href='/fleet'
  as={Link}
/>;
```

### Flexible API (Children-based)

```tsx
<LuxuryCard variant='shimmer' hover='glow' as={Link} href='/fleet'>
  <div className='space-y-4'>
    <CarFront className='text-gold mx-auto h-16 w-16' />
    <h3 className='text-xl font-bold'>Custom Layout</h3>
    <p>Full control over content and styling</p>
    <button className='btn-primary'>Action</button>
  </div>
</LuxuryCard>
```

## 🎨 Props

| Prop           | Type                                            | Default                                         | Description                       |
| -------------- | ----------------------------------------------- | ----------------------------------------------- | --------------------------------- |
| `variant`      | `'shimmer' \| 'glow' \| 'minimal' \| 'premium'` | `'shimmer'`                                     | Visual style variant              |
| `size`         | `'sm' \| 'md' \| 'lg' \| 'xl'`                  | `'md'`                                          | Card size                         |
| `hover`        | `'shimmer' \| 'glow' \| 'lift' \| 'none'`       | `'shimmer'`                                     | Hover effect type                 |
| `as`           | `ElementType`                                   | `'div'`                                         | Component or element to render as |
| `glowColor`    | `string`                                        | `designTokens.luxuryCard.colors.goldGlow`       | Custom glow color                 |
| `shimmerColor` | `string`                                        | `designTokens.luxuryCard.colors.shimmerPrimary` | Custom shimmer color              |
| `disabled`     | `boolean`                                       | `false`                                         | Disable hover effects             |
| `icon`         | `ReactNode`                                     | -                                               | Icon element (simple API)         |
| `title`        | `string`                                        | -                                               | Card title (simple API)           |
| `description`  | `string`                                        | -                                               | Card description (simple API)     |
| `footer`       | `ReactNode`                                     | -                                               | Footer content (simple API)       |
| `children`     | `ReactNode`                                     | -                                               | Custom content (flexible API)     |

## 🎯 Variants

- **`shimmer`** - Full shimmer sweep + glow (original Benefits design)
- **`glow`** - Subtle glow effect only
- **`minimal`** - Clean border-only style
- **`premium`** - Enhanced luxury styling

## 📱 Responsive

All variants are fully responsive and work with Vantage Lane's design system.

## 🔧 Customization

Colors can be customized via `glowColor` and `shimmerColor` props or by extending design tokens in `theme.config.ts`.
