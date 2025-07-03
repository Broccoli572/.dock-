import React, { useState } from "react";
import { Cropper } from "./Cropper";
import mammoth from "mammoth";

export default function App() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    const allImages = [];

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const { value } = await mammoth.convertToHtml({ arrayBuffer });
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = value;
      const imgTags = tempDiv.querySelectorAll("img");

      imgTags.forEach((img) => {
        allImages.push(img.src);
      });
    }

    setImages(allImages);
    setSelectedImage(null);
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">.DOCX 批量图片提取 + 裁切工具</h1>
      <input type="file" accept=".docx" multiple onChange={handleFileChange} />
      <div className="grid grid-cols-3 gap-4 mt-4">
        {images.map((src, idx) => (
          <img
            key={idx}
            src={src}
            className="w-full h-48 object-contain cursor-pointer border"
            onClick={() => setSelectedImage(src)}
            alt={`extracted-${idx}`}
          />
        ))}
      </div>
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-xl w-[90vw] h-[90vh]">
            <Cropper src={selectedImage} onClose={() => setSelectedImage(null)} />
          </div>
        </div>
      )}
    </div>
  );
}
