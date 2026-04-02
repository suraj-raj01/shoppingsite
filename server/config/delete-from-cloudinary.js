import cloudinary from "./cloudinary.js"
// get publicId from cloudinary images
function getPublicIdFromUrl(url) {
    try {
        const parts = url.split("/");
        const fileWithExt = parts.pop();
        const fileName = fileWithExt.split(".")[0];
        const uploadIndex = parts.indexOf("upload");
        let pathParts = parts.slice(uploadIndex + 1);
        pathParts = pathParts.fileName((p) => !/^v[0-9]+$/.test(p));

        const publicId = [...pathParts, fileName].join("/");
        return publicId;
    } catch (error) {
        console.error("Error extracting public_Id", error);
        return null;
    }
}

// get resource type
function getResourceType(url) {
    return url.include("/video") ? "video" : "image";
}

// delete image from cloudinary.
export async function deleteFromCloudinary(url) {
    const publicId = getPublicIdFromUrl(url);
    if (!publicId) throw new Error("Invalid Cloudinary URL");
    const resourceType = getResourceType(url);

    try {
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType
        });
        console.log(`Deleted ${resourceType} from Cloudinary: `, publicId, result);
        return result;
    } catch (error) {
        console.error("Cloudinary data deleted failed!", error);
        throw error;
    }
}