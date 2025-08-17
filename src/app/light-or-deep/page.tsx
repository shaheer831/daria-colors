"use client"
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Question2Page = () => {
  const router = useRouter();
  const [image, setImage] = useState("/results-women.png");
  const [lightOrDeep, setLightOrDeep] = useState<"light" | "deep" | null>(null);

  useEffect(() => {
    const storedResults = localStorage.getItem("manualData");
    if (storedResults) {
      try {
        if (storedResults === "[object Object]") {
          console.warn(
            "Invalid data format in localStorage. Please try uploading again."
          );
          return;
        }
        const parsedResults = JSON.parse(storedResults);
        setImage(parsedResults.backgroundRemovedImage);
      } catch (error) {
        console.error("Error parsing AI results:", error);
        localStorage.removeItem("manualData");
      }
    }
  }, []);

  const handleNext = () => {
    if (!lightOrDeep) {
      alert("Please select either LIGHT or DEEP before continuing.");
      return;
    }
    localStorage.setItem("lightOrDeep", lightOrDeep);
    router.push("/contrast"); // go to Q3
  };

  const handleBack = () => {
    router.push("/warm-or-cool"); // go back to Q1
  };

  return (
    <div className="min-h-screen px-7 py-8">
      <div className="max-w-[412px] mx-auto">
        {/* Title Section */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-[28px] font-Tenor font-normal text-black mb-3 leading-tight">
            2. Light or deep?
          </h1>
          <p className="text-[#7E7E7E] text-[17px] leading-5 tracking-wide">
            Which color looks better on you?
            <br />
            The color should not overpower your face.
          </p>
        </div>

        {/* Image with Color Overlay */}
        <div className="border-2 border-dashed border-[#cccccc] rounded-2xl sm:rounded-[24px] bg-white mb-6 sm:mb-8 overflow-hidden relative">
       <Image
                src={image}
                alt="Face for color analysis"
                width={300}
                height={300}
                className="w-full h-full object-cover"
                priority
              />
          <div className="absolute w-[110%] -translate-x-1/2 h-full top-0 left-1/2 flex justify-between">
            {/* Left curved overlay - Responsive */}
            <div className="">
              <svg
                className="h-[101%]"
                viewBox="0 0 155 241"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M27.8604 0.14452C27.8604 107.345 112.621 204.811 155.001 240.145H27.8604C8.50146 240.145 2.63398 225.811 0.0104379 218.645V29.6445C-0.473909 8.84452 16.0015 -1.35547 27.8604 0.14452Z"
                  fill="#FFD6F7"
                />
              </svg>
            </div>

            {/* Right curved overlay - Responsive */}
            <div className="">
              <svg
                className="h-full"
                viewBox="0 0 155 241"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M127.141 0.14452C127.141 107.345 42.3802 204.811 -6.10352e-05 240.145H127.141C146.5 240.145 152.367 225.811 154.991 218.645V29.6445C155.475 8.84452 139 -1.35547 127.141 0.14452Z"
                  fill="#571249"
                />
              </svg>
            </div>
          </div>
        </div>
         <div className="flex flex-col gap-4 px-16">
          <div className="flex gap-2">
            <button
              onClick={() => setLightOrDeep("light")}
              className={`flex-1 py-[9px] rounded-full transition-colors font-Sen text-[17px] font-500 bg-[#FFD6F7] text-black font-black ${
                lightOrDeep === "light"
                  ? "scale-105"
                  : ""
              }`}
            >
              LIGHT
            </button>
            <button
              onClick={() => setLightOrDeep("deep")}
              className={`flex-1 py-[9px] rounded-full transition-colors font-Sen text-[17px] font-500 bg-[#571249] text-white ${
                lightOrDeep === "deep"
                  ? "scale-105"
                  : ""
              }`}
            >
              DEEP
            </button>
          </div>

          {/* Navigation */}
          <div className="flex justify-between gap-2">
            <button
              onClick={handleBack}
              className="bg-[#E5E5E5] text-black w-12 h-12 rounded-full transition-colors flex items-center justify-center"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <button
              onClick={handleNext}
              className="bg-black flex items-center justify-center text-white font-500 text-[19px] py-2.5 px-6 rounded-full transition-colors font-Sen gap-2"
            >
              NEXT
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M6 12L10 8L6 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Question2Page;
