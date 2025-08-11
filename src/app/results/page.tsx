import Image from "next/image";

const ResultsPage = () => {
  return (
    <div className="min-h-screen px-7 py-8">
      <div className="max-w-md mx-auto">
        {/* Title Section */}
        <div className="mb-6">
          <h1 className="text-[28px] font-Tenor font-normal text-black mb-3 leading-tight">
            Light Summer
          </h1>
          <p className="text-[#7E7E7E] text-[17px] leading-5 tracking-wide w-[85%]">
            Wow! You look stunning. Your best colors are:
          </p>
        </div>

        {/* Color Palette with Face */}
        <div className="border-2 border-dashed border-[#cccccc] rounded-[24px] bg-white mb-8 overflow-hidden relative">
          <div className="relative w-full h-[300px]">
            {/* Color swatches arranged around the face */}
            <div className="grid grid-cols-5 grid-rows-4 h-full">
              {/* Row 1 - columns 1 and 5 only */}
              <div className="bg-[#DD819A]"></div>
              <div className="col-span-3 row-span-3 relative overflow-hidden">
                {/* Face image spanning center area across 3 rows */}{" "}
                <Image
                  src="/results-women.png"
                  alt="Your face"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="bg-[#BCA7D0]"></div>

              {/* Row 2 - columns 1 and 5 only */}
              <div className="bg-[#EA9EA8]"></div>
              <div className="bg-[#DFCBE4]"></div>

              {/* Row 3 - columns 1 and 5 only */}
              <div className="bg-[#EDC3AB]"></div>
              <div className="bg-[#E9DFD6]"></div>

              {/* Row 4 - all columns */}
              <div className="bg-[#FBEDBE]"></div>
              <div className="bg-[#B5D7C9]"></div>
              <div className="bg-[#D9EEE7]"></div>
              <div className="bg-[#A1C9EC]"></div>
              <div className="bg-[#F4F3F1]"></div>
            </div>
          </div>
        </div>

        {/* Shop Button */}
        <div className="mb-1 flex justify-center">
          <button className=" bg-[#D29FDC] text-black px-6 tracking-tight text-[17px] py-3 rounded-full transition-colors font-Sen">
            SHOP COLOR SWATCHES
          </button>
        </div>

        {/* Product Image */}
        <div className="mb-6">
          <div className="bg-white rounded-[24px] p-6 text-center">
            <div className="relative w-48 h-48 mx-auto">
              <Image
                src="/results-keychain.png"
                alt="Keychain"
                fill
                className="rounded-[16px] object-cover"
              />
            </div>
          </div>
        </div>

        {/* Bottom Text */}
        <p className="text-center font-Tenor text-[17px] leading-5 tracking-normal px-2">
          Use your personalized color swatches keychain when shopping
        </p>
      </div>
    </div>
  );
};

export default ResultsPage;
