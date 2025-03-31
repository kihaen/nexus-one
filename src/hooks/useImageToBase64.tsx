import { useState, useCallback } from 'react';

const useImageToBase64 = () => {
  const [base64Images, setBase64Images] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const imagesToBase64 = useCallback(async (files: FileList | File[] | null | undefined) => {
    setLoading(true);
    setError(null);

    try {
      if (!files || files.length === 0) {
        throw new Error('No files provided');
      }

      // Convert FileList to array if needed
      const filesArray = Array.from(files);

      const conversionPromises = filesArray.map(file => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();

          reader.onload = (event) => {
            const result = event.target?.result;
            if (typeof result === 'string') {
              resolve(result);
            } else {
              reject(new Error('Failed to convert image to base64'));
            }
          };

          reader.onerror = () => {
            reject(new Error('Error reading the file'));
          };

          reader.readAsDataURL(file);
        });
      });

      const results = await Promise.all(conversionPromises);
      setBase64Images(results);

    } catch (err) {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error('An unexpected error occurred'));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const clearImages = useCallback(() => {
    setBase64Images([]);
    setError(null);
  }, []);

  return { 
    base64Images, 
    imagesToBase64, 
    clearImages,
    loading, 
    error 
  };
};

export default useImageToBase64;