
import type { WizardData } from '../types';

export const generateCode = async (data: WizardData): Promise<string> => {
  // Create a serializable version of the data, as File objects can't be stringified.
  const serializableData = {
      ...data,
      brand: data.brand ? { name: data.brand.name, size: data.brand.size, type: data.brand.type } : null,
  };

  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(serializableData),
  });

  if (!response.ok) {
    const errorResult = await response.json();
    throw new Error(errorResult.error || 'Failed to generate code');
  }

  const result = await response.json();
  return result.code;
};
