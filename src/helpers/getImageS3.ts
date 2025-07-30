export function getImageS3(key?: string | File | null): any {

    const cdnBaseUrl = process.env.NEXT_PUBLIC_CDN_BASE_URL;

    if (cdnBaseUrl) {
        return `${cdnBaseUrl.replace(/\/$/, "")}/${key}`;
    }
}
