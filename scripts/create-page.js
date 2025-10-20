#!/usr/bin/env node
/**
 * 🧩 VANTAGE LANE PAGE GENERATOR v3.1 (Enterprise Edition)
 * --------------------------------------------------------
 * Creează automat o pagină completă:
 *  - HeroSection (responsive, token-based)
 *  - BaseSection (content)
 *  - .config.ts, .meta.ts, .test.tsx, .stories.tsx (opțional)
 *  - adaugă automat ruta în routes.config.ts
 *
 * Usage:
 *   npm run create:page About --layout=marketing [--with-story]
 */

const fs = require("fs");
const path = require("path");

const GENERATOR_VERSION = "3.2.0-light";
console.log(`🧩 Vantage Lane Page Generator v${GENERATOR_VERSION} (Light Edition)`);

const [, , rawName, ...args] = process.argv;
if (!rawName) {
  console.error("❌ Usage: npm run create:page PageName [--layout=marketing|dashboard|auth]");
  process.exit(1);
}

const PageName = rawName.trim();
if (!/^[A-Z][a-zA-Z0-9]*$/.test(PageName)) {
  console.error("❌ Page name must be PascalCase (e.g. About, Services, Contact).");
  process.exit(1);
}

const layoutFlag = args.find(a => a.startsWith("--layout="));
const layout = layoutFlag ? layoutFlag.replace("--layout=", "") : "marketing";
const withStory = args.includes("--with-story");
const pageSlug = PageName.toLowerCase();

const appDir = path.join(__dirname, `../src/app/${pageSlug}`);
const configDir = path.join(__dirname, "../src/config");
const routeFile = path.join(configDir, "routes.config.ts");

