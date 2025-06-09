import { useRef, useState } from "react";

export default function ProfilePictureUpload({ imageUrl, onUpload }) {
  const fileInputRef = useRef();
  const [preview, setPreview] = useState(imageUrl || null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    // image upload
    setTimeout(() => {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      setLoading(false);
      onUpload(file); // Pass file up
    }, 1000);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-32 h-32">
        <img
          src={preview || "/default-avatar.png"}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border border-border-500 dark:border-border-800  shadow-sm"
        />
        {loading && (
          <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white text-sm">
            Uploading...
          </div>
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <button
        type="button"
        onClick={triggerFileInput}
        className="text-sm text-primary-500 hover:underline"
      >
        Change Profile Picture
      </button>
    </div>
  );
}
