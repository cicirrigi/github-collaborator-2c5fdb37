import { render, screen } from '@testing-library/react';
import Page from './page';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Contact page', () => {
  it('renders page title correctly', () => {
    render(<Page />);
    expect(screen.getByRole('heading', { name: 'Contact' })).toBeInTheDocument();
  });

  it('renders base content section', () => {
    render(<Page />);
    expect(screen.getByText(/Welcome to Contact/)).toBeInTheDocument();
    expect(screen.getByText(/generated automatically/)).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Page />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders hero section for marketing layout', () => {
    render(<Page />);
    expect(screen.getByText('Discover premium experiences')).toBeInTheDocument();
  });
});