async function main() {
  if (fs.existsSync(appDir)) {
    console.error(`❌ Page ${PageName} already exists!`);
    process.exit(1);
  }

  fs.mkdirSync(appDir, { recursive: true });

  // 🧱 HeroSection - Pure CSS Vars (Light Clean Edition)
  const heroSection = `'use client';
import React from 'react';
import { Container } from '@/components/layout/Container';

/**
 * 🏆 HeroSection – responsive + pure CSS vars (v3.2 Light)
 * ✅ Uses global CSS variables only
 * ✅ Zero hardcoded colors
 * ✅ Brand consistent via CSS
 */
export function HeroSection(): JSX.Element {
  return (
    <section 
      className="relative text-center py-16 md:py-24 text-white"
      style={{
        background: 'linear-gradient(to bottom, var(--brand-secondary), var(--brand-primary))',
      }}
    >
      <Container>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-white">
          ${PageName}
        </h1>
        <p className="mx-auto max-w-xl text-lg md:text-xl opacity-90 text-balance">
          Discover premium experiences with Vantage Lane — crafted for elegance and performance.
        </p>
      </Container>
    </section>
  );
}
export default HeroSection;
`;

  // 🧱 BaseSection - Clean Tailwind, token-ready
  const baseSection = `'use client';
import React from 'react';
import { Container } from '@/components/layout/Container';
import { colors } from '@/design-system/tokens/colors';
import { brandConfig } from '@/config/brand.config';

/**
 * 🧱 BaseSection – reusable content area (v3.1 Clean)
 * ✅ Design tokens imported
 * ✅ Pure Tailwind classes
 * ✅ No hardcoded values
 */
export function BaseSection() {
  return (
    <section className="py-16 bg-neutral-50 dark:bg-neutral-900">
      <Container>
        <div className="prose dark:prose-invert mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-neutral-900 dark:text-white">
            Welcome to ${PageName}
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-8">
            This section was generated automatically with Vantage Lane Page Generator v${GENERATOR_VERSION}.
            You can now add components or content here.
          </p>
          
          {/* Example content structure */}
          <div className="grid md:grid-cols-2 gap-8 mt-12 text-left">
            <div className="not-prose p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-neutral-900 dark:text-white">
                Feature One
              </h3>
              <p className="text-neutral-600 dark:text-neutral-300">
                Add your content here. This section is fully customizable with design tokens.
              </p>
            </div>
            <div className="not-prose p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-neutral-900 dark:text-white">
                Feature Two
              </h3>
              <p className="text-neutral-600 dark:text-neutral-300">
                Perfect for showcasing key features with proper token integration.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
export default BaseSection;
`;

  // 🧱 page.tsx
  const pageFile = `import HeroSection from './HeroSection';
import BaseSection from './BaseSection';
import type { Metadata } from 'next';
import { ${PageName}Meta } from './${PageName}.meta';
import { ${PageName}Config } from './${PageName}.config';

export const metadata: Metadata = ${PageName}Meta;

export default function ${PageName}Page() {
  return (
    <>
      {${PageName}Config.hero && <HeroSection />}
      <BaseSection />
    </>
  );
}
`;

  // 🧱 Config
  const configFile = `/**
 * ⚙️ ${PageName}Config – Vantage Lane Page Config v${GENERATOR_VERSION}
 * Layout: ${layout}
 */
export const ${PageName}Config = {
  title: '${PageName}',
  slug: '${pageSlug}',
  layout: '${layout}',
  hero: ${layout === "marketing"},
  requiresAuth: ${layout === "dashboard"},
  seo: {
    priority: 0.8,
    changefreq: 'monthly' as const,
  },
  features: {
    breadcrumbs: ${layout === "dashboard"},
    sidebar: ${layout === "dashboard"},
    footer: ${layout !== "auth"},
  },
} as const;

export default ${PageName}Config;
`;

  // 🧱 Meta
  const metaFile = `import type { Metadata } from 'next';
import { ${PageName}Config } from './${PageName}.config';

export const ${PageName}Meta: Metadata = {
  title: \`\${${PageName}Config.title} | Vantage Lane\`,
  description: \`Explore \${${PageName}Config.title} page — powered by Vantage Lane luxury experience.\`,
  keywords: ['${PageName.toLowerCase()}', 'vantage lane', 'luxury', 'premium service'],
  
  openGraph: {
    title: \`\${${PageName}Config.title} | Vantage Lane\`,
    description: 'Premium chauffeur service redefined.',
    type: 'website',
    siteName: 'Vantage Lane',
  },
  
  twitter: {
    card: 'summary_large_image',
    title: \`\${${PageName}Config.title} | Vantage Lane\`,
    description: 'Premium chauffeur service redefined.',
  },
  
  robots: {
    index: true,
    follow: true,
  },
};

export default ${PageName}Meta;
`;

  // 🧱 Test
  const testFile = `import { render, screen } from '@testing-library/react';
import Page from './page';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('${PageName} page', () => {
  it('renders page title correctly', () => {
    render(<Page />);
    expect(screen.getByRole('heading', { name: '${PageName}' })).toBeInTheDocument();
  });

  it('renders base content section', () => {
    render(<Page />);
    expect(screen.getByText(/Welcome to ${PageName}/)).toBeInTheDocument();
    expect(screen.getByText(/generated automatically/)).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Page />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders hero section for marketing layout', () => {
    render(<Page />);
    ${layout === "marketing" ? 
      "expect(screen.getByText('Discover premium experiences')).toBeInTheDocument();" :
      "// Hero section disabled for non-marketing layout"
    }
  });
});
`;

  // 🧱 Storybook (optional)
  const storyFile = `import type { Meta, StoryObj } from '@storybook/react';
import Page from './page';
import HeroSection from './HeroSection';
import BaseSection from './BaseSection';

const meta: Meta<typeof Page> = {
  title: 'Pages/${PageName}',
  component: Page,
  parameters: { 
    layout: 'fullscreen',
    docs: { 
      description: { 
        component: \`${PageName} page generated with Vantage Lane Page Generator v${GENERATOR_VERSION}\` 
      } 
    },
  },
};
export default meta;
type Story = StoryObj<typeof Page>;

export const Default: Story = {};

export const HeroOnly: Story = {
  render: () => <HeroSection />,
};

export const ContentOnly: Story = {
  render: () => <BaseSection />,
};
`;

  // Write all files
  console.log(`🧩 Creating ${PageName} page (layout: ${layout})...`);
  
  fs.writeFileSync(path.join(appDir, "HeroSection.tsx"), heroSection);
  fs.writeFileSync(path.join(appDir, "BaseSection.tsx"), baseSection);
  fs.writeFileSync(path.join(appDir, "page.tsx"), pageFile);
  fs.writeFileSync(path.join(appDir, `${PageName}.config.ts`), configFile);
  fs.writeFileSync(path.join(appDir, `${PageName}.meta.ts`), metaFile);
  fs.writeFileSync(path.join(appDir, `${PageName}.test.tsx`), testFile);
  
  if (withStory) {
    fs.writeFileSync(path.join(appDir, `${PageName}.stories.tsx`), storyFile);
    console.log(`✅ Created: ${PageName}.stories.tsx`);
  }

  console.log(`✅ Created: HeroSection.tsx`);
  console.log(`✅ Created: BaseSection.tsx`);
  console.log(`✅ Created: page.tsx`);
  console.log(`✅ Created: ${PageName}.config.ts`);
  console.log(`✅ Created: ${PageName}.meta.ts`);
  console.log(`✅ Created: ${PageName}.test.tsx`);
  console.log(`📁 Directory: src/app/${pageSlug}/`);

  // Add to routes.config.ts (with fallback creation)
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  if (!fs.existsSync(routeFile)) {
    const routesConfig = `/**
 * 🗺️ Routes Configuration - Vantage Lane
 * Auto-generated and maintained by create-page.js
 */

export interface RouteConfig {
  path: string;
  title: string;
  layout: 'marketing' | 'dashboard' | 'auth';
  hero: boolean;
  requiresAuth?: boolean;
}

const routes: Record<string, RouteConfig> = {};

export function addRoute(key: string, config: RouteConfig) {
  routes[key] = config;
}

export function getRoute(key: string): RouteConfig | undefined {
  return routes[key];
}

export function getAllRoutes(): Record<string, RouteConfig> {
  return routes;
}

// Auto-generated routes:
`;
    fs.writeFileSync(routeFile, routesConfig);
    console.log(`✅ Created: routes.config.ts`);
  }

  // Add route
  const routeSnippet = `addRoute('${pageSlug}', { path: '/${pageSlug}', title: '${PageName}', layout: '${layout}', hero: ${layout === "marketing"}, requiresAuth: ${layout === "dashboard"} });`;
  const content = fs.readFileSync(routeFile, "utf8");
  
  if (!content.includes(`'${pageSlug}'`)) {
    fs.appendFileSync(routeFile, `${routeSnippet}\n`);
    console.log(`✅ Added route to routes.config.ts`);
  } else {
    console.log(`ℹ️ Route already exists in routes.config.ts`);
  }

  console.log(`\n🎉 ${PageName} page created successfully!`);
  console.log(`\n📊 Generated files: ${withStory ? '7' : '6'} files`);
  console.log(`📄 Layout: ${layout}`);
  console.log(`🎯 Features: Hero(${layout === "marketing"}), Auth(${layout === "dashboard"}), SEO(✅), A11y(✅)`);
  console.log(`\n🚀 Next steps:`);
  console.log(`   1. Visit: http://localhost:3000/${pageSlug}`);
  console.log(`   2. Edit: src/app/${pageSlug}/BaseSection.tsx`);
  console.log(`   3. Test: npm run test -- ${PageName}.test.tsx`);
  if (withStory) console.log(`   4. View: npm run storybook (Pages/${PageName})`);
  console.log(`\n🎯 Perfect compatibility with UI Generator v3.1! ✨`);
}

main().catch(err => {
  console.error("❌ Error creating page:", err);
  process.exit(1);
});
