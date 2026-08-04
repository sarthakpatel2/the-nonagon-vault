/**
 * Grabs a crisp still frame from a local video file, entirely in the browser.
 * Returns a JPEG blob plus the video duration (seconds), or null if the
 * browser can't decode the file.
 */
export async function captureVideoThumbnail(
  file: File,
  { maxWidth = 1280, seekRatio = 0.15 }: { maxWidth?: number; seekRatio?: number } = {},
): Promise<{ blob: Blob; duration: number } | null> {
  if (typeof document === "undefined") return null;

  const url = URL.createObjectURL(file);
  const video = document.createElement("video");
  video.muted = true;
  video.playsInline = true;
  video.preload = "auto";
  video.crossOrigin = "anonymous";
  video.src = url;

  try {
    const duration = await new Promise<number>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("metadata timeout")), 15000);
      video.onloadedmetadata = () => {
        clearTimeout(timer);
        resolve(Number.isFinite(video.duration) ? video.duration : 0);
      };
      video.onerror = () => {
        clearTimeout(timer);
        reject(new Error("cannot decode video"));
      };
    });

    // Seek a little into the clip so we don't capture a black opening frame.
    const target = duration > 1 ? Math.min(duration * seekRatio, duration - 0.1) : 0;
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("seek timeout")), 15000);
      video.onseeked = () => {
        clearTimeout(timer);
        resolve();
      };
      video.onerror = () => {
        clearTimeout(timer);
        reject(new Error("seek failed"));
      };
      video.currentTime = target;
    });

    const vw = video.videoWidth;
    const vh = video.videoHeight;
    if (!vw || !vh) return null;

    const scale = Math.min(1, maxWidth / vw);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(vw * scale);
    canvas.height = Math.round(vh * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/jpeg", 0.85),
    );
    if (!blob) return null;
    return { blob, duration };
  } catch (err) {
    console.warn("[thumbnail] falling back, could not capture frame:", err);
    return null;
  } finally {
    video.removeAttribute("src");
    video.load();
    URL.revokeObjectURL(url);
  }
}
