'use client';

import { useState } from 'react';
import { Dock, DockIcon, DockSeparator } from '@/components/ui/dock-v2';
import {
  ArrowRight,
  RefreshCw,
  Clock,
  Car,
  Home,
  Settings,
  Search,
  Mail,
  Heart,
} from 'lucide-react';

/**
 * 🧪 DOCK TEST - Advanced macOS Dock with Gaussian Magnification
 *
 * Features:
 * - Context-based state management
 * - Gaussian magnification algorithm
 * - Spring physics animations
 * - Glass morphism design
 * - Design tokens orchestration
 * - Accessibility features
 */
export default function DockTestPage() {
  const [selectedMode, setSelectedMode] = useState<string>('oneway');

  return (
    <div className='min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black'>
      <div className='pt-16 px-8 space-y-16'>
        {/* Header */}
        <div className='text-center space-y-6'>
          <h1 className='text-5xl md:text-7xl font-bold text-white'>DOCK TEST</h1>
          <p className='text-xl text-neutral-400 max-w-2xl mx-auto'>
            Advanced macOS-style dock with Gaussian magnification, spring physics, and glass
            morphism design
          </p>
        </div>
        {/* Features Grid */}
        <div className='max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
          <div className='bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6'>
            <h3 className='text-lg font-semibold text-white mb-3'>🧠 Context Provider</h3>
            <p className='text-neutral-400 text-sm'>
              Advanced state management with mouse tracking and icon registry
            </p>
          </div>

          <div className='bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6'>
            <h3 className='text-lg font-semibold text-white mb-3'>📐 Gaussian Algorithm</h3>
            <p className='text-neutral-400 text-sm'>
              Mathematical magnification based on distance with kernel functions
            </p>
          </div>

          <div className='bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6'>
            <h3 className='text-lg font-semibold text-white mb-3'>⚡ Spring Physics</h3>
            <p className='text-neutral-400 text-sm'>
              Framer Motion springs with custom stiffness and damping
            </p>
          </div>

          <div className='bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6'>
            <h3 className='text-lg font-semibold text-white mb-3'>🎨 Glass Morphism</h3>
            <p className='text-neutral-400 text-sm'>
              Modern glass effects with backdrop blur and gradients
            </p>
          </div>

          <div className='bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6'>
            <h3 className='text-lg font-semibold text-white mb-3'>🎯 Design Tokens</h3>
            <p className='text-neutral-400 text-sm'>
              Centralized design system with motion and theme tokens
            </p>
          </div>

          <div className='bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6'>
            <h3 className='text-lg font-semibold text-white mb-3'>♿ Accessibility</h3>
            <p className='text-neutral-400 text-sm'>
              ARIA labels, keyboard navigation, and screen reader support
            </p>
          </div>
        </div>
        {/* Main Dock Demo - Booking Mode */}
        <div className='text-center space-y-8'>
          <h2 className='text-3xl font-bold text-white'>Booking Mode Selector</h2>
          <div className='flex justify-center'>
            <Dock aria-label='Booking mode selector'>
              <DockIcon label='One Way' onClick={() => setSelectedMode('oneway')}>
                <ArrowRight className='h-6 w-6' />
              </DockIcon>
              <DockIcon label='Return' onClick={() => setSelectedMode('return')}>
                <RefreshCw className='h-6 w-6' />
              </DockIcon>
              <DockSeparator />
              <DockIcon label='By Hour' onClick={() => setSelectedMode('hourly')}>
                <Clock className='h-6 w-6' />
              </DockIcon>
              <DockIcon label='Fleet' onClick={() => setSelectedMode('fleet')}>
                <Car className='h-6 w-6' />
              </DockIcon>
            </Dock>
          </div>
          <div className='text-center'>
            <p className='text-neutral-400'>Selected Mode:</p>
            <p className='text-xl font-semibold text-[var(--brand-primary)]'>
              {selectedMode.charAt(0).toUpperCase() + selectedMode.slice(1)}
            </p>
          </div>
        </div>
        {/* Secondary Dock Demo - App Launcher */}
        <div className='text-center space-y-8'>
          <h2 className='text-3xl font-bold text-white'>App Launcher Dock</h2>
          <div className='flex justify-center'>
            <Dock aria-label='App launcher'>
              <DockIcon label='Home'>
                <Home className='h-6 w-6' />
              </DockIcon>
              <DockIcon label='Search'>
                <Search className='h-6 w-6' />
              </DockIcon>
              <DockIcon label='Mail'>
                <Mail className='h-6 w-6' />
              </DockIcon>
              <DockSeparator />
              <DockIcon label='Favorites'>
                <Heart className='h-6 w-6' />
              </DockIcon>
              <DockIcon label='Settings'>
                <Settings className='h-6 w-6' />
              </DockIcon>
            </Dock>
          </div>
        </div>
        {/* Technical Details */}
        <div className='max-w-4xl mx-auto space-y-6'>
          <h2 className='text-3xl font-bold text-white text-center mb-8'>
            Technical Implementation
          </h2>

          <div className='bg-black/20 border border-white/10 rounded-2xl p-6 space-y-4'>
            <h3 className='text-xl font-semibold text-white'>🧮 Gaussian Magnification Formula</h3>
            <div className='bg-black/40 rounded-lg p-4 text-sm text-neutral-300 font-mono'>
              <code>gaussian(d) = exp(-(d²)/(2σ²)) where d = distance, σ = kernel sigma</code>
            </div>
            <p className='text-neutral-400'>
              Icons scale based on mathematical distance calculation with smooth falloff
            </p>
          </div>

          <div className='bg-black/20 border border-white/10 rounded-2xl p-6 space-y-4'>
            <h3 className='text-xl font-semibold text-white'>⚙️ Design Tokens</h3>
            <div className='grid md:grid-cols-2 gap-4 text-sm'>
              <div>
                <p className='text-[var(--brand-primary)] font-semibold'>Motion:</p>
                <p className='text-neutral-400'>Stiffness: 240, Damping: 18</p>
              </div>
              <div>
                <p className='text-[var(--brand-primary)] font-semibold'>Scale Range:</p>
                <p className='text-neutral-400'>Min: 1.0, Max: 1.8</p>
              </div>
              <div>
                <p className='text-[var(--brand-primary)] font-semibold'>Kernel:</p>
                <p className='text-neutral-400'>Distance: 120px, Sigma: 80</p>
              </div>
              <div>
                <p className='text-[var(--brand-primary)] font-semibold'>Glass:</p>
                <p className='text-neutral-400'>Backdrop blur + gradients</p>
              </div>
            </div>
          </div>
        </div>
        {/* Instructions */}
        <div className='max-w-2xl mx-auto bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8'>
          <h3 className='text-2xl font-semibold text-white mb-4 text-center'>
            🎯 Test Instructions
          </h3>
          <ul className='space-y-3 text-neutral-300'>
            <li>
              • <strong>Hover over icons</strong> to see Gaussian magnification
            </li>
            <li>
              • <strong>Move slowly</strong> across the dock for smooth scaling
            </li>
            <li>
              • <strong>Click icons</strong> to see selection state
            </li>
            <li>
              • <strong>Watch tooltips</strong> appear on hover
            </li>
            <li>
              • <strong>Observe physics</strong> - spring animations with damping
            </li>
            <li>
              • <strong>Test accessibility</strong> - keyboard navigation support
            </li>
          </ul>
        </div>
        <div className='h-32' /> {/* Spacer */}
      </div>
    </div>
  );
}
