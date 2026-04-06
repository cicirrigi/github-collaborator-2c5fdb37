'use client';

export const dynamic = 'force-dynamic';

export default function BackgroundTestPage() {
  return (
    <div className='min-h-screen w-full relative overflow-hidden'>
      {/* Background Test Container */}
      <div
        className='fixed inset-0 w-full h-full'
        style={{
          background: `
            /* Subtle depth gradients - predominantly gray */
            radial-gradient(ellipse 800px 600px at 50% 40%, rgba(28, 28, 28, 0.6) 0%, rgba(22, 22, 22, 0.4) 40%, rgba(16, 16, 16, 0.2) 70%, transparent 90%),
            radial-gradient(ellipse 600px 400px at 20% 60%, rgba(24, 24, 24, 0.4) 0%, rgba(18, 18, 18, 0.25) 50%, transparent 80%),
            radial-gradient(ellipse 700px 500px at 80% 30%, rgba(26, 26, 26, 0.35) 0%, rgba(20, 20, 20, 0.2) 45%, transparent 75%),

            /* Fine texture layers - neutral grays */
            radial-gradient(circle 400px at 30% 70%, rgba(30, 30, 30, 0.3) 0%, rgba(22, 22, 22, 0.15) 60%, transparent 85%),
            radial-gradient(circle 350px at 70% 20%, rgba(24, 24, 24, 0.25) 0%, rgba(16, 16, 16, 0.12) 50%, transparent 70%),

            /* Minimal warm undertones - barely noticeable */
            radial-gradient(circle 300px at 40% 80%, rgba(28, 26, 24, 0.08) 0%, transparent 50%),
            radial-gradient(circle 250px at 75% 25%, rgba(26, 24, 22, 0.06) 0%, transparent 45%),
            radial-gradient(circle 200px at 15% 45%, rgba(24, 22, 20, 0.05) 0%, transparent 40%),

            /* Very subtle grain texture */
            radial-gradient(circle 150px at 60% 15%, rgba(32, 32, 32, 0.15) 0%, transparent 35%),
            radial-gradient(circle 120px at 85% 75%, rgba(28, 28, 28, 0.12) 0%, transparent 30%),
            radial-gradient(circle 100px at 25% 85%, rgba(30, 30, 30, 0.1) 0%, transparent 25%),

            /* Sophisticated neutral base */
            linear-gradient(135deg, rgba(14, 14, 14, 0.95) 0%, rgba(18, 18, 18, 0.97) 25%, rgba(22, 22, 22, 0.93) 50%, rgba(16, 16, 16, 0.96) 75%, rgba(14, 14, 14, 0.95) 100%),
            #0e0e0e
          `,
        }}
      />

      {/* Content for testing glassmorphism */}
      <div className='relative z-10 p-8'>
        <h1 className='text-white text-4xl font-bold mb-8'>Starry Sky Background Test</h1>

        {/* Test Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Original Card Style */}
          <div className='bg-gradient-to-br from-black/90 via-black/80 to-black/90 rounded-lg p-6 border border-amber-200/10 backdrop-blur-sm'>
            <h2 className='text-white font-semibold mb-4'>Original Black Card</h2>
            <p className='text-amber-100/80'>
              This is how the original cards look with black background.
            </p>
          </div>

          {/* Glassmorphism Test Card */}
          <div className='bg-white/5 backdrop-blur-md border border-white/20 rounded-lg p-6'>
            <h2 className='text-white font-semibold mb-4'>Glassmorphism Card</h2>
            <p className='text-amber-100/80'>
              This card should show the starry background through it.
            </p>
          </div>

          {/* Reference Image Glassmorphism Recreation */}
          <div
            className='relative rounded-2xl p-6 overflow-hidden'
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 193, 7, 0.15)',
              boxShadow: `
                   inset 0 1px 0 rgba(255, 255, 255, 0.05),
                   0 8px 32px rgba(0, 0, 0, 0.3),
                   0 1px 0 rgba(255, 193, 7, 0.1)
                 `,
            }}
          >
            <h2 className='text-white font-semibold mb-4 text-lg'>Reference Recreation</h2>
            <p className='text-gray-300 text-sm leading-relaxed mb-4'>
              Exact glassmorphism effect from reference image with sophisticated backdrop blur and
              subtle amber accents.
            </p>
            <div className='text-xs text-amber-200/60'>✓ Matches reference styling</div>
          </div>

          {/* Premium Glassmorphism */}
          <div
            className='backdrop-blur-lg border border-white/20 rounded-lg p-6 relative overflow-hidden'
            style={{
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.02) 100%)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 0 20px rgba(245,158,11,0.1)',
            }}
          >
            <h2 className='text-white font-semibold mb-4'>Premium Glass Effect</h2>
            <p className='text-amber-100/80'>Advanced glassmorphism with reflections and glow.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
