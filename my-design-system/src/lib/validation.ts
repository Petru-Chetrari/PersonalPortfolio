export interface ValidationErrors {
  title: boolean;
  shortDesc: boolean;
  appType: boolean;
  longDesc?: boolean;
}

export function validateProject(project: {
  title?: string;
  shortDesc?: string;
  appType?: string;
  longDesc?: string;
}): { isValid: boolean; errors: ValidationErrors } {
  const errors: ValidationErrors = {
    title: !(project.title?.trim()),
    shortDesc: !(project.shortDesc?.trim()),
    appType: !(project.appType?.trim()),
    longDesc: !(project.longDesc?.trim()),
  };

  const isValid = !errors.title && !errors.shortDesc && !errors.appType;

  return { isValid, errors };
}
