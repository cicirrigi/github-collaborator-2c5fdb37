/**
 * 🧩 TestButton – Vantage Lane UI v3.0.0
 * Generated on 2025-10-20T00:24:01.157Z
 * Type: base
 */

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import { TestButton } from './TestButton';

expect.extend(toHaveNoViolations);

describe('TestButton', () => {
  it('renders children', () => {
    render(<TestButton>Hello</TestButton>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('supports polymorphic as="button"', () => {
    render(<TestButton as="button">Btn</TestButton>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('no a11y violations', async () => {
    const { container } = render(<TestButton>A</TestButton>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('applies disabled state', () => {
    render(<TestButton disabled>Disabled</TestButton>);
    const el = screen.getByText('Disabled').parentElement ?? screen.getByText('Disabled');
    expect(el).toHaveClass('opacity-50');
  });
});
