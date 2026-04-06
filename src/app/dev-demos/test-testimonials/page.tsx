'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import type React from 'react';

// Import componenta noastră
import { TestimonialsNew, type GridVariant } from '@/components/sections/TestimonialsNew';

/**
 * 🧪 TestimonialsNew Test Page
 *
 * Pagină de test pentru a vedea componenta în acțiune:
 * ✅ Diferite variante de grid (default, compact, featured)
 * ✅ Text de lungimi diferite (testează înălțimile egale)
 * ✅ Toggle light/dark mode
 * ✅ Responsive preview
 * ✅ Interactive demo
 */

export default function TestTestimonialsPage(): React.JSX.Element {
  const [variant, setVariant] = useState<GridVariant>('default');
  const [maxItems, setMaxItems] = useState<number | undefined>(undefined);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle theme pentru testare
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute('data-theme', !isDarkMode ? 'dark' : 'light');
  };

  // Removed click handler - cardurile nu mai sunt clickable

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}
    >
      {/* 🎮 Control Panel */}
      <div className='fixed top-4 right-4 z-50 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-4 space-y-3'>
        <h3 className='font-semibold text-sm'>TestimonialsNew Controls</h3>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className='w-full px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded text-sm transition-colors'
        >
          {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>

        {/* Grid Variant Selector */}
        <div>
          <label className='block text-xs font-medium mb-1'>Grid Variant:</label>
          <select
            value={variant}
            onChange={e => setVariant(e.target.value as GridVariant)}
            className='w-full px-2 py-1 bg-black/20 border border-white/30 rounded text-sm'
          >
            <option value='default'>Default</option>
            <option value='compact'>Compact</option>
            <option value='featured'>Featured</option>
            <option value='carousel'>Carousel</option>
          </select>
        </div>

        {/* Max Items Selector */}
        <div>
          <label className='block text-xs font-medium mb-1'>Max Items:</label>
          <select
            value={maxItems || 'all'}
            onChange={e =>
              setMaxItems(e.target.value === 'all' ? undefined : parseInt(e.target.value))
            }
            className='w-full px-2 py-1 bg-black/20 border border-white/30 rounded text-sm'
          >
            <option value='all'>All (6)</option>
            <option value='3'>3 Items</option>
            <option value='4'>4 Items</option>
          </select>
        </div>
      </div>

      {/* 📱 Responsive Info */}
      <div className='fixed bottom-4 left-4 z-50 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-3'>
        <div className='text-xs space-y-1'>
          <div className='font-medium'>Responsive Test:</div>
          <div className='sm:hidden text-green-400'>📱 Mobile View</div>
          <div className='hidden sm:block md:hidden text-blue-400'>📟 Tablet View</div>
          <div className='hidden md:block lg:hidden text-purple-400'>💻 Desktop View</div>
          <div className='hidden lg:block text-orange-400'>🖥️ Wide View</div>
        </div>
      </div>

      {/* 🎭 Main Content */}
      <main className='relative'>
        {/* Hero Section cu instrucțiuni */}
        <section className='py-16 px-4 text-center'>
          <h1 className='text-4xl md:text-5xl font-light mb-4'>
            🧪 TestimonialsNew <span className='text-yellow-500'>Test Lab</span>
          </h1>
          <p className='text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8'>
            Testează componenta TestimonialsNew cu diferite configurații. Observă cum cardurile
            mențin înălțimi egale chiar și cu texte de lungimi diferite.
          </p>

          {/* Status Info */}
          <div className='inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full px-4 py-2 text-sm'>
            <span className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></span>
            <span>
              Variant: <strong>{variant}</strong>
            </span>
            <span>•</span>
            <span>
              Items: <strong>{maxItems || '6'}</strong>
            </span>
            <span>•</span>
            <span>
              Theme: <strong>{isDarkMode ? 'Dark' : 'Light'}</strong>
            </span>
          </div>
        </section>

        {/* 🎯 TestimonialsNew Component Demo */}
        <TestimonialsNew variant={variant} {...(maxItems && { maxItems })} className='mb-16' />

        {/* 📊 Features Showcase */}
        <section className='py-16 px-4'>
          <div className='max-w-4xl mx-auto'>
            <h2 className='text-3xl font-light text-center mb-12'>✨ Features Implemented</h2>

            <div className='grid md:grid-cols-2 gap-8'>
              <div className='bg-white/5 backdrop-blur border border-white/10 rounded-lg p-6'>
                <h3 className='font-semibold mb-3 text-yellow-500'>🎯 Înălțimi Egale</h3>
                <p className='text-sm text-gray-600 dark:text-gray-300'>
                  CSS Grid cu <code>grid-template-rows: auto 1fr auto</code> + Flexbox pentru
                  carduri cu aceeași înălțime chiar dacă textul variază.
                </p>
              </div>

              <div className='bg-white/5 backdrop-blur border border-white/10 rounded-lg p-6'>
                <h3 className='font-semibold mb-3 text-blue-500'>🧱 Design Tokens</h3>
                <p className='text-sm text-gray-600 dark:text-gray-300'>
                  Zero hardcoding - toate valorile prin tokens orchestrați. Consistent cu design
                  system-ul global.
                </p>
              </div>

              <div className='bg-white/5 backdrop-blur border border-white/10 rounded-lg p-6'>
                <h3 className='font-semibold mb-3 text-purple-500'>🎪 Glassmorphism</h3>
                <p className='text-sm text-gray-600 dark:text-gray-300'>
                  Efecte moderne translucide cu backdrop-filter și theme-aware styling pentru
                  light/dark mode automat.
                </p>
              </div>

              <div className='bg-white/5 backdrop-blur border border-white/10 rounded-lg p-6'>
                <h3 className='font-semibold mb-3 text-green-500'>📱 Responsive</h3>
                <p className='text-sm text-gray-600 dark:text-gray-300'>
                  Auto-responsive grid cu <code>auto-fit</code> și <code>clamp()</code>
                  pentru adaptare perfectă pe orice device.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 🔧 Technical Details */}
        <section className='py-16 px-4 bg-black/5'>
          <div className='max-w-2xl mx-auto text-center'>
            <h2 className='text-2xl font-light mb-8'>🔧 Technical Stack</h2>
            <div className='flex flex-wrap justify-center gap-3'>
              {[
                'React + TypeScript',
                'Framer Motion',
                'CSS Grid + Flexbox',
                'CSS Modules',
                'Design Tokens',
                'Glassmorphism',
                'Auto-Responsive',
                'Theme Orchestration',
              ].map(tech => (
                <span
                  key={tech}
                  className='px-3 py-1 bg-white/10 border border-white/20 rounded-full text-sm'
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
