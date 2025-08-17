"use client";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../utilities/axiosInstance";

const Question3Page = () => {
  const router = useRouter();
  const [contrast, setContrast] = useState<"low" | "medium" | "high" | null>(
    null
  );
  const [image, setImage] = useState("/results-women.png");

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

  const handleFinish = async () => {
    try {
      // ✅ Read stored values (adjust keys if you stored differently)
      const warmOrCool = localStorage.getItem("warmOrCool");
      const lightOrDeep = localStorage.getItem("lightOrDeep");

      // ✅ If some values are missing, stop here
      if (!warmOrCool || !lightOrDeep) {
        alert("Some quiz data is missing in localStorage.");
        return;
      }

      // ✅ Construct payload
      const payload = {
        warmOrCool,
        lightOrDeep,
        contrastLevel: contrast,
      };

      // ✅ Send request
      const response = await api.post("/quiz/manual", payload);

      if (response?.data) {
        localStorage.setItem("Result", JSON.stringify(response.data));
        router.push("/results");
      } else {
        console.error("Failed to submit quiz.");
        alert("Failed to submit quiz. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Error submitting quiz. Please try again.");
    }
  };

  const handleBack = () => {
    router.push("/light-or-deep"); // back to Q2
  };

  return (
    <div className="min-h-screen px-7 py-8">
      <div className="max-w-[412px] mx-auto">
        {/* Title Section */}
        <div className="mb-6">
          <h1 className="text-[28px] font-Tenor font-normal text-black mb-3 leading-tight">
            3. What is your contrast level?
          </h1>
          <p className="text-[#7E7E7E] text-[17px] leading-5 tracking-wide">
            How big is the difference between the darkest shade on your face and
            the lightest shadow on your face?
          </p>
        </div>

        {/* Image with Contrast Analysis */}
        <div className="border-2 border-dashed border-[#cccccc] rounded-[24px] bg-white mb-8 overflow-hidden relative">
          <div className="relative w-full h-[300px]">
            <Image
              src={image}
              alt="Your face"
              fill
              className="object-cover grayscale hover:grayscale-0 transition duration-300"
            />
            <div className="absolute bottom-0 left-0 right-0 h-12 flex">
              <div className="w-full h-full bg-[#A6A6A6]"></div>
              <div className="w-full h-full bg-[#595959]"></div>
              <div className="w-full h-full bg-[#262626]"></div>
            </div>
          </div>
        </div>

        {/* Choice Buttons */}
        <div className="flex gap-3 mb-4 px-1">
          <button
            onClick={() => setContrast("low")}
            className={`flex-1 py-[10px] rounded-full transition-colors font-Sen text-[17px] font-500 bg-[#A6A6A6] text-white font-black ${
              contrast === "low" ? "scale-105" : ""
            }`}
          >
            LOW
          </button>
          <button
            onClick={() => setContrast("medium")}
            className={`flex-1 py-[10px] rounded-full transition-colors font-Sen text-[17px] font-500 bg-[#595959] text-white font-black ${
              contrast === "medium" ? "scale-105" : ""
            }`}
          >
            MEDIUM
          </button>
          <button
            onClick={() => setContrast("high")}
            className={`flex-1 py-[10px] rounded-full transition-colors font-Sen text-[17px] font-500 bg-[#262626] text-white font-black ${
              contrast === "high" ? "scale-105" : ""
            }`}
          >
            HIGH
          </button>
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-2">
          <button
            onClick={handleBack}
            className="bg-[#E5E5E5] text-black w-12 h-12 rounded-full transition-colors flex items-center justify-center"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <button
            onClick={handleFinish}
            className="bg-black flex items-center justify-center text-white font-500 text-[19px] py-2.5 px-6 rounded-full transition-colors font-Sen gap-2"
          >
            FINISH
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
  );
};

export default Question3Page;
