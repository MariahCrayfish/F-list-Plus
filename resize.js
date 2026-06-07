const MAX_DIMENSION = 8000; // site accepted max dimension
const MAX_IMAGE_MB = 8; // site accepted max file size
const INITIAL_QUALITY = 0.92;
const MAX_COMPRESS_ITERATIONS = 6;
const QUALITY_DECREMENT = 0.1;

function _getFormat(file) {
  if (file.type === "image/png") return "png";
  if (file.type === "image/gif") return "gif";
  if (file.type === "image/webp") return "webp";
  return "jpeg";
}

function _hasTransparency(bitmap) {
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(bitmap, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  for (let i = 3; i < imageData.length; i += 4) {
    if (imageData[i] < 255) return true;
  }

  return false;
}

function getResizedDimensions(bitmap, maxDim) {
  let width = bitmap.width;
  let height = bitmap.height;

  const scale = Math.min(1, maxDim / Math.max(width, height));

  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  };
}

function _drawToCanvas(bitmap, width, height) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(bitmap, 0, 0, width, height);

  return canvas;
}

async function _encode(canvas, { format, quality }) {
  return await new Promise((resolve) =>
    canvas.toBlob(resolve, format, quality),
  );
}

async function compressJPEG(canvas) {
  let quality = INITIAL_QUALITY;
  let blob;

  for (let i = 0; i < MAX_COMPRESS_ITERATIONS; i++) {
    blob = await _encode(canvas, {
      format: "image/jpeg",
      quality,
    });

    if (blob.size <= MAX_IMAGE_MB * 1024 * 1024) break;

    quality = Math.max(0.1, quality - QUALITY_DECREMENT);
  }

  return blob;
}

async function processImage(file) {
  const bitmap = await createImageBitmap(file);
  const format = _getFormat(file);
  if (format === "gif") return file; // Skip compression for GIFs

  const { width, height } = getResizedDimensions(bitmap, MAX_DIMENSION);
  const canvas = _drawToCanvas(bitmap, width, height);

  let blob;

  if (format === "png") {
    const transparent = _hasTransparency(bitmap);
    if (transparent) {
      blob = await _encode(canvas, {
        format: "image/png",
        quality: undefined,
      });
      return new File([blob], file.name, { type: "image/png" });
    }
  }

  blob = await compressJPEG(canvas);
  return new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), {
    type: "image/jpeg",
  });
}
