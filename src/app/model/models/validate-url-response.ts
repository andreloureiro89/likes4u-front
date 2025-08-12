export interface ValidateUrlResponse {
    valid: boolean;
    platform: 'instagram' | 'tiktok' | 'facebook' | 'youtube' | null;
}
