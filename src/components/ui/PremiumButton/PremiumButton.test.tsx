/**
 * 🧩 PremiumButton – Vantage Lane UI v3.0.0
 * Generated on 2025-10-20T00:29:37.491Z
 * Type: base
 */

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import { PremiumButton } from './PremiumButton';

expect.extend(toHaveNoViolations);

describe('PremiumButton', () => {
  it('renders children', () => {
    render(<PremiumButton>Hello</PremiumButton>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('supports polymorphic as="button"', () => {
    render(<PremiumButton as='button'>Btn</PremiumButton>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('no a11y violations', async () => {
    const { container } = render(<PremiumButton>A</PremiumButton>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('applies disabled state', () => {
    render(<PremiumButton disabled>Disabled</PremiumButton>);
    const el = screen.getByText('Disabled').parentElement ?? screen.getByText('Disabled');
    expect(el).toHaveClass('opacity-50');
    expect(el).toHaveAttribute('aria-disabled', 'true');
  });

  it('applies loading state', () => {
    render(<PremiumButton loading>Loading</PremiumButton>);
    const el = screen.getByText('Loading').parentElement ?? screen.getByText('Loading');
    expect(el).toHaveClass('cursor-wait');
    expect(el).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument(); // spinner SVG
  });

  it('shows type=button when as=button', () => {
    render(<PremiumButton as='button'>Button</PremiumButton>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('type', 'button');
  });

  it('adds data attributes for testing', () => {
    render(
      <PremiumButton variant='primary' size='lg' data-testid='test'>
        Test
      </PremiumButton>
    );
    const el = screen.getByTestId('test');
    expect(el).toHaveAttribute('data-variant', 'primary');
    expect(el).toHaveAttribute('data-size', 'lg');
  });
});
