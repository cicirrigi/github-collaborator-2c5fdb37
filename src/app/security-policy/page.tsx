import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Security Policy - Vantage Lane',
  description:
    'Our comprehensive security policy and vulnerability disclosure guidelines for responsible security research.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function SecurityPolicyPage() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-neutral-950 to-black'>
      <div className='container mx-auto max-w-5xl py-16 px-6'>
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
              Policy
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

        {/* Policy Content */}
        <div className='space-y-8'>
          {/* Introduction */}
          <div className='bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8'>
            <h2 className='text-2xl font-semibold text-white mb-6 flex items-center gap-3'>
              <span className='text-green-400'>🛡️</span>
              Our Commitment to Security
            </h2>
            <p className='text-neutral-300 leading-relaxed mb-4'>
              At Vantage Lane, we take the security of our systems, customer data, and operations
              very seriously. We are committed to maintaining the highest standards of security and
              privacy in the luxury transportation industry.
            </p>
            <p className='text-neutral-300 leading-relaxed'>
              This policy outlines our approach to security vulnerabilities, responsible disclosure,
              and our commitment to working with the security research community.
            </p>
          </div>

          {/* Reporting Vulnerabilities */}
          <div className='bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8'>
            <h2 className='text-2xl font-semibold text-white mb-6 flex items-center gap-3'>
              <span className='text-red-400'>🚨</span>
              Reporting Security Vulnerabilities
            </h2>

            <div className='grid md:grid-cols-2 gap-6 mb-6'>
              <div className='bg-black/20 border border-green-500/20 rounded-xl p-6'>
                <h3 className='text-lg font-medium text-green-400 mb-4'>✅ Please DO</h3>
                <ul className='space-y-2 text-sm text-neutral-300'>
                  <li>• Report vulnerabilities to security@vantagelane.com</li>
                  <li>• Use PGP encryption for sensitive reports</li>
                  <li>• Provide detailed reproduction steps</li>
                  <li>• Allow reasonable time for remediation</li>
                  <li>• Act in good faith and follow responsible disclosure</li>
                </ul>
              </div>

              <div className='bg-black/20 border border-red-500/20 rounded-xl p-6'>
                <h3 className='text-lg font-medium text-red-400 mb-4'>❌ Please DON&apos;T</h3>
                <ul className='space-y-2 text-sm text-neutral-300'>
                  <li>• Access, modify, or delete user data</li>
                  <li>• Perform tests that may affect service availability</li>
                  <li>• Disclose vulnerabilities publicly before resolution</li>
                  <li>• Violate privacy of users or employees</li>
                  <li>• Perform social engineering attacks</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Our Commitments */}
          <div className='bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8'>
            <h2 className='text-2xl font-semibold text-white mb-6 flex items-center gap-3'>
              <span className='text-blue-400'>🤝</span>
              Our Commitments to You
            </h2>

            <div className='grid md:grid-cols-3 gap-6'>
              <div className='text-center'>
                <div className='w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <span className='text-2xl'>⚡</span>
                </div>
                <h3 className='font-semibold text-white mb-2'>Quick Response</h3>
                <p className='text-sm text-neutral-400'>
                  Acknowledge receipt within 48 hours of report submission
                </p>
              </div>

              <div className='text-center'>
                <div className='w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <span className='text-2xl'>📋</span>
                </div>
                <h3 className='font-semibold text-white mb-2'>Clear Timeline</h3>
                <p className='text-sm text-neutral-400'>
                  Provide resolution timeline and regular status updates
                </p>
              </div>

              <div className='text-center'>
                <div className='w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <span className='text-2xl'>🏆</span>
                </div>
                <h3 className='font-semibold text-white mb-2'>Recognition</h3>
                <p className='text-sm text-neutral-400'>
                  Credit responsible researchers on our acknowledgments page
                </p>
              </div>
            </div>
          </div>

          {/* Scope */}
          <div className='bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8'>
            <h2 className='text-2xl font-semibold text-white mb-6 flex items-center gap-3'>
              <span className='text-purple-400'>🌐</span>
              Scope of This Policy
            </h2>

            <div className='grid md:grid-cols-2 gap-6'>
              <div>
                <h3 className='font-semibold text-white mb-3'>✅ In Scope</h3>
                <ul className='space-y-1 text-sm text-neutral-300'>
                  <li>• vantagelane.com (main website)</li>
                  <li>• www.vantagelane.com</li>
                  <li>• api.vantagelane.com</li>
                  <li>• booking.vantagelane.com</li>
                  <li>• Mobile applications</li>
                  <li>• Customer-facing systems</li>
                </ul>
              </div>

              <div>
                <h3 className='font-semibold text-white mb-3'>❌ Out of Scope</h3>
                <ul className='space-y-1 text-sm text-neutral-300'>
                  <li>• Third-party services and integrations</li>
                  <li>• Physical security of offices/vehicles</li>
                  <li>• Social engineering attacks</li>
                  <li>• Denial of Service attacks</li>
                  <li>• Issues requiring physical access</li>
                  <li>• Spam or social engineering reports</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className='bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-xl p-6'>
            <div className='flex items-center gap-3 mb-4'>
              <span className='text-2xl'>📧</span>
              <h3 className='text-xl font-semibold text-white'>Get in Touch</h3>
            </div>

            <div className='grid md:grid-cols-2 gap-6 text-sm'>
              <div>
                <p className='text-yellow-200 font-medium mb-2'>Primary Contact:</p>
                <p className='text-yellow-100'>security@vantagelane.com</p>
                <p className='text-yellow-200/80 mt-2'>
                  PGP Key: Available at /.well-known/pgp-key.txt
                </p>
              </div>

              <div>
                <p className='text-yellow-200 font-medium mb-2'>Alternative:</p>
                <p className='text-yellow-100'>Contact form at /contact</p>
                <p className='text-yellow-200/80 mt-2'>Response time: Within 48 hours</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='mt-12 text-center text-sm text-neutral-400'>
          <p>
            This policy is effective as of November 5, 2025. We reserve the right to modify this
            policy at any time.
          </p>
          <p className='mt-2'>
            For questions about this policy, contact us at security@vantagelane.com
          </p>
        </div>
      </div>
    </div>
  );
}
