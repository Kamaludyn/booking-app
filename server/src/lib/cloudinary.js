// Extract public_id from Cloudinary URL
const extractPublicId = (url) => {
  try {
    const parts = url.split("/");
    const filename = parts[parts.length - 1];
    const [publicId] = filename.split(".");
    return `vendor-logos/${publicId}`;
  } catch {
    return null;
  }
};

module.exports = {
  extractPublicId,
};
