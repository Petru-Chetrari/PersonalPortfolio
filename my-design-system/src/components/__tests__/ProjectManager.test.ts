import { render, fireEvent, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import ProjectManager from '../ProjectManager.svelte';
import { tick } from 'svelte';

describe('ProjectManager', () => {
  it('should switch to Add New mode when clicking + Add New', async () => {
    render(ProjectManager);
    
    // Find the Add New button
    const addNewBtn = screen.getByText('+ Add New');
    expect(addNewBtn).toBeInTheDocument();

    // Click it
    await fireEvent.click(addNewBtn);
    
    // Header should change to 'New Project'
    expect(screen.getByText('New Project')).toBeInTheDocument();
    
    // An empty input for title should be present
    const titleInput = screen.getByPlaceholderText('Project title') as HTMLInputElement;
    expect(titleInput.value).toBe('');
  });

  it('should update the detail view when selecting a different project', async () => {
    // We assume the component has initial mock data rendered in the sidebar
    // We get the rendered container to find sidebar items if they aren't uniquely labeled, or just search by text
    render(ProjectManager);

    // Initial project should be Lumina Mobile Banking (first in array or second, we know "Lumina Mobile Banking" is in the mock data based on earlier context)
    const luminaBtn = screen.getByText('Lumina Mobile Banking');
    expect(luminaBtn).toBeInTheDocument();

    // Click Lumina project
    await fireEvent.click(luminaBtn);
    
    // The main detail view header (read-only mode) rendering the title
    // Since Svelte testing library searches the whole DOM, we look for the heading
    const headings = screen.getAllByText('Lumina Mobile Banking');
    expect(headings.length).toBeGreaterThan(1); // One in sidebar, one in details panel
  });
});
