# InfiniteMovingCards

## Overview

A React component that displays an infinite scrolling carousel of cards with customizable animation direction and speed.

## Features

- ✅ Infinite horizontal scrolling animation
- ✅ Configurable direction (left/right)
- ✅ Variable speed settings (fast/normal/slow)
- ✅ Pause on hover functionality
- ✅ Dark mode support
- ✅ Fully responsive design
- ✅ TypeScript support with exported props interface

## Usage

### Basic Example

```tsx
import { InfiniteMovingCards } from '@/components/ui';

const testimonials = [
  {
    quote: 'Amazing service!',
    name: 'John Doe',
    title: 'CEO, Company',
  },
];

<InfiniteMovingCards items={testimonials} direction='right' speed='slow' />;
```

### With Custom Styling

```tsx
<InfiniteMovingCards
  items={testimonials}
  direction='left'
  speed='fast'
  pauseOnHover={false}
  className='my-custom-class'
/>
```

## Props

| Prop           | Type                                                  | Default     | Description                         |
| -------------- | ----------------------------------------------------- | ----------- | ----------------------------------- |
| `items`        | `Array<{quote: string, name: string, title: string}>` | required    | Array of testimonial objects        |
| `direction`    | `"left" \| "right"`                                   | `"left"`    | Animation scroll direction          |
| `speed`        | `"fast" \| "normal" \| "slow"`                        | `"fast"`    | Animation speed                     |
| `pauseOnHover` | `boolean`                                             | `true`      | Whether to pause animation on hover |
| `className`    | `string`                                              | `undefined` | Additional CSS classes              |

## Styling

Component uses its own CSS file: `src/styles/infinite-moving-cards.css`
Follows design system theme variables for colors and spacing.

## Best Practices

- Use max 6-8 testimonials for optimal performance
- Keep quote text concise (under 200 characters)
- Ensure proper contrast for accessibility
- Test with different screen sizes

## Related Components

- `LuxuryCard` - For static content cards
- `Badge` - For status indicators in cards
