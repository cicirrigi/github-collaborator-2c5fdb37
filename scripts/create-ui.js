#!/usr/bin/env node
/**
 * 🧩 Vantage Lane UI Generator v3.0 (Universal Base)
 * - Strict TS in generated files (no any)
 * - ForwardRef + polymorphic `as`
 * - A11y (focus-visible, aria-*), CVA variants
 * - Integrates designTokens + brandConfig
 * - Storybook + jest-axe tests + README
 * - Auto index barrel export
 */

const fs = require('fs').promises;
const path = require('path');

/* ------------------------------- Config --------------------------------- */
const UI_ROOT = path.join(__dirname, '../src/components/ui');
const MAIN_INDEX = path.join(UI_ROOT, 'index.ts');
const CONFIG = {
  version: '3.0.0',
  useCVA: true,
  withStories: true,
  withTests: true,
};

/* ------------------------------ Utilities ------------------------------- */
const exists = async p => {
  try {
    await fs.stat(p);
    return true;
  } catch {
    return false;
  }
};

const nowIso = () => new Date().toISOString();

/* ------------------------------- CLI Parse ------------------------------ */
const [, , rawName, ...flags] = process.argv;
if (!rawName) {
  console.error(
    '❌ Usage: npm run create:ui ComponentName [--type=base|button|card|overlay|input|section|page]'
  );
  process.exit(1);
}
const componentName = rawName.trim();
if (!/^[A-Z][a-zA-Z0-9]*$/.test(componentName)) {
  console.error('❌ Component name must be PascalCase (e.g., PremiumButton, BookingModal)');
  process.exit(1);
}
const typeFlag = flags.find(f => f.startsWith('--type='));
const componentType = (typeFlag ? typeFlag.split('=')[1] : 'base').toLowerCase();

/* ----------------------------- Meta Header ------------------------------ */
const metaHeader = type => `/**
 * 🧩 ${componentName} – Vantage Lane UI v${CONFIG.version}
 * Generated on ${nowIso()}
 * Type: ${type}
 */
`;

/* --------------------------- Template: main.tsx -------------------------- */
const tpl_main_tsx = () => `${metaHeader(componentType)}
'use client';

import React, { forwardRef, type JSX, type ReactNode, type ElementType, type ComponentPropsWithRef } from 'react';
import { cn } from '@/lib/utils/cn';
import { designTokens } from '@/config/design-tokens';
import { brandConfig } from '@/config/brand.config';
${CONFIG.useCVA ? `import { ${componentName}Variants } from './${componentName}.variants';` : ''}

export type ${componentName}Variant = 'default' | 'primary' | 'secondary';
export type ${componentName}Size = 'sm' | 'md' | 'lg';

export interface ${componentName}Props<T extends ElementType = 'div'> extends Omit<ComponentPropsWithRef<T>, 'as' | 'color'> {
  readonly as?: T;
  readonly className?: string;
  readonly children?: ReactNode;
  readonly variant?: ${componentName}Variant;
  readonly size?: ${componentName}Size;
  readonly disabled?: boolean;
  readonly loading?: boolean;
  readonly 'aria-label'?: string;
}

export const ${componentName} = forwardRef<HTMLElement, ${componentName}Props>(
  function ${componentName}<T extends ElementType = 'div'>(
    { as, className, children, variant = 'default', size = 'md', disabled = false, loading = false, 'aria-label': ariaLabel, ...rest }: ${componentName}Props<T>,
    ref
  ): JSX.Element {
    const Comp = (as ?? 'div') as ElementType;

    const classes = ${
      CONFIG.useCVA
        ? `${componentName}Variants({ variant, size, disabled })`
        : `cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300',
          variant === 'primary' && 'bg-[var(--brand-primary)] text-black',
          variant === 'secondary' && 'bg-neutral-100 text-neutral-900 dark:bg-neutral-700 dark:text-white',
          variant === 'default' && 'bg-white text-neutral-900 dark:bg-neutral-800 dark:text-white',
          size === 'sm' && 'px-3 py-2 text-sm',
          size === 'md' && 'px-4 py-2.5 text-base',
          size === 'lg' && 'px-6 py-3 text-lg',
          disabled && 'opacity-50 pointer-events-none',
          loading && 'opacity-75 cursor-wait'
        )`
    };

    return (
      <Comp
        ref={ref}
        type={Comp === 'button' ? 'button' : undefined}
        aria-label={ariaLabel}
        aria-disabled={disabled || loading || undefined}
        aria-busy={loading || undefined}
        role={Comp === 'button' ? 'button' : rest.role}
        tabIndex={disabled || loading ? -1 : (rest.tabIndex || 0)}
        data-variant={variant}
        data-size={size}
        data-loading={loading || undefined}
        className={cn(
          classes,
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50 select-none',
          className
        )}
        {...rest}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {children}
          </span>
        ) : children}
      </Comp>
    );
  }
);

${componentName}.displayName = '${componentName}';
export default ${componentName};
`;

