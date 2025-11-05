/**
 * 📧 NewsletterCard Component - PLACEHOLDER
 * This file is not used - see NewsletterCard.simple.tsx
 */

export { NewsletterCard } from './NewsletterCard.simple';
 * />
 */
export function NewsletterCard({
  title = "Join Our VIP Newsletter",
  subtitle = "Get exclusive access to premium offers and luxury travel insights",
  submitText = "Subscribe to VIP Newsletter",
  isLoading: externalLoading = false,
  error: externalError,
  success: externalSuccess,
  className,
  onSubmit,
  showConsent = true,
  consentText = "I agree to receive marketing communications and understand I can unsubscribe at any time.",
  children,
}: NewsletterCardProps) {
  const tokens = newsletterCardTokens;
  
  // Internal form state
  const [formData, setFormData] = useState<NewsletterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    consent: false,
  });
  
  const [internalState, setInternalState] = useState<NewsletterFormState>('idle');
  const [internalError, setInternalError] = useState<string>('');
  
  // Use external state if provided, otherwise use internal
  const isLoading = externalLoading || internalState === 'loading';
  const error = externalError || internalError;
  const success = externalSuccess || internalState === 'success';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      setInternalError('Please fill in all required fields.');
      return;
    }
    
    if (showConsent && !formData.consent) {
      setInternalError('Please agree to receive communications.');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setInternalError('Please enter a valid email address.');
      return;
    }
    
    setInternalError('');
    setInternalState('loading');
    
    try {
      if (onSubmit) {
        await onSubmit(formData);
      }
      setInternalState('success');
      // Reset form after success
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        consent: false,
      });
    } catch (err) {
      setInternalError(err instanceof Error ? err.message : 'An error occurred');
      setInternalState('error');
    }
  };

  const handleInputChange = (field: keyof NewsletterFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (error) {
      setInternalError('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: parseFloat(tokens.animations.slideUp.duration),
        ease: tokens.animations.slideUp.ease,
      }}
      viewport={{ once: true }}
      className={cn(
        'relative border backdrop-blur-sm',
        className
      )}
      style={{
        backgroundColor: tokens.card.backgroundColor,
        borderColor: tokens.card.borderColor,
        borderRadius: tokens.card.borderRadius,
        padding: `${tokens.card.padding.mobile}`,
        backdropFilter: tokens.card.backdropBlur,
        boxShadow: tokens.card.shadow,
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: tokens.typography.subtitle.marginBottom }}>
        <h3
          style={{
            fontSize: tokens.typography.title.fontSize,
            lineHeight: tokens.typography.title.lineHeight,
            fontWeight: tokens.typography.title.fontWeight,
            color: tokens.typography.title.color,
            marginBottom: tokens.typography.title.marginBottom,
          }}
        >
          {title}
        </h3>
        
        <p
          style={{
            fontSize: tokens.typography.subtitle.fontSize,
            lineHeight: tokens.typography.subtitle.lineHeight,
            color: tokens.typography.subtitle.color,
          }}
        >
          {subtitle}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: tokens.form.spacing.fieldGap }}>
        {/* Name fields grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fit, minmax(200px, ${tokens.grid.desktop}))`,
            gap: tokens.form.spacing.gridGap,
          }}
        >
          <input
            type="text"
            placeholder="First Name"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            disabled={isLoading}
            required
            style={{
              padding: tokens.form.input.padding,
              backgroundColor: tokens.form.input.backgroundColor,
              borderColor: error ? tokens.states.error.borderColor : tokens.form.input.borderColor,
              borderRadius: tokens.form.input.borderRadius,
              fontSize: tokens.form.input.fontSize,
              color: tokens.form.input.color,
              border: '1px solid',
              outline: 'none',
              transition: tokens.form.input.transition,
            }}
            onFocus={(e) => {
              const target = e.target as HTMLInputElement;
              target.style.borderColor = tokens.form.input.focusBorderColor;
              target.style.boxShadow = `0 0 0 3px ${tokens.form.input.focusRingColor}`;
            }}
            onBlur={(e) => {
              const target = e.target as HTMLInputElement;
              target.style.borderColor = tokens.form.input.borderColor;
              target.style.boxShadow = 'none';
            }}
          />
          
          <input
            type="text"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            disabled={isLoading}
            required
            style={{
              padding: tokens.form.input.padding,
              backgroundColor: tokens.form.input.backgroundColor,
              borderColor: error ? tokens.states.error.borderColor : tokens.form.input.borderColor,
              borderRadius: tokens.form.input.borderRadius,
              fontSize: tokens.form.input.fontSize,
              color: tokens.form.input.color,
              border: '1px solid',
              outline: 'none',
              transition: tokens.form.input.transition,
            }}
            onFocus={(e) => {
              const target = e.target as HTMLInputElement;
              target.style.borderColor = tokens.form.input.focusBorderColor;
              target.style.boxShadow = `0 0 0 3px ${tokens.form.input.focusRingColor}`;
            }}
            onBlur={(e) => {
              const target = e.target as HTMLInputElement;
              target.style.borderColor = tokens.form.input.borderColor;
              target.style.boxShadow = 'none';
            }}
          />

        {/* Email field */}
        <input
          type="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          disabled={isLoading}
          required
          style={{
            padding: tokens.form.input.padding,
            backgroundColor: tokens.form.input.backgroundColor,
            borderColor: error ? tokens.states.error.borderColor : tokens.form.input.borderColor,
            borderRadius: tokens.form.input.borderRadius,
            fontSize: tokens.form.input.fontSize,
            color: tokens.form.input.color,
            border: '1px solid',
            outline: 'none',
            transition: tokens.form.input.transition,
          }}
          onFocus={(e) => {
            e.target.style.borderColor = tokens.form.input.focusBorderColor;
            e.target.style.boxShadow = `0 0 0 3px ${tokens.form.input.focusRingColor}`;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = tokens.form.input.borderColor;
            e.target.style.boxShadow = 'none';
          }}
        />

        {/* Consent checkbox */}
        {showConsent && (
          <label
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <input
              type="checkbox"
              checked={formData.consent}
              onChange={(e) => handleInputChange('consent', e.target.checked)}
              disabled={isLoading}
              style={{
                width: tokens.form.checkbox.size,
                height: tokens.form.checkbox.size,
                backgroundColor: tokens.form.checkbox.backgroundColor,
                borderColor: tokens.form.checkbox.borderColor,
                borderRadius: tokens.form.checkbox.borderRadius,
                marginTop: '0.125rem', // Align with text
              }}
            />
            <span
              style={{
                fontSize: '0.875rem',
                lineHeight: '1.5',
                color: tokens.typography.subtitle.color,
              }}
            >
              {consentText}{' '}
              <a 
                href="/privacy" 
                style={{ 
                  color: 'var(--brand-primary)',
                  textDecoration: 'none' 
                }}
                onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
              >
                Privacy Policy
              </a>.
            </span>
          </label>
        )}

        {/* Error message */}
        {error && (
          <div
            style={{
              padding: '0.75rem',
              backgroundColor: tokens.states.error.backgroundColor,
              borderColor: tokens.states.error.borderColor,
              borderRadius: tokens.form.input.borderRadius,
              border: '1px solid',
              fontSize: '0.875rem',
              color: 'var(--destructive)',
            }}
          >
            {error}
          </div>
        )}

        {/* Success message */}
        {success && (
          <div
            style={{
              padding: '0.75rem',
              backgroundColor: tokens.states.success.backgroundColor,
              borderColor: tokens.states.success.borderColor,
              borderRadius: tokens.form.input.borderRadius,
              border: '1px solid',
              fontSize: '0.875rem',
              color: 'var(--success)',
            }}
          >
            {typeof success === 'string' ? success : 'Successfully subscribed!'}
          </div>
        )}

        {/* Submit button */}
        <div style={{ marginTop: tokens.form.spacing.buttonMarginTop }}>
          <PremiumButton
            type="submit"
            variant="primary"
            size="lg"
            loading={isLoading}
            disabled={isLoading || (!showConsent ? false : !formData.consent)}
            className="w-full"
          >
            {submitText}
          </PremiumButton>
        </div>
      </form>

      {/* Additional content */}
      {children && (
        <div style={{ marginTop: tokens.form.spacing.buttonMarginTop }}>
          {children}
        </div>
      )}
    </motion.div>
  );
}

export type { NewsletterCardProps, NewsletterFormData, NewsletterFormState } from './NewsletterCard.types';
