# 💅 UI COMPONENTS – ATOMIC DESIGN

Rules for components in this folder:

## 🎯 Core Principles

- **Must be pure UI** (no API calls or business logic)
- **Use Tailwind + `cn()`** for styling
- **Props must be typed** with TypeScript interfaces
- **Keep visual consistency** across light/dark themes
- **Components can import from `/lib/utils/`** but never from `/features/`

## 🧩 Atomic Design Rules

### **What Belongs Here:**

- Basic form elements (Button, Input, Select)
- Layout primitives (Card, Container, Grid)
- Navigation elements (Tabs, Breadcrumb, Menu)
- Feedback components (Badge, Alert, Toast)
- Data display (Table, List, Avatar)

### **What Doesn't Belong Here:**

- Business logic components (BookingCard, PricingTable)
- API-connected components (UserProfile, BookingList)
- Feature-specific components (PaymentForm, SearchResults)

## 📝 Component Template

```typescript
'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'

// Always define props interface
interface ComponentNameProps {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  children?: React.ReactNode
  // Add other props as needed
}

// Use forwardRef for components that need ref
export const ComponentName = forwardRef<
  HTMLDivElement, // Replace with appropriate HTML element type
  ComponentNameProps
>(({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        // Base styles
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        // Variant styles
        {
          'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'primary',
          'bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
          'border border-input hover:bg-accent hover:text-accent-foreground': variant === 'outline',
        },
        // Size styles
        {
          'h-8 px-3 text-sm': size === 'sm',
          'h-10 px-4': size === 'md',
          'h-12 px-6': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

ComponentName.displayName = 'ComponentName'
```

## 🎨 Styling Guidelines

### **Use Theme Colors**

```typescript
// ✅ Good - uses theme variables
className = 'bg-background text-foreground border-border';

// ❌ Bad - hardcoded colors
className = 'bg-white text-black border-gray-200';
```

### **Support Dark Mode**

```typescript
// ✅ Automatic theme support
className = 'bg-card text-card-foreground';

// ❌ Manual dark mode (avoid unless necessary)
className = 'bg-white dark:bg-gray-900';
```

### **Use Semantic Spacing**

```typescript
// ✅ Consistent spacing
className = 'p-4 m-2 gap-3';

// ❌ Random spacing
className = 'p-[13px] m-[7px] gap-[11px]';
```

## ♿ Accessibility Requirements

### **Interactive Elements**

```typescript
// Add proper ARIA labels
<button aria-label="Close dialog">
  <X className="h-4 w-4" />
</button>

// Support keyboard navigation
<div role="button" tabIndex={0} onKeyDown={handleKeyDown}>
```

### **Form Elements**

```typescript
// Associate labels with inputs
<label htmlFor="email">Email</label>
<input id="email" type="email" />

// Provide error states
<input aria-invalid={hasError} aria-describedby="error-message" />
{hasError && <div id="error-message">Error description</div>}
```

## 📏 Size & Variant Patterns

### **Standard Size System**

```typescript
interface SizeProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  xs: 'h-6 px-2 text-xs',
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-base',
  lg: 'h-12 px-6 text-lg',
  xl: 'h-14 px-8 text-xl',
};
```

### **Standard Variant System**

```typescript
interface VariantProps {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
}

const variantClasses = {
  default: 'bg-background text-foreground',
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
};
```

## 🧪 Testing Atomic Components

- Test all variants and sizes
- Test with different content lengths
- Test keyboard navigation
- Test theme switching
- Test responsive behavior

## 📦 Export Pattern

```typescript
// src/components/ui/index.ts
export { Button } from './button';
export { Card, CardHeader, CardTitle, CardContent } from './card';
export { Input } from './input';
export { Label } from './label';
// ... other exports

// Export types for external use
export type { ButtonProps } from './button';
export type { CardProps } from './card';
```
