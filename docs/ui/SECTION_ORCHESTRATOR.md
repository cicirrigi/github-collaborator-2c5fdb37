# 🎭 Section Orchestrator – Global Section Wrapper

## Purpose

Provides consistent spacing, container alignment, and background management across all page sections. Eliminates code repetition and ensures visual consistency throughout the application.

## Props

| Prop            | Type                                            | Default     | Description                                                   |
| --------------- | ----------------------------------------------- | ----------- | ------------------------------------------------------------- |
| `id`            | `string`                                        | –           | HTML id for navigation anchors                                |
| `spacing`       | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'` | `'lg'`      | Vertical padding from layout tokens                           |
| `variant`       | `'default' \| 'compact' \| 'spacious'`          | `'default'` | Auto-adjusts spacing (compact=sm, spacious=xl)                |
| `background`    | `BackgroundPreset`                              | –           | Background preset: `luxury`, `darkGlass`, `cta`, `hero`, etc. |
| `containerSize` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'`        | `'xl'`      | Max width container                                           |
| `noContainer`   | `boolean`                                       | `false`     | Disable container wrapper                                     |
| `relative`      | `boolean`                                       | `true`      | Keeps positioning relative                                    |
| `className`     | `string`                                        | –           | Additional CSS classes                                        |

## Design Tokens Used

- **Spacing**: `layoutTokens.sectionSpacing` (xs: 2rem → 2xl: 10rem)
- **Backgrounds**: `backgroundPresets` (luxury, darkGlass, cta, hero, neutral)
- **Containers**: Standard Tailwind container sizes

## Usage Examples

### Basic Section

```tsx
<SectionOrchestrator spacing='lg'>
  <motion.div>...</motion.div>
</SectionOrchestrator>
```

### Hero Section

```tsx
<SectionOrchestrator background='hero' spacing='xl' noContainer>
  <div className='flex items-center min-h-screen'>{/* Hero content */}</div>
</SectionOrchestrator>
```

### CTA Section

```tsx
<SectionOrchestrator background='cta' variant='compact'>
  <motion.div className='text-center'>
    <h2>Ready to Experience Luxury?</h2>
    <Button>Book Now</Button>
  </motion.div>
</SectionOrchestrator>
```

### Custom Background

```tsx
<SectionOrchestrator background='darkGlass' containerSize='lg'>
  <TestimonialsCarousel />
</SectionOrchestrator>
```

## Integration Benefits

- **Zero repetition**: No more manual `<section>` + `<Container>` patterns
- **Consistent spacing**: All sections use same vertical rhythm
- **Theme-aware**: Backgrounds respond to dark/light mode
- **Type-safe**: All props are strongly typed
- **Extensible**: Easy to add new variants and backgrounds

## Architecture

```
SectionOrchestrator
├── Background (optional preset)
├── Container (optional, configurable size)
└── Children (your content)
```

## Best Practices

1. **Use variants for consistency**: `compact`, `spacious` instead of manual spacing
2. **Choose appropriate backgrounds**: `hero` for headers, `cta` for call-to-actions
3. **Disable container when needed**: Use `noContainer` for full-width content
4. **Combine with animations**: Works seamlessly with Framer Motion
