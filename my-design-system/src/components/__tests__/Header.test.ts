import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import Header from '../Header.svelte';

describe('Header', () => {
  it('should render the header brand and links', () => {
    // We pass any required props if needed, or just render it
    const { container } = render(Header as any);
    
    // Check for specific alt text for the images
    expect(screen.getByAltText('Logo')).toBeInTheDocument();
    expect(screen.getByAltText('Brand Text')).toBeInTheDocument();

    // Check for nav links
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Hire Me')).toBeInTheDocument();
    expect(screen.getByText('Client Portal')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
    
    // Check for Sign In button
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  it('should toggle mobile menu and handle scroll', async () => {
    render(Header as any);
    
    const menuBtn = screen.getByRole('button', { name: /Toggle menu/i });
    await fireEvent.click(menuBtn);
    
    // Check mobile dropdown for duplicated home link
    expect(screen.getAllByText('Home').length).toBeGreaterThan(1);
    
    // Simulate scroll
    await fireEvent.scroll(window, { target: { scrollY: 100 } });
  });
});
