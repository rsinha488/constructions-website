import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (fileStr: string, folder: string) => {
    try {
        const uploadResponse = await cloudinary.uploader.upload(fileStr, {
            folder: `construction/${folder}`,
        });
        return uploadResponse;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw error;
    }
};

export const deleteImage = async (publicId: string) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        throw error;
    }
};

export const getPublicIdFromUrl = (url: string) => {
    // Example: https://res.cloudinary.com/demo/image/upload/v12345678/construction/materials/sample.jpg
    // Public ID: construction/materials/sample
    const parts = url.split('/');
    const folderParts = parts.slice(parts.indexOf('construction'));
    const publicIdWithExtension = folderParts.join('/');
    return publicIdWithExtension.split('.')[0];
};
