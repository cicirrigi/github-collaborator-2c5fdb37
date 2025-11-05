import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Security Acknowledgments - Vantage Lane',
  description:
    'Recognition for security researchers who have helped improve Vantage Lane security.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function SecurityAcknowledgmentsPage() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-neutral-950 to-black'>
      <div className='container mx-auto max-w-4xl py-16 px-6'>
        {/* Header */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl md:text-5xl font-light tracking-wide mb-6'>
            <span
              style={{
                color: 'var(--brand-primary)',
                textShadow: '0 0 25px rgba(203, 178, 106, 0.7), 0 0 35px rgba(203, 178, 106, 0.4)',
                filter: 'brightness(1.2)',
              }}
            >
              Security
            </span>
            <span> </span>
            <span
              style={{
                color: 'var(--text-primary)',
                textShadow: '0 0 18px rgba(220, 220, 255, 0.5), 0 0 30px rgba(180, 180, 255, 0.3)',
                filter: 'brightness(1.18)',
              }}
            >
              Acknowledgments
            </span>
          </h1>

          <div
            className='mx-auto mb-8'
            style={{
              width: '6rem',
              height: '1px',
              background:
                'linear-gradient(to right, transparent, var(--brand-primary), transparent)',
              margin: '2rem auto',
            }}
          ></div>
        </div>

        {/* Content */}
        <div className='bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8'>
          <div className='text-center mb-8'>
            <h2 className='text-2xl font-semibold text-white mb-4'>
              Responsible Security Research Recognition
            </h2>
            <p className='text-neutral-300 max-w-2xl mx-auto leading-relaxed'>
              We deeply appreciate the security research community&apos;s contributions to keeping
              Vantage Lane secure. This page recognizes verified researchers who have responsibly
              disclosed security vulnerabilities.
            </p>
          </div>

          {/* Status */}
          <div className='bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-xl p-6 mb-8'>
            <div className='flex items-center gap-3 mb-2'>
              <div className='w-3 h-3 rounded-full bg-yellow-500'></div>
              <h3 className='text-lg font-medium text-yellow-100'>Page Under Preparation</h3>
            </div>
            <p className='text-yellow-200/80'>
              Our security acknowledgments page is currently being prepared. Verified security
              researchers who have responsibly disclosed vulnerabilities will be listed here soon.
            </p>
          </div>

          {/* How to Report */}
          <div className='grid md:grid-cols-2 gap-6'>
            <div className='bg-black/20 border border-white/10 rounded-xl p-6'>
              <h3 className='text-lg font-semibold text-white mb-3 flex items-center gap-2'>
                <span className='text-green-400'>🛡️</span>
                Report a Vulnerability
              </h3>
              <p className='text-neutral-300 text-sm mb-4'>
                Found a security issue? Please report it responsibly through our official channels.
              </p>
              <div className='space-y-2 text-sm'>
                <div>
                  <span className='text-neutral-400'>Email:</span>
                  <span className='text-white ml-2'>security@vantagelane.com</span>
                </div>
                <div>
                  <span className='text-neutral-400'>Response Time:</span>
                  <span className='text-green-400 ml-2'>Within 48 hours</span>
                </div>
              </div>
            </div>

            <div className='bg-black/20 border border-white/10 rounded-xl p-6'>
              <h3 className='text-lg font-semibold text-white mb-3 flex items-center gap-2'>
                <span className='text-blue-400'>📋</span>
                Guidelines
              </h3>
              <p className='text-neutral-300 text-sm mb-4'>
                Please follow our responsible disclosure guidelines when reporting vulnerabilities.
              </p>
              <div className='space-y-1 text-sm text-neutral-400'>
                <div>• Use official channels only</div>
                <div>• No harm to systems or users</div>
                <div>• No access to user data</div>
                <div>• Allow time for remediation</div>
              </div>
            </div>
          </div>

          {/* Future Recognition */}
          <div className='mt-8 text-center'>
            <p className='text-neutral-400 text-sm'>
              Verified researchers will be recognized here with their permission. We believe in
              giving credit where credit is due.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
