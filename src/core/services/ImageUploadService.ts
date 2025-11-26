import { supabase } from "../infra/supabase/client/supabaseClient";
import { decode } from 'base64-arraybuffer';

export class ImageUploadService {
    /**
     * Uploads an image to Supabase storage.
     * @param photo Object containing uri and optional base64 string.
     * @param bucket The storage bucket name.
     * @param path The path/filename to save the image as.
     * @param options Optional upload options (contentType, upsert).
     * @returns The public URL of the uploaded image.
     */
    static async uploadImage(
        photo: { uri: string; base64?: string | null },
        bucket: string,
        path: string,
        options: { contentType?: string; upsert?: boolean } = { contentType: 'image/jpeg', upsert: false }
    ): Promise<string> {
        try {
            let base64Data = photo.base64;

            // If base64 is not provided, try to fetch it from URI (for gallery images)
            if (!base64Data) {
                if (photo.uri.startsWith('http')) {
                    // Already a remote URL, nothing to upload? 
                    // Or maybe we want to re-upload it? 
                    // For now, assume if it's http, we might just return it or throw if we strictly expect upload.
                    // But typically this service is called when we HAVE a local file to upload.
                    // Let's try to read it as blob/base64.
                }

                base64Data = await this.uriToBase64(photo.uri);
            }

            if (!base64Data) {
                throw new Error("Could not retrieve image data.");
            }

            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(path, decode(base64Data), {
                    contentType: options.contentType || 'image/jpeg',
                    upsert: options.upsert || false
                });

            if (uploadError) {
                throw new Error(`Upload failed: ${uploadError.message}`);
            }

            const { data: urlData } = supabase.storage
                .from(bucket)
                .getPublicUrl(path);

            if (!urlData?.publicUrl) {
                throw new Error('Failed to get public URL');
            }

            return urlData.publicUrl;

        } catch (error) {
            console.error("ImageUploadService Error:", error);
            throw error;
        }
    }

    private static async uriToBase64(uri: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                const reader = new FileReader();
                reader.onloadend = function () {
                    const result = reader.result as string;
                    // result is "data:image/jpeg;base64,....."
                    // we need only the base64 part
                    const base64 = result.split(',')[1];
                    resolve(base64);
                };
                reader.readAsDataURL(xhr.response);
            };
            xhr.onerror = function (e) {
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", uri, true);
            xhr.send(null);
        });
    }
}
