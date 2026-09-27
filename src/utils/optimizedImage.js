const cloudinaryUpload = '/image/upload/';
const cloudinaryTransform = 'f_auto,q_auto:eco,w_900,c_limit/';

export function optimizedImageSrc(source) {
  if (typeof source !== 'string') return source;
  if (!source.includes('res.cloudinary.com') || !source.includes(cloudinaryUpload)) return source;
  if (source.includes(`${cloudinaryUpload}${cloudinaryTransform}`)) return source;
  return source.replace(cloudinaryUpload, `${cloudinaryUpload}${cloudinaryTransform}`);
}

export function fallbackToOriginalImage(event, originalSource) {
  const image = event.currentTarget;
  if (!originalSource || image.getAttribute('src') === originalSource) return;
  image.onerror = null;
  image.src = originalSource;
}
