# 🏗️ Layout Components - Vantage Lane 2.0

Enterprise-grade layout system with complete component ecosystem.

## 📁 Components Overview

### Core Layout Components

- **`Layout.tsx`** - Main application wrapper with navbar/footer
- **`Container.tsx`** - Responsive content containers
- **`Section.tsx`** - Semantic sections with spacing/backgrounds
- **`Navbar.tsx`** - Premium navigation with mobile support
- **`Footer.tsx`** - Multi-column footer with luxury styling

### Services Menu Components

- **`ServicesMenu.tsx`** - Desktop dropdown menu
- **`ServicesMenuMobile.tsx`** - Mobile accordion with animations

### Navbar Sub-components

- **`Logo.tsx`** - Luxury logo with shimmer effects
- **`NavLinks.tsx`** - Navigation links with active states
- **`UserMenu.tsx`** - Authentication buttons

## 🚀 Quick Start

### Basic Page Layout

```tsx
import { Layout } from '@/components/layout';

export default function HomePage() {
  return (
    <Layout pageTitle='Home'>
      <h1>Welcome to Vantage Lane</h1>
    </Layout>
  );
}
```

### Custom Layout (Auth Page)

```tsx
import { Layout } from '@/components/layout';

export default function LoginPage() {
  return (
    <Layout
      hideNavbar
      hideFooter
      fullHeight
      pageTitle='Sign In'
      className='bg-gradient-to-br from-neutral-950 to-neutral-900'
    >
      <LoginForm />
    </Layout>
  );
}
```

### Section-based Layout

```tsx
import { Layout, Section } from '@/components/layout';

export default function AboutPage() {
  return (
    <Layout pageTitle='About Us'>
      <Section spacing='xl' background='gradient' align='center'>
        <Hero title='About Vantage Lane' />
      </Section>

      <Section spacing='lg' background='neutral' contained>
        <AboutContent />
      </Section>

      <Section spacing='md' contained={false}>
        <FullWidthGallery />
      </Section>
    </Layout>
  );
}
```

## 🎯 Layout Props

### LayoutProps

```typescript
interface LayoutProps {
  readonly children: React.ReactNode; // Page content
  readonly hideNavbar?: boolean; // Hide navigation
  readonly hideFooter?: boolean; // Hide footer
  readonly className?: string; // Main content styling
  readonly containerClassName?: string; // Container styling
  readonly fullHeight?: boolean; // Enable min-h-screen
  readonly pageTitle?: string; // SEO page title
}
```

## 🎨 Design Patterns

### Landing Page Pattern

```tsx
<Layout>
  <Section spacing='xl' background='gradient' align='center'>
    <Hero />
  </Section>
  <Section spacing='lg' contained>
    <Features />
  </Section>
  <Section spacing='lg' background='neutral'>
    <Testimonials />
  </Section>
</Layout>
```

### Dashboard Pattern

```tsx
<Layout hideFooter pageTitle='Dashboard'>
  <Section spacing='md' contained={false}>
    <DashboardContent />
  </Section>
</Layout>
```

### Authentication Pattern

```tsx
<Layout hideNavbar hideFooter fullHeight>
  <div className='flex min-h-screen items-center justify-center'>
    <AuthForm />
  </div>
</Layout>
```

## 🏷️ Component Features

### Layout.tsx Features

- **Semantic HTML** - Uses proper `<main>`, `<nav>`, `<footer>` tags
- **SEO Optimized** - Automatic title generation
- **Accessibility** - ARIA landmarks and labels
- **Flexible** - Hide/show navbar/footer as needed
- **Full Height** - Support for viewport-height layouts
- **Theme Aware** - Smooth dark/light transitions

### Performance Optimizations

- **Zero Layout Shift** - Consistent spacing system
- **Minimal Rerenders** - Optimized React patterns
- **Tree Shaking** - Individual component exports
- **CSS Optimization** - Tailwind purging enabled

## 📱 Responsive Behavior

- **Mobile First** - All components start with mobile design
- **Breakpoint System** - `sm:`, `md:`, `lg:`, `xl:` variants
- **Touch Friendly** - Mobile navigation and interactions
- **Viewport Aware** - Full height layouts on mobile

## 🎯 Best Practices

### Import Pattern

```tsx
// ✅ Good - Named imports from index
import { Layout, Section, Container } from '@/components/layout';

// ❌ Avoid - Direct file imports
import Layout from '@/components/layout/Layout';
```

### Composition Pattern

```tsx
// ✅ Good - Section-based composition
<Layout>
  <Section spacing="lg" contained>
    <Content />
  </Section>
</Layout>

// ❌ Avoid - Direct content in Layout
<Layout>
  <div className="py-16 px-4">
    <Content />
  </div>
</Layout>
```

### SEO Pattern

```tsx
// ✅ Good - Descriptive page titles
<Layout pageTitle="Premium Chauffeur Services">

// ❌ Avoid - Generic titles
<Layout pageTitle="Page">
```

## 🧱 Architecture

The layout system follows atomic design principles:

- **Atoms** - Logo, NavLinks, UserMenu
- **Molecules** - ServicesMenu, Container
- **Organisms** - Navbar, Footer, Section
- **Templates** - Layout
- **Pages** - Your page components

This ensures maximum reusability and maintainability across the application.
