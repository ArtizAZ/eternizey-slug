export function getImageS3(key?: string | File | null): string {
    const defaultImage = "/images/site/profile/avatar-profile.webp"; // Caminho da imagem padrão

    if (!key) return defaultImage;

    if (key instanceof File) {
        return URL.createObjectURL(key);
    }

    const useCdn = !!process.env.NEXT_PUBLIC_CDN_BASE_URL;
    const bucket = process.env.NEXT_PUBLIC_AWS_BUCKET;
    const region = process.env.NEXT_PUBLIC_AWS_REGION;
    const cdnBaseUrl = process.env.NEXT_PUBLIC_CDN_BASE_URL;

    if (useCdn && cdnBaseUrl) {
        return `${cdnBaseUrl.replace(/\/$/, "")}/${key}`;
    }

    if (bucket && region) {
        return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
    }

    return defaultImage; // Fallback final se variáveis estiverem ausentes
}
