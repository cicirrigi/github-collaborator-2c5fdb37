# PinContainer

## Overview

A React component that creates 3D pin-board style cards with perspective effects and hover animations.

## Features

- ✅ 3D perspective and rotation effects
- ✅ Hover animations with scale and tilt
- ✅ Optional click-to-navigate functionality
- ✅ Built-in perspective overlay animations
- ✅ TypeScript support with forwardRef
- ✅ Size and variant system
- ✅ Follows UI library standards

## Usage

### Basic Example

```tsx
import { PinContainer } from '@/components/ui';
<PinContainer title='My Card' href='https://example.com'>
  <div className='p-4'>
    <h3>Card Content</h3>
    <p>Your content here</p>
  </div>
</PinContainer>;
```

### With Custom Styling

```tsx
<PinContainer
  title='Custom Card'
  size='lg'
  variant='minimal'
  className='custom-content'
  containerClassName='custom-container'
>
  <YourCustomContent />
</PinContainer>
```

## Props

| Prop                 | Type                     | Default     | Description                       |
| -------------------- | ------------------------ | ----------- | --------------------------------- |
| `children`           | `React.ReactNode`        | required    | Content to display in the card    |
| `title`              | `string`                 | `undefined` | Title for the perspective overlay |
| `href`               | `string`                 | `undefined` | URL to navigate to on click       |
| `size`               | `"sm" \| "md" \| "lg"`   | `"md"`      | Size variant                      |
| `variant`            | `"default" \| "minimal"` | `"default"` | Visual variant                    |
| `className`          | `string`                 | `undefined` | Additional classes for content    |
| `containerClassName` | `string`                 | `undefined` | Additional classes for container  |

## Styling

- Uses inline Tailwind classes for 3D effects
- Supports light/dark themes automatically
- Customizable via className props
- Follows design system spacing and colors

## Best Practices

- Keep content concise for best visual impact
- Use appropriate size for your layout
- Consider hover area for mobile devices
- Test 3D effects across browsers

## Related Components

- `Card` - For standard 2D cards
- `LuxuryCard` - For premium static cards
