/**
 * Renders a 16:9 JPEG from a source image using an offset (0-100 %) and zoom
 * scale, matching the framing shown in the crop UI.
 */
export type CropState = { x: number; y: number; scale: number };

export const DEFAULT_CROP: CropState = { x: 50, y: 50, scale: 1 };

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load image"));
    img.src = src;
  });
}

export async function renderCroppedThumb(
  source: Blob,
  crop: CropState,
  outWidth = 1280,
): Promise<Blob> {
  const url = URL.createObjectURL(source);
  try {
    const img = await loadImage(url);
    const outHeight = Math.round((outWidth * 9) / 16);

    const canvas = document.createElement("canvas");
    canvas.width = outWidth;
    canvas.height = outHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return source;

    // Same maths as CSS `object-fit: cover` + `object-position` + zoom.
    const base = Math.max(outWidth / img.width, outHeight / img.height);
    const scale = base * crop.scale;
    const drawW = img.width * scale;
    const drawH = img.height * scale;
    const dx = (outWidth - drawW) * (crop.x / 100);
    const dy = (outHeight - drawH) * (crop.y / 100);

    ctx.fillStyle = "#111111";
    ctx.fillRect(0, 0, outWidth, outHeight);
    ctx.drawImage(img, dx, dy, drawW, drawH);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/jpeg", 0.88),
    );
    return blob ?? source;
  } catch {
    return source;
  } finally {
    URL.revokeObjectURL(url);
  }
}
