
export const resizeImage = (
  file: File,
  maxWidth: number = 600,
  maxHeight: number = 200,
  quality: number = 0.8
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculer les nouvelles dimensions en gardant le ratio
      let { width, height } = img;
      
      if (width > maxWidth || height > maxHeight) {
        const aspectRatio = width / height;
        
        if (width > height) {
          width = maxWidth;
          height = width / aspectRatio;
        } else {
          height = maxHeight;
          width = height * aspectRatio;
        }
      }

      // Redimensionner l'image
      canvas.width = width;
      canvas.height = height;
      
      if (ctx) {
        // Améliorer la qualité du redimensionnement
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Ajouter un fond blanc si l'image est transparente
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);
        
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(resizedFile);
            } else {
              reject(new Error('Impossible de redimensionner l\'image'));
            }
          },
          file.type,
          quality
        );
      } else {
        reject(new Error('Impossible d\'obtenir le contexte du canvas'));
      }
    };

    img.onerror = () => reject(new Error('Impossible de charger l\'image'));
    img.src = URL.createObjectURL(file);
  });
};

export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Format non supporté. Utilisez PNG, JPG ou SVG.'
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'Fichier trop volumineux. Maximum 5MB.'
    };
  }

  return { isValid: true };
};