/* ----------------------- Template: variants.ts (CVA) -------------------- */
const tpl_variants_ts = () => `${metaHeader(componentType)}
import { cva } from 'class-variance-authority';

export const ${componentName}Variants = cva(
  [
    'inline-flex items-center justify-center',
    'rounded-lg font-medium transition-all duration-300',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50',
    'select-none'
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'bg-white text-neutral-900 dark:bg-neutral-800 dark:text-white',
        primary: 'bg-[var(--brand-primary)] text-black hover:brightness-110 shadow-lg',
        secondary: 'bg-neutral-100 text-neutral-900 dark:bg-neutral-700 dark:text-white',
      },
      size: {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-2.5 text-base',
        lg: 'px-6 py-3 text-lg',
      },
      disabled: {
        true: 'opacity-50 pointer-events-none',
        false: '',
      },
      loading: {
        true: 'opacity-75 cursor-wait',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      disabled: false,
      loading: false,
    },
  }
);
`;

/* ---------------------------- Template: types.ts ------------------------- */
const tpl_types_ts = () => `${metaHeader(componentType)}
export type ${componentName}Variant = 'default' | 'primary' | 'secondary';
export type ${componentName}Size = 'sm' | 'md' | 'lg';

export interface ${componentName}StyleConfig {
  readonly base: string;
  readonly variants: Record<${componentName}Variant, string>;
  readonly sizes: Record<${componentName}Size, string>;
}
`;

/* --------------------------- Template: index.ts -------------------------- */
const tpl_index_ts = () => `${metaHeader(componentType)}
export { ${componentName} } from './${componentName}';
export { ${componentName}Variants } from './${componentName}.variants';
export type { ${componentName}StyleConfig, ${componentName}Variant, ${componentName}Size } from './${componentName}.types';
`;

/* --------------------------- Template: README.md ------------------------- */
const tpl_readme_md = () => `${metaHeader(componentType)}
# ${componentName}

Generated by **Vantage Lane UI Generator v${CONFIG.version}** · Type: \`${componentType}\` 

- ForwardRef + polymorphic \`as\` 
- CVA variants & sizes (design tokens via CSS variables)
- A11y (focus-visible, aria-*)
- Fully typed (no any)

\`\`\`tsx
import { ${componentName} } from '@/components/ui/${componentName}';

<${componentName} variant="primary" size="md" as="button">
  Action
</${componentName}>
\`\`\`
`;

/* ----------------------- Template: stories.tsx (SB) ---------------------- */
const tpl_story_tsx = () => `${metaHeader(componentType)}
import type { Meta, StoryObj } from '@storybook/react';
import { ${componentName} } from './${componentName}';

const meta: Meta<typeof ${componentName}> = {
  title: 'UI/${componentName}',
  component: ${componentName},
  parameters: {
    docs: { description: { component: 'Generated by Vantage Lane UI generator v${CONFIG.version}.' } },
    controls: { expanded: true },
  },
  argTypes: {
    as: { control: 'select', options: ['div', 'button', 'span', 'section'] },
    variant: { control: 'select', options: ['default', 'primary', 'secondary'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  }
};

export default meta;
type Story = StoryObj<typeof ${componentName}>;

export const Default: Story = { args: { children: '${componentName}', variant: 'default' } };
export const Primary: Story = { args: { children: 'Primary', variant: 'primary' } };
export const Secondary: Story = { args: { children: 'Secondary', variant: 'secondary' } };

export const Loading: Story = { args: { children: 'Loading...', variant: 'primary', loading: true } };
export const Disabled: Story = { args: { children: 'Disabled', variant: 'primary', disabled: true } };

export const AsButton: Story = { 
  args: { 
    as: 'button',
    children: 'Click Me', 
    variant: 'primary',
    onClick: () => alert('Clicked!')
  } 
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <${componentName} size="sm">Small</${componentName}>
      <${componentName} size="md">Medium</${componentName}>
      <${componentName} size="lg">Large</${componentName}>
    </div>
  )
};

export const LoadingStates: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <${componentName} variant="primary" loading>Loading</${componentName}>
      <${componentName} variant="secondary" loading>Processing</${componentName}>
      <${componentName} variant="default" disabled>Disabled</${componentName}>
    </div>
  )
};
`;

