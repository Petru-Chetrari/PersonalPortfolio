import { describe, it, expect } from 'vitest';
import { validateProject } from './validation';

describe('validateProject', () => {
  it('should return invalid for empty fields', () => {
    const project = { title: '', shortDesc: '', appType: '' };
    const { isValid, errors } = validateProject(project);
    expect(isValid).toBe(false);
    expect(errors.title).toBe(true);
    expect(errors.shortDesc).toBe(true);
    expect(errors.appType).toBe(true);
  });

  it('should return invalid for whitespace-only fields', () => {
    const project = { title: '   ', shortDesc: ' \n ', appType: '\t' };
    const { isValid, errors } = validateProject(project);
    expect(isValid).toBe(false);
    expect(errors.title).toBe(true);
    expect(errors.shortDesc).toBe(true);
    expect(errors.appType).toBe(true);
  });

  it('should return valid for properly filled fields', () => {
    const project = { title: 'Test Title', shortDesc: 'Test Desc', appType: 'Web App' };
    const { isValid, errors } = validateProject(project);
    expect(isValid).toBe(true);
    expect(errors.title).toBe(false);
    expect(errors.shortDesc).toBe(false);
    expect(errors.appType).toBe(false);
  });
});
