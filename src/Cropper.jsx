import React, { useState, useCallback } from "react";
import CropperLib from "react-easy-crop";
import { getCroppedImg } from "./cropUtils";

const aspectRatios = {
  "16:9": 16 / 9,
  "1:1": 1,
  "4:3": 4 / 3,
  "3:4": 3 / 4,
};

export function Cropper({ src, onClose }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState(aspectRatios["16:9"]);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    const croppedImage = await getCroppedImg(src, croppedAreaPixels);
    const link = document.createElement("a");
    link.download = "cropped.jpg";
    link.href = croppedImage;
    link.click();
  };

  return (
    <div className="w-full h-full relative">
      <CropperLib
        image={src}
        crop={crop}
        zoom={zoom}
        aspect={aspect}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={onCropComplete}
      />
      <div className="absolute top-4 left-4 z-10">
        {Object.keys(aspectRatios).map((label) => (
          <button
            key={label}
            className="m-1 px-3 py-1 bg-white border rounded shadow"
            onClick={() => setAspect(aspectRatios[label])}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="absolute bottom-4 right-4 flex gap-2 z-10">
        <button onClick={onClose} className="px-4 py-2 bg-gray-400 rounded text-white">
          关闭
        </button>
        <button onClick={handleSave} className="px-4 py-2 bg-blue-600 rounded text-white">
          下载裁切图
        </button>
      </div>
    </div>
  );
}
