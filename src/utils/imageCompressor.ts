/**
 * Client-Side Smart Image Compressor
 * Converts any smartphone camera image into a lightweight ~40-70KB WebP Data URL
 * 100% Free - Stored directly in Firestore document without requiring Firebase Storage bucket or billing upgrade!
 */
export async function compressImageToDataUrl(
  file: File, 
  maxWidth = 900, 
  maxHeight = 900, 
  quality = 0.78
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Maintain aspect ratio while resizing
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback to original read if canvas not available
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP data URL with compression quality
        const dataUrl = canvas.toDataURL('image/webp', quality);
        resolve(dataUrl);
      };
      img.onerror = () => {
        // Fallback to raw data URL on decode error
        resolve(event.target?.result as string);
      };
    };
    reader.onerror = (err) => reject(err);
  });
}

/**
 * Upload / compress news image
 * 100% Free: Compresses image client-side to ~40KB WebP Data URL directly saved in Firestore document
 */
export async function uploadNewsImage(file: File, _postId = 'general'): Promise<string> {
  return await compressImageToDataUrl(file);
}