/* ----------------------------- Template: test ---------------------------- */
const tpl_test_tsx = () => `${metaHeader(componentType)}
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ${componentName} } from './${componentName}';

expect.extend(toHaveNoViolations);

describe('${componentName}', () => {
  it('renders children', () => {
    render(<${componentName}>Hello</${componentName}>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('supports polymorphic as="button"', () => {
    render(<${componentName} as="button">Btn</${componentName}>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('no a11y violations', async () => {
    const { container } = render(<${componentName}>A</${componentName}>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('applies disabled state', () => {
    render(<${componentName} disabled>Disabled</${componentName}>);
    const el = screen.getByText('Disabled').parentElement ?? screen.getByText('Disabled');
    expect(el).toHaveClass('opacity-50');
    expect(el).toHaveAttribute('aria-disabled', 'true');
  });

  it('applies loading state', () => {
    render(<${componentName} loading>Loading</${componentName}>);
    const el = screen.getByText('Loading').parentElement ?? screen.getByText('Loading');
    expect(el).toHaveClass('cursor-wait');
    expect(el).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument(); // spinner SVG
  });

  it('shows type=button when as=button', () => {
    render(<${componentName} as="button">Button</${componentName}>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('type', 'button');
  });

  it('adds data attributes for testing', () => {
    render(<${componentName} variant="primary" size="lg" data-testid="test">Test</${componentName}>);
    const el = screen.getByTestId('test');
    expect(el).toHaveAttribute('data-variant', 'primary');
    expect(el).toHaveAttribute('data-size', 'lg');
  });
});
`;

/* ------------------------------- Main Flow ------------------------------- */
async function main() {
  const componentDir = path.join(UI_ROOT, componentName);

  // Ensure root exists
  if (!(await exists(UI_ROOT))) {
    await fs.mkdir(UI_ROOT, { recursive: true });
  }

  // Guard: no overwrite
  if (await exists(componentDir)) {
    console.error(`❌ Component ${componentName} already exists!`);
    process.exit(1);
  }

  await fs.mkdir(componentDir, { recursive: true });

  console.log(`🧩 Creating UI component: ${componentName} (type: ${componentType})`);
  console.log(`📁 Directory: src/components/ui/${componentName}/`);

  // Build files
  const files = [
    { name: `${componentName}.tsx`, content: tpl_main_tsx() },
    { name: `${componentName}.variants.ts`, content: tpl_variants_ts() },
    { name: `${componentName}.types.ts`, content: tpl_types_ts() },
    { name: 'index.ts', content: tpl_index_ts() },
    { name: 'README.md', content: tpl_readme_md() },
  ];
  if (CONFIG.withStories)
    files.push({
      name: `${componentName}.stories.tsx`,
      content: tpl_story_tsx(),
    });
  if (CONFIG.withTests) files.push({ name: `${componentName}.test.tsx`, content: tpl_test_tsx() });

  // Write
  for (const f of files) {
    await fs.writeFile(path.join(componentDir, f.name), f.content, 'utf8');
    console.log(`✅ Created: ${f.name}`);
  }

  // Update barrel index
  if (!(await exists(MAIN_INDEX))) {
    await fs.writeFile(
      MAIN_INDEX,
      '// Vantage Lane UI Components - Auto-generated exports\n\n',
      'utf8'
    );
  }
  const current = await fs.readFile(MAIN_INDEX, 'utf8');
  const exportLine = `export * from './${componentName}';\n`;
  if (!current.includes(exportLine)) {
    await fs.appendFile(MAIN_INDEX, exportLine, 'utf8');
    console.log(`🔗 Added to ui/index.ts: ${componentName}`);
  }

  console.log(`\n🎉 ${componentName} component created successfully! (v${CONFIG.version})`);
  console.log(`\n📝 Next steps:`);
  console.log(`   1. Import: import { ${componentName} } from '@/components/ui/${componentName}'`);
  console.log(`   2. Use: <${componentName} variant="primary">Hello</${componentName}>`);
  console.log(`   3. Test: npm run test -- ${componentName}.test.tsx`);
  console.log(`   4. View: npm run storybook (UI/${componentName})`);
  console.log(`\n🎯 Features: ✅ ForwardRef ✅ Polymorphic ✅ A11y ✅ CVA ✅ Story ✅ Test\n`);
}

main().catch(err => {
  console.error('❌ Error:', err?.message || err);
  process.exit(1);
});
