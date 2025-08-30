"use client";

import Image from "next/image";
import type React from "react";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

import api from "../../../utilities/axiosInstance";
import Loader from "../components/loader";
import { storageManager } from "../../utilities/storage";

const Upload = () => {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Clear IndexedDB on upload page load
  useEffect(() => {
    const clearStoredData = async () => {
      try {
        await storageManager.clearManualData();
        console.log('IndexedDB cleared on upload page load');
      } catch (error) {
        console.error('Error clearing IndexedDB on upload page load:', error);
      }
    };
    
    clearStoredData();
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleManualTest = async () => {
    if (!selectedFile) {
      alert("Please select an image first");
      return;
    }

    setIsUploading(true);
    try {
      // Store image locally in IndexedDB instead of uploading to backend
      await storageManager.storeLocalImage(selectedFile);
      
      // Navigate to the next step
      router.push("/warm-or-cool");
    } catch (error) {
      console.error("Error storing image locally:", error);
      alert("Error storing image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Helper function to compress image on canvas
  const compressImage = (file: File, maxWidth = 800, quality = 0.8): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const htmlImg = new window.Image(); // Use window.Image to avoid conflict with Next.js Image

      htmlImg.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        const ratio = Math.min(maxWidth / htmlImg.width, maxWidth / htmlImg.height);
        const newWidth = htmlImg.width * ratio;
        const newHeight = htmlImg.height * ratio;

        // Set canvas dimensions
        canvas.width = newWidth;
        canvas.height = newHeight;

        // Draw and compress image
        ctx.drawImage(htmlImg, 0, 0, newWidth, newHeight);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file); // Fallback to original file
            }
          },
          'image/jpeg',
          quality
        );
      };

      htmlImg.onerror = () => {
        console.error('Error loading image for compression');
        resolve(file); // Fallback to original file on error
      };

      htmlImg.src = URL.createObjectURL(file);
    });
  };

  const handleAITest = async () => {
    if (!selectedFile) {
      alert("Please select an image first");
      return;
    }

    setIsUploading(true);
    try {
      // Store image locally in IndexedDB as well
      await storageManager.storeLocalImage(selectedFile);
      console.log('Image saved to IndexedDB for AI test');
      
      // Compress image before sending to API
      const compressedFile = await compressImage(selectedFile, 800, 0.85);
      
      console.log(`Original size: ${(selectedFile.size / 1024 / 1024).toFixed(2)}MB`);
      console.log(`Compressed size: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
      
      const formData = new FormData();
      formData.append("file", compressedFile);
      // No longer need to append testType - backend now only handles AI tests

      const response = await api.post("/image/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response) {
        const result = response.data;
        localStorage.setItem("Result", JSON.stringify(result));
        router.push("/results");
      } else {
        console.error("Failed to analyze image");
        alert("Failed to analyze image. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen px-7 py-8">
      <div className="max-w-[412px] mx-auto">
        {/* Title Section */}
        <div className="mb-6">
          <h1 className="text-[28px] font-Tenor font-normal text-black mb-3 leading-tight">
            Upload Your Photo
          </h1>
          <p className="text-[#7E7E7E] text-[17px] leading-5 tracking-wide font-Tenor">
            Please upload a clear photo of your face. Best results are when you
            use daylight and no makeup.
          </p>
        </div>

        {/* Upload Area */}
        <div
          className="border-2 border-dashed border-[#cccccc] rounded-[24px] overflow-hidden bg-white p-12 mb-8 text-center cursor-pointer hover:border-gray-400 transition-colors relative h-[270px]  [@media(min-width:415px)]:h-[300px]"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />
          <div className="flex flex-col items-center">
            {selectedFile && previewUrl ? (
              <Image
                src={previewUrl}
                alt="Preview"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain"
              />
            ) : (
              <>
                {/* Upload Icon */}
                <div className="mb-4">
                  <svg
                    width="126"
                    height="126"
                    viewBox="0 0 126 126"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M47.25 56.4375C39.27 56.4375 32.8125 49.98 32.8125 42C32.8125 34.02 39.27 27.5625 47.25 27.5625C55.23 27.5625 61.6875 34.02 61.6875 42C61.6875 49.98 55.23 56.4375 47.25 56.4375ZM47.25 35.4375C43.6275 35.4375 40.6875 38.3775 40.6875 42C40.6875 45.6225 43.6275 48.5625 47.25 48.5625C50.8725 48.5625 53.8125 45.6225 53.8125 42C53.8125 38.3775 50.8725 35.4375 47.25 35.4375Z"
                      fill="black"
                    />
                    <path
                      d="M78.75 119.438H47.25C18.7425 119.438 6.5625 107.258 6.5625 78.75V47.25C6.5625 18.7425 18.7425 6.5625 47.25 6.5625H68.25C70.4025 6.5625 72.1875 8.3475 72.1875 10.5C72.1875 12.6525 70.4025 14.4375 68.25 14.4375H47.25C23.0475 14.4375 14.4375 23.0475 14.4375 47.25V78.75C14.4375 102.953 23.0475 111.563 47.25 111.563H78.75C102.953 111.563 111.563 102.953 111.563 78.75V52.5C111.563 50.3475 113.348 48.5625 115.5 48.5625C117.653 48.5625 119.438 50.3475 119.438 52.5V78.75C119.438 107.258 107.258 119.438 78.75 119.438Z"
                      fill="black"
                    />
                    <path
                      d="M94.5 45.9372C92.3475 45.9372 90.5625 44.1522 90.5625 41.9997V10.4997C90.5625 8.92468 91.5075 7.45468 92.9775 6.87718C94.4475 6.29968 96.1275 6.61468 97.2825 7.71718L107.783 18.2172C109.305 19.7397 109.305 22.2597 107.783 23.7822C106.26 25.3047 103.74 25.3047 102.217 23.7822L98.4375 20.0022V41.9997C98.4375 44.1522 96.6525 45.9372 94.5 45.9372Z"
                      fill="black"
                    />
                    <path
                      d="M83.9994 24.9372C83.0019 24.9372 82.0044 24.5697 81.2169 23.7822C79.6944 22.2597 79.6944 19.7397 81.2169 18.2172L91.7169 7.71719C93.2394 6.19469 95.7594 6.19469 97.2819 7.71719C98.8044 9.23969 98.8044 11.7597 97.2819 13.2822L86.7819 23.7822C85.9944 24.5697 84.9969 24.9372 83.9994 24.9372Z"
                      fill="black"
                    />
                    <path
                      d="M14.0165 103.426C12.7565 103.426 11.4965 102.796 10.7615 101.693C9.55397 99.908 10.0265 97.4405 11.8115 96.233L37.694 78.8555C43.364 75.0755 51.1865 75.4955 56.3315 79.853L58.064 81.3755C60.689 83.633 65.1515 83.633 67.724 81.3755L89.564 62.633C95.129 57.8555 103.896 57.8555 109.514 62.633L118.071 69.983C119.699 71.4005 119.909 73.868 118.491 75.548C117.074 77.1755 114.554 77.3855 112.926 75.968L104.369 68.618C101.744 66.3605 97.334 66.3605 94.709 68.618L72.869 87.3605C67.304 92.138 58.5365 92.138 52.919 87.3605L51.1865 85.838C48.7715 83.7905 44.7815 83.5805 42.104 85.418L16.274 102.796C15.539 103.216 14.7515 103.426 14.0165 103.426Z"
                      fill="black"
                    />
                  </svg>
                </div>

                <div className="text-black font-500 text-[21px] tracking-wide font-Sen">
                  OR
                </div>
                <div className="text-black font-500 text-[19px] tracking-wide font-Sen">
                  DRAG YOUR IMAGE
                </div>
              </>
            )}
          </div>
        </div>

        {/* Buttons */}
        {isUploading ? (
          <div className="w-full flex justify-center h-[130px] items-center">
            <Loader />
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4 mb-8">
              <button
                onClick={handleManualTest}
                className={`bg-[#D29FDC]  font-500 text-[19px] py-4 rounded-full font-Sen mx-[60px] ${
                  selectedFile && !isUploading
                    ? "hover:bg-[#ce89db] cursor-pointer"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                MANUAL TEST
              </button>
              <button
                onClick={handleAITest}
                disabled={!selectedFile || isUploading}
                className={`font-500 text-[19px] py-4 rounded-full transition-colors font-Sen mx-[60px] ${
                  selectedFile && !isUploading
                    ? "bg-[#f4a6a6] hover:bg-[#f19999] cursor-pointer"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                {isUploading ? "ANALYZING..." : "AI TEST"}
              </button>
            </div>
            <div>
              {/* Bottom Text */}
              <p className="text-center font-Tenor text-[17px] leading-5 tracking-normal px-2">
                Go through a simple 3 questions quiz to manually determine your
                season or let AI decide for you automatically.
              </p>
            </div>
          </>
        )}
        <br />
      </div>
    </div>
  );
};

export default Upload;
