# 🧩 COMPONENTS DIRECTORY

This folder contains all UI and feature components for Vantage Lane.

## 📂 Structure

- **`ui/`** → Atomic, visual-only elements (no business logic)
- **`shared/`** → Small reusable UI blocks with light logic
- **`features/`** → Domain-specific modules (booking, account, etc.)
- **`layout/`** → Global structure (navbar, footer)
- **`forms/`** → Form-related components
- **`providers/`** → Global context providers
- **`mobile/`** → Components specific to mobile UX

## 🆕 Adding a New Component

### 1. **Determine Component Type**

- **Atomic (`ui/`)**: Pure UI with no business logic
- **Shared (`shared/`)**: Reusable with light logic
- **Feature (`features/`)**: Domain-specific with complex logic

### 2. **Create Component File**

```typescript
// Example: src/components/ui/button.tsx
'use client'

import { cn } from '@/lib/utils/cn'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  children: React.ReactNode
  onClick?: () => void
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  onClick
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-lg font-medium transition-colors',
        {
          'bg-primary text-white hover:bg-primary/90': variant === 'primary',
          'bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground': variant === 'outline',
        },
        {
          'h-8 px-3 text-sm': size === 'sm',
          'h-10 px-4': size === 'md',
          'h-12 px-6 text-lg': size === 'lg',
        },
        className
      )}
    >
      {children}
    </button>
  )
}
```

### 3. **Add to Index File**

```typescript
// src/components/ui/index.ts
export { Button } from './button';
export { Card } from './card';
export { Input } from './input';
// ... other exports
```

### 4. **Test Component**

Create a temporary page to test the component in isolation.

## 🎯 Component Guidelines

### **Props Naming**

- Use descriptive names: `isLoading` not `loading`
- Boolean props: prefix with `is`, `has`, `can`, `should`
- Event handlers: prefix with `on` (`onClick`, `onSubmit`)

### **Styling**

- Use Tailwind CSS classes
- Use `cn()` helper for conditional classes
- Support theme variants (light/dark)
- No hardcoded colors or sizes

### **Accessibility**

- Add proper `aria-label` for interactive elements
- Use semantic HTML elements
- Support keyboard navigation
- Test with screen readers

### **TypeScript**

- Always define prop interfaces
- Use specific types over `any`
- Export component props types for reuse

## 🔄 Import Hierarchy

```
features/ → can import from ui/, shared/, lib/, types/
shared/   → can import from ui/, lib/, types/
ui/       → can import from lib/utils/ only
layout/   → can import from ui/, shared/, lib/
forms/    → can import from ui/, lib/
```

## 📱 Responsive Design

- Mobile-first approach
- Use Tailwind responsive prefixes
- Consider mobile-specific components in `/mobile/`
- Test on various screen sizes

## 🎨 Theme Support

Every component must support both light and dark themes:

```typescript
// Use theme-aware classes
className = 'bg-background text-foreground border-border';

// Avoid hardcoded colors
className = 'bg-white text-black'; // ❌
```
