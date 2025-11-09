/**
 * 🧪 Grid Test Page
 * Test page for VantageImageGrid component
 */

import VantageImageGrid from '@/components/ui/VantageImageGrid';

export default function GridTestPage() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black flex items-center justify-center px-4 py-16'>
      <div className='w-full max-w-4xl'>
        {/* Header */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl md:text-5xl font-light text-white mb-4'>
            Vantage <span className='text-[var(--brand-primary)]'>Split Image Grid</span>
          </h1>
          <p className='text-neutral-400 text-lg'>
            One image split across 16 cards with 3D perspective and hover effects
          </p>
          <p className='text-neutral-500 text-sm mt-2'>
            Hover over any card to see it rise • The full image is divided between all cards
          </p>
        </div>

        {/* Grid Component */}
        <div className='flex justify-center mb-12'>
          <div className='w-full max-w-xl'>
            <VantageImageGrid
              imageUrl='/images/vantage%20lane%20logo1.webp'
              gridCols={4}
              gridRows={4}
            />
          </div>
        </div>

        {/* Features List */}
        <div className='mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-center'>
          <div className='p-6 bg-white/5 rounded-xl border border-white/10'>
            <div className='text-[var(--brand-primary)] text-2xl mb-2'>🎨</div>
            <h3 className='text-white font-medium mb-2'>3D Perspective</h3>
            <p className='text-neutral-400 text-sm'>
              Fixed 3D transform creates depth and dimension
            </p>
          </div>
          <div className='p-6 bg-white/5 rounded-xl border border-white/10'>
            <div className='text-[var(--brand-primary)] text-2xl mb-2'>✨</div>
            <h3 className='text-white font-medium mb-2'>Glow Animation</h3>
            <p className='text-neutral-400 text-sm'>
              Pulsing golden glow on hovered and adjacent cards
            </p>
          </div>
          <div className='p-6 bg-white/5 rounded-xl border border-white/10'>
            <div className='text-[var(--brand-primary)] text-2xl mb-2'>🎯</div>
            <h3 className='text-white font-medium mb-2'>Adjacent Effect</h3>
            <p className='text-neutral-400 text-sm'>
              Neighboring cards rise slightly when you hover nearby
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className='mt-12 p-6 bg-[var(--brand-primary)]/10 rounded-xl border border-[var(--brand-primary)]/20'>
          <h3 className='text-white font-medium mb-3 text-center'>How It Works</h3>
          <ul className='text-neutral-400 text-sm space-y-2'>
            <li>
              • <strong className='text-white'>Split image</strong> → One image divided into 16
              pieces (4x4 grid)
            </li>
            <li>
              • <strong className='text-white'>Hover a card</strong> → It scales 15% and rises with
              glow
            </li>
            <li>
              • <strong className='text-white'>Adjacent cards</strong> → Up/down/left/right
              neighbors rise 5%
            </li>
            <li>
              • <strong className='text-white'>Landscape aspect</strong> → Each card is 16:9 ratio
            </li>
            <li>
              • <strong className='text-white'>3D perspective</strong> → Fixed rotateX(-1deg)
              rotateY(-15deg)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
