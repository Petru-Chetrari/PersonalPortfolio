import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import Footer from '../Footer.svelte';

describe('Footer', () => {
  it('should render the footer content', () => {
    const { container } = render(Footer as any);
    
    // Typically the footer has copyright text
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(currentYear.toString(), 'i'))).toBeInTheDocument();
    expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument();
  });
});
