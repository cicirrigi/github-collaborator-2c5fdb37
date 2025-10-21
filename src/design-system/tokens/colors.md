# 🎨 Colors Design Tokens

Color system for Vantage Lane 2.0 using HSL format for better control and accessibility.

## 🏆 Brand Colors

```typescript
import { colors } from '@/design-system/tokens/colors'

// Primary brand gold system (50-900 scale)
colors.brand.primary[500]  // 'hsl(45, 35%, 60%)' - Main brand color
colors.brand.primary[600]  // 'hsl(45, 35%, 50%)' - Hover state
colors.brand.secondary.DEFAULT  // 'hsl(48, 50%, 70%)' - Light accent

// Usage examples:
<Button className="bg-brand-primary-500 hover:bg-brand-primary-600" />
```

## 🥇 Tier Colors

```typescript
// Customer tier system
colors.tier.bronze; // 'hsl(30, 50%, 40%)'
colors.tier.silver; // 'hsl(0, 0%, 75%)'
colors.tier.gold; // 'hsl(51, 100%, 50%)'
colors.tier.platinum; // 'hsl(0, 0%, 90%)'
colors.tier.elite; // 'hsl(45, 35%, 60%)' - Same as primary
```

## ✅ Semantic Colors

```typescript
// Success, warning, error, info with 50/500/700 scale
colors.semantic.success[500]; // 'hsl(142, 71%, 45%)'
colors.semantic.warning[500]; // 'hsl(38, 92%, 50%)'
colors.semantic.error[500]; // 'hsl(0, 84%, 60%)'
colors.semantic.info[500]; // 'hsl(217, 91%, 60%)'
```

## ⚫ Neutral Colors

```typescript
// Complete neutral system (50-950 scale)
colors.neutral[50]; // 'hsl(0, 0%, 98%)' - Pure white
colors.neutral[900]; // 'hsl(0, 0%, 10%)' - Dark background
colors.neutral[950]; // 'hsl(0, 0%, 4%)' - Deep black
```

## 🚀 Usage Guidelines

1. **Use HSL format** from tokens, never hardcode hex values
2. **Import specific colors** you need: `import { colors } from '@/design-system/tokens/colors'`
3. **Follow semantic naming** - use `success` for positive actions, `error` for negative
4. **Dark theme ready** - neutral colors work for both light and dark themes

## 🔗 Related

- [Theme Configuration](../../config/theme.config.md)
- [LuxuryCard Tokens](./luxury-card.md)
- [Design System Overview](../../../docs/DESIGN_SYSTEM_GUIDE.md)
