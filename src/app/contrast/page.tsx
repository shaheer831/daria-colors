import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
const Question3Page = () => {
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
            {/* Dummy face image in grayscale */}
            <Image
              src="/results-women.png"
              alt="Your face"
              fill
              className="object-cover grayscale hover:grayscale-0 transition duration-300"
            />

            {/* Contrast gradient bar at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-12 flex">
              <div className="w-full h-full bg-[#A6A6A6]"></div>
              <div className="w-full h-full bg-[#595959]"></div>
              <div className="w-full h-full bg-[#262626]"></div>
            </div>
          </div>
        </div>

        {/* Choice Buttons */}
        <div className="flex gap-3 mb-4 px-1">
          <button className="flex-1 bg-[#A6A6A6] text-white font-black text-[17px] py-[10px] rounded-full transition-colors font-Sen font-500">
            LOW
          </button>
          <button className="flex-1 bg-[#595959] text-white font-black text-[17px] py-[10px] rounded-full transition-colors font-Sen font-500">
            MEDIUM
          </button>
          <button className="flex-1 bg-[#262626] text-white font-black text-[17px] py-[10px] rounded-full transition-colors font-Sen font-500">
            HIGH
          </button>
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-2">
          <button className="bg-[#E5E5E5] text-black w-12 rounded-full transition-colors flex items-center justify-center">
            <ArrowLeft className="h-12" />
          </button>
        <button className="bg-black flex items-center justify-center text-white font-500 text-[19px] py-2.5 px-6 rounded-full transition-colors font-Sen gap-2">
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
