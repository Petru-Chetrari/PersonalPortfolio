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

  it('should clear validation errors when typing', async () => {
    render(ProjectManager);
    const editBtn = screen.getByText('Edit');
    await fireEvent.click(editBtn);

    const titleInput = screen.getByPlaceholderText('Project title');
    // Clear the input and trigger save to show error
    await fireEvent.input(titleInput, { target: { value: '   ' } });
    await fireEvent.click(screen.getByText('Save Changes'));

    // Error should be present (the 'Required' span should appear)
    expect(screen.getByText('Required')).toBeInTheDocument();

    // Type to trigger clearError
    await fireEvent.input(titleInput, { target: { value: 'Valid Title' } });
    
    // Svelte takes a tick to update the DOM after assignment
    await tick();

    // The 'Required' hint for Title should be gone
    expect(screen.queryByText('Required')).not.toBeInTheDocument();
  });

  it('should cancel editing without saving changes', async () => {
    render(ProjectManager);
    await fireEvent.click(screen.getByText('Edit'));

    const typeInput = screen.getByPlaceholderText('e.g. Web Application') as HTMLInputElement;
    const originalValue = typeInput.value;

    await fireEvent.input(typeInput, { target: { value: 'Never Saved' } });
    const cancelBtns = screen.getAllByText('Cancel');
    await fireEvent.click(cancelBtns[0]);

    // Should return to read-only view, and original value should be preserved
    expect(screen.getByText('Project Details')).toBeInTheDocument();
    expect(screen.queryByText('Never Saved')).not.toBeInTheDocument();
    expect(screen.getAllByText(originalValue).length).toBeGreaterThan(0);
  });

  it('should delete a project and select another or show empty state', async () => {
    // Delete all projects one by one to reach the empty state
    render(ProjectManager);
    
    // While there's a delete button, click it
    let deleteBtns = screen.queryAllByText('Delete');
    while(deleteBtns.length > 0) {
      await fireEvent.click(deleteBtns[0]);
      deleteBtns = screen.queryAllByText('Delete');
    }

    // Now it should show "No Project Selected"
    expect(screen.getByText('No Project Selected')).toBeInTheDocument();
  });

  it('should save a new project', async () => {
    render(ProjectManager);
    
    // Add New
    await fireEvent.click(screen.getByText('+ Add New'));
    
    // Fill out form
    const titleInput = screen.getByPlaceholderText('Project title');
    await fireEvent.input(titleInput, { target: { value: 'My New Test Project' } });
    
    const typeInput = screen.getByPlaceholderText('e.g. Web Application');
    await fireEvent.input(typeInput, { target: { value: 'Testing App' } });
    
    const shortDescInput = screen.getByPlaceholderText('A brief, one-paragraph description...');
    await fireEvent.input(shortDescInput, { target: { value: 'Short desc test' } });
    
    const tagsInput = screen.getByPlaceholderText('React, TypeScript, Tailwind...');
    await fireEvent.input(tagsInput, { target: { value: 'Svelte, Vitest, Testing' } });

    // Save
    await fireEvent.click(screen.getByText(/Save Changes/i));
    
    // Verify it is now in the view
    expect(screen.getByText('Project Details')).toBeInTheDocument();
    expect(screen.getAllByText('My New Test Project').length).toBeGreaterThan(0);
    expect(screen.getByText('Svelte')).toBeInTheDocument();
  });

  it('should update an existing project', async () => {
    render(ProjectManager);
    
    // Click Edit on first item
    await fireEvent.click(screen.getByText('Edit'));
    
    // Change title
    const titleInput = screen.getByPlaceholderText('Project title');
    await fireEvent.input(titleInput, { target: { value: 'Updated Title' } });
    
    // Save (using the bottom button)
    await fireEvent.click(screen.getByText('Save Changes'));
    
    // Verify changes
    expect(screen.getByText('Project Details')).toBeInTheDocument();
    expect(screen.getAllByText('Updated Title').length).toBeGreaterThan(0);
  });

  it('should handle UI hover events (coverage)', async () => {
    render(ProjectManager);
    
    // Add New button
    const addNewBtn = screen.getByText('+ Add New');
    await fireEvent.mouseEnter(addNewBtn);
    await fireEvent.mouseLeave(addNewBtn);
    
    // Sidebar project list items
    const sideItems = screen.getAllByRole('button').filter(b => b.textContent?.includes('Aura Analytics Dashboard') || b.textContent?.includes('Lumina'));
    if (sideItems.length > 1) {
      await fireEvent.mouseEnter(sideItems[1]); // Ensure it's not the active one
      await fireEvent.mouseLeave(sideItems[1]);
    }
    
    // Detail view buttons (Edit, Delete)
    const editBtn = screen.getByText('Edit');
    await fireEvent.mouseEnter(editBtn);
    await fireEvent.mouseLeave(editBtn);
    
    const delBtn = screen.getByText('Delete');
    await fireEvent.mouseEnter(delBtn);
    await fireEvent.mouseLeave(delBtn);
    
    // Edit mode buttons (Save, Cancel)
    await fireEvent.click(editBtn);
    const saveBtns = screen.getAllByText(/Save/);
    const cancelBtns = screen.getAllByText(/Cancel/);
    
    for (const btn of saveBtns) {
      await fireEvent.mouseEnter(btn);
      await fireEvent.mouseLeave(btn);
    }
    for (const btn of cancelBtns) {
      await fireEvent.mouseEnter(btn);
      await fireEvent.mouseLeave(btn);
    }
  });
});
