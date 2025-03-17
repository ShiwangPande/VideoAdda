import { useState } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { Button } from '@/components/ui/button';
import { UploadIcon } from 'lucide-react';

const CloudinaryUploader = ({ onSuccess }) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = (result) => {
    setUploading(false);
    if (result.event === 'success') {
      onSuccess(result.info);
    }
  };

  return (
    <CldUploadWidget
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
      onUpload={handleUpload}
      options={{ resourceType: 'video' }}
    >
      {({ open }) => (
        <div
          className="group/drop"
          onClick={() => {
            setUploading(true);
            open();
          }}
        >
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center justify-center gap-2 rounded-full bg-muted h-32 w-32">
              <UploadIcon className="size-10 text-muted-foreground group/drop-[&[active]]:animate-bounce transition-all duration-300" />
            </div>
            <div className="flex flex-col gap-2 text-center">
              <p className="text-sm">Drag and drop video files to upload</p>
              <p className="text-sm text-muted-foreground">
                Your videos will be private until you publish them
              </p>
            </div>
            <Button type="button" className="rounded-all" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Select file'}
            </Button>
          </div>
        </div>
      )}
    </CldUploadWidget>
  );
};

export default CloudinaryUploader;



