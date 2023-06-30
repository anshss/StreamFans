import React, { ChangeEvent, useState } from "react";
import { toast } from "react-hot-toast";
import { imageUploadToIpfs } from "@/utils";

type ImageState = {
  file: File | null;
  previewURL: string | null;
};

export default function FileUpload() {
  const [image, setImage] = useState<ImageState>({
    file: null,
    previewURL: null,
  });

  const [isUploading, setIsUploading] = useState(false);

  console.log(image, isUploading);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setIsUploading(true);
      imageUploadToIpfs(file)
        .then((ipfsUrl) => {
          setImage({
            file,
            previewURL: ipfsUrl,
          });
          setIsUploading(false);
        })
        .catch((error) => {
          setIsUploading(false);
          toast.error(error.message);
        });
    }
  };

  if (image.previewURL !== null) {
    return (
      <figure className="max-w-lg">
        <img
          className="h-auto max-w-full rounded-lg"
          src={image.previewURL}
          alt="image description"
        />
        <figcaption className="mt-2 text-sm text-center text-gray-500 dark:text-gray-400">
          {image.file?.name}
        </figcaption>
      </figure>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              aria-hidden="true"
              className="w-10 h-10 mb-3 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              SVG, PNG, JPG or GIF (MAX. 800x400px)
            </p>
          </div>
          <input
            onChange={handleImageChange}
            id="dropzone-file"
            type="file"
            accept="image/*"
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}
