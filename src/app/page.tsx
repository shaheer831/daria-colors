import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen px-7 py-8">
      <div className="max-w-[412px] mx-auto">
        <div>
          {/* Title Section */}
          <div className="mb-6">
            <h1 className="text-[28px] font-Tenor font-normal text-black mb-3 leading-tight">
              Find your perfect colors in seconds
            </h1>
            <p className="text-[#7E7E7E] text-[17px] leading-5 tracking-wide w-[85%]">
              Discover your season and shop with your personal cheat sheet -
              never buy the wrong color again.
            </p>
            <div className="w-full mt-14 flex flex-col relative">
              <div className="flex justify-between gap-2.5 p-1">
                <div className="w-1/3 h-28 bg-[#EFCa93] rounded-2xl"></div>
                <div className="w-1/3 h-28 bg-[#F6D041] rounded-2xl"></div>
                <div className="w-1/3 h-28 bg-[#f6cf4100] rounded-2xl"></div>
              </div>
              <div className="flex justify-between gap-2 p-1">
                <div className="w-1/3 h-28 bg-[#278A66] rounded-2xl"></div>
                <div className="w-1/3 h-28 bg-[#E65762] rounded-2xl"></div>
                <div className="w-1/3 h-28 bg-[#e6576300] rounded-2xl"></div>
              </div>
              <div className="flex justify-between gap-2 p-1">
                <div className="w-1/3 h-28 bg-[#109C9E] rounded-2xl"></div>
                <div className="w-1/3 h-28 bg-[#109c9e00] rounded-2xl"></div>
                <div className="w-1/3 h-28 bg-[#109c9e00] rounded-2xl"></div>
              </div>
              <div className="flex justify-between gap-2 p-1 pb-0">
                <div className="w-1/3 h-28 bg-[#B9D26E] rounded-2xl"></div>
                <div className="w-1/3 h-28 bg-[#489aff00] rounded-2xl"></div>
                <div className="w-1/3 h-28 bg-[#4899FF] rounded-2xl"></div>
              </div>
              {/* elevated image with buttons */}
              <div className="absolute w-full md:w-[87%] h-full top-0 left-0 pb-5">
                <Image
                  src="/home-modal.png"
                  alt="Modal"
                  loading="lazy"
                  priority={false}
                  fill
                  className="scale-[1.2] -mt-12 ml-3 md:ml-11"
                />
              </div>
              <div className="absolute w-full h-full flex flex-col justify-center items-center gap-4">
                <button className="bg-[#b794c4] font-500 text-[19px] py-4 rounded-full font-Sen px-7">
                  SHOP COLOR SWATCHES
                </button>
                <button className="bg-[#f4a6a6] font-500 text-[19px] py-4 rounded-full font-Sen px-6">
                  FIND YOUR SEASON
                </button>
              </div>
            </div>
          </div>
        </div>
        <span className="w-full flex justify-center font-Montserrat">
          <p className="font-500">Works for all 12 color seasons</p>
        </span>
        <span className="w-full flex justify-center font-Tenor">
          <p className="font-500 text-2xl tracking-widest mt-3">
            FIND YOUR SEASON
          </p>
        </span>
        <span className="w-full flex justify-center -mt-3">
          <svg
            width="395"
            viewBox="0 0 375 53"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M188.115 45.2543L192.665 40.7047H250.517V40.4979H192.665L188.115 36L183.617 40.4979H125.558V40.7047H183.617L188.115 45.2543ZM188.115 36.3102L192.458 40.6013L188.115 44.9441L183.772 40.6013L188.115 36.3102Z"
              fill="#555555"
            />
          </svg>
        </span>
        <span className="font-Tenor text-center w-full block mt-2 text-[15px]">
          The secret to looking radiant isn’t more makeup or expensive clothes —
          it’s wearing the colors that <br /> love you back.
        </span>
        <span className="relative w-full h-[380px] mt-5 rounded-4xl overflow-hidden block">
          <Image
            src="/home-twins.png"
            alt="Keychain"
            fill
            className="object-cover"
          />
        </span>
      </div>
    </div>
  );
}
