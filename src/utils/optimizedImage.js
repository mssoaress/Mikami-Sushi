const cloudinaryUpload = '/image/upload/';
const cloudinaryTransform = 'f_auto,q_auto:eco,w_900,c_limit/';
const cloudinaryDetailTransform = 'f_auto,q_auto:good,w_1600,c_limit/';

function transformedCloudinaryImage(source, transform) {
  if (typeof source !== 'string') return source;
  if (!source.includes('res.cloudinary.com') || !source.includes(cloudinaryUpload)) return source;
  if (source.includes(`${cloudinaryUpload}${transform}`)) return source;
  return source.replace(cloudinaryUpload, `${cloudinaryUpload}${transform}`);
}

export function optimizedImageSrc(source) {
  return transformedCloudinaryImage(source, cloudinaryTransform);
}

export function detailImageSrc(source) {
  return transformedCloudinaryImage(source, cloudinaryDetailTransform);
}

export function fallbackToOriginalImage(event, originalSource) {
  const image = event.currentTarget;
  if (!originalSource || image.getAttribute('src') === originalSource) return;
  image.onerror = null;
  image.src = originalSource;
}
