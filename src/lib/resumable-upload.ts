import * as tus from "tus-js-client";
import { supabase } from "@/integrations/supabase/client";

const SUPABASE_URL =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? "";
const SUPABASE_KEY =
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ?? "";

export type UploadProgress = (percent: number) => void;

/**
 * Uploads a file to Supabase Storage using the TUS resumable protocol
 * (6 MB chunks, auto-retry, and resume of an interrupted upload from
 * localStorage). Falls back to a standard one-shot upload if the resumable
 * endpoint isn't reachable.
 */
export async function uploadResumable(
  bucket: string,
  path: string,
  file: File | Blob,
  onProgress?: UploadProgress,
): Promise<string> {
  const contentType = (file as File).type || "application/octet-stream";

  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token ?? SUPABASE_KEY;

    await new Promise<void>((resolve, reject) => {
      const upload = new tus.Upload(file, {
        endpoint: `${SUPABASE_URL}/storage/v1/upload/resumable`,
        retryDelays: [0, 1000, 3000, 5000, 10000],
        headers: {
          authorization: `Bearer ${token}`,
          apikey: SUPABASE_KEY,
          "x-upsert": "true",
        },
        uploadDataDuringCreation: true,
        removeFingerprintOnSuccess: true,
        chunkSize: 6 * 1024 * 1024, // required by Supabase Storage
        metadata: {
          bucketName: bucket,
          objectName: path,
          contentType,
          cacheControl: "3600",
        },
        onError: (error) => reject(error),
        onProgress: (sent, total) => {
          if (onProgress && total) onProgress(Math.round((sent / total) * 100));
        },
        onSuccess: () => resolve(),
      });

      // Resume a previously interrupted upload of the same file, if any.
      upload.findPreviousUploads().then((previous) => {
        if (previous.length > 0) upload.resumeFromPreviousUpload(previous[0]!);
        upload.start();
      });
    });
  } catch (err) {
    console.warn("[upload] resumable failed, falling back to direct upload:", err);
    onProgress?.(0);
    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { contentType, upsert: true });
    if (error) throw error;
    onProgress?.(100);
  }

  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}
