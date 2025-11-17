'use client';

import {
  Award,
  Calendar,
  Car,
  Grid,
  Layout,
  Menu,
  MessageSquare,
  Palette,
  RefreshCw,
  Settings,
  TestTube2,
} from 'lucide-react';
import Link from 'next/link';

const demoCategories = [
  {
    title: '🎯 Booking Demos',
    description: 'Componente pentru sistemul de booking',
    demos: [
      {
        name: 'Booking Pro',
        href: '/dev-demos/demo-booking-pro',
        icon: Car,
        description: 'Demo complet sistem booking pro',
      },
      {
        name: 'Booking Stepper',
        href: '/dev-demos/demo-booking-stepper',
        icon: Calendar,
        description: 'Demo stepper pentru booking',
      },
    ],
  },
  {
    title: '⚡ UI & Layout Tests',
    description: 'Teste pentru componente UI și layout',
    demos: [
      {
        name: 'Dock Modular',
        href: '/dev-demos/dock-modular-test',
        icon: Menu,
        description: 'Test dock modular',
      },
      {
        name: 'Grid Test',
        href: '/dev-demos/grid-test',
        icon: Grid,
        description: 'Test pentru grid layout',
      },
      {
        name: 'Theme Test',
        href: '/dev-demos/theme-test',
        icon: Palette,
        description: 'Test pentru teme și culori',
      },
    ],
  },
  {
    title: '👥 Footer & Social',
    description: 'Teste pentru footer și social media',
    demos: [
      {
        name: 'Footer Icons',
        href: '/dev-demos/footer-icons-test',
        icon: Layout,
        description: 'Test footer cu iconuri',
      },
      {
        name: 'Footer Updated',
        href: '/dev-demos/footer-updated-test',
        icon: RefreshCw,
        description: 'Test footer actualizat',
      },
    ],
  },
  {
    title: '📋 Services & Content',
    description: 'Teste pentru servicii și conținut',
    demos: [
      {
        name: 'Services Dropdown',
        href: '/dev-demos/services-dropdown-test',
        icon: Settings,
        description: 'Test dropdown servicii',
      },
      {
        name: 'Benefits Test',
        href: '/dev-demos/test-benefits',
        icon: Award,
        description: 'Test pagină benefits',
      },
      {
        name: 'Testimonials Test',
        href: '/dev-demos/test-testimonials',
        icon: MessageSquare,
        description: 'Test testimoniale',
      },
    ],
  },
  {
    title: '🧪 General',
    description: 'Teste generale',
    demos: [
      {
        name: 'General Test',
        href: '/dev-demos/test',
        icon: TestTube2,
        description: 'Test general componente',
      },
    ],
  },
];

export default function DevDemosPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-8'>
      {/* Header */}
      <div className='text-center mb-12'>
        <h1 className='text-5xl font-bold text-white mb-4'>🧪 Development Demos</h1>
        <p className='text-xl text-blue-200 max-w-3xl mx-auto'>
          Toate demo-urile și testele pentru componente. Navighează prin butoane pentru a vedea
          fiecare demo.
        </p>
        <div className='mt-6'>
          <Link
            href='/'
            className='inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors'
          >
            ← Înapoi la Homepage
          </Link>
        </div>
      </div>

      {/* Demo Categories */}
      <div className='max-w-7xl mx-auto space-y-12'>
        {demoCategories.map(category => (
          <div key={category.title} className='bg-white/10 backdrop-blur-lg rounded-2xl p-8'>
            <div className='mb-6'>
              <h2 className='text-3xl font-bold text-white mb-2'>{category.title}</h2>
              <p className='text-blue-200'>{category.description}</p>
            </div>

            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {category.demos.map(demo => {
                const IconComponent = demo.icon;
                return (
                  <Link
                    key={demo.name}
                    href={demo.href}
                    className='group block p-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-2xl'
                  >
                    <div className='flex items-start gap-4'>
                      <div className='p-3 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors'>
                        <IconComponent className='h-6 w-6 text-blue-300' />
                      </div>
                      <div className='flex-1'>
                        <h3 className='text-lg font-semibold text-white group-hover:text-blue-200 transition-colors'>
                          {demo.name}
                        </h3>
                        <p className='text-sm text-blue-300 mt-1'>{demo.description}</p>
                        <div className='mt-3 text-xs text-blue-400 opacity-75'>
                          Click pentru demo →
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className='mt-16 text-center'>
        <div className='bg-white/5 rounded-lg p-6 max-w-2xl mx-auto'>
          <h3 className='text-lg font-semibold text-white mb-2'>⚠️ Atenție</h3>
          <p className='text-blue-200 text-sm'>
            Aceste demo-uri sunt pentru development și testing. Nu ar trebui să fie accesibile în
            producție.
          </p>
        </div>
      </div>
    </div>
  );
}
