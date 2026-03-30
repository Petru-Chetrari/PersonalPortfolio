import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import AdminNav from '../AdminNav.svelte';

describe('AdminNav', () => {
  it('should render navigation items', () => {
    // We have to mock or supply window.location/props if AdminNav relies on currentPath
    render(AdminNav, { props: { currentPath: '/admin/projects' } } as any);
    
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Commissions')).toBeInTheDocument();
    expect(screen.getByText('Stats')).toBeInTheDocument();
  });

  it('should toggle mobile menu', async () => {
    render(AdminNav, { props: { currentPath: '/admin/projects' } } as any);
    
    const toggleBtn = screen.getByRole('button', { name: /Admin Menu/i });
    await fireEvent.click(toggleBtn);
    
    const allProjects = screen.getAllByText('Projects');
    expect(allProjects.length).toBeGreaterThan(1);
  });
});
