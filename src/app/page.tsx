import { ArrowRight } from "lucide-react";
import Link from "next/link";
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

                <Link href="/upload">
                  <button className="bg-[#f4a6a6] font-500 text-[19px] py-4 rounded-full font-Sen px-6">
                    FIND YOUR SEASON
                  </button>
                </Link>
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
          it’s wearing the colors that love you back.
        </span>
        <span className="relative w-full h-[380px] mt-5 rounded-4xl overflow-hidden block">
          <Image
            src="/home-twins.png"
            alt="twins"
            fill
            className="object-cover"
          />
        </span>
        <span className="w-full flex justify-center mt-8">
          <button className="font-San text-[18px] p-3 px-8 border rounded-full flex items-center gap-2">
            <p className="font-500">FIND YOUR SEASON</p> <ArrowRight />
          </button>
        </span>
        <span className="w-full flex justify-center mt-6 font-Tenor text-2xl tracking-widest relative">
          <svg
            className="absolute -top-6 -left-3"
            width="83"
            height="197"
            viewBox="0 0 66 147"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M64.3935 4.24751C49.864 9.39846 35.7344 16.5932 24.5811 27.6444C13.4278 38.6955 5.46883 53.9754 5.08711 70.2533C4.72389 85.7333 11.1612 100.809 20.1888 113.144C28.8241 124.945 39.744 134.602 50.6674 144.064"
              stroke="#100F0D"
              strokeWidth="1.9"
              stroke-miterlimit="10"
              strokeLinecap="round"
              stroke-dasharray="13.33 13.33"
            />
            <path
              d="M47.0498 130.516C46.6346 130.655 46.4108 131.129 46.5501 131.571L50.3928 143.811L38.3383 142.157C37.9023 142.097 37.5076 142.421 37.4582 142.88C37.4088 143.34 37.7253 143.762 38.1568 143.822L51.4489 145.646C51.7174 145.682 51.9842 145.571 52.1553 145.352C52.3256 145.131 52.3766 144.831 52.292 144.559L48.0551 131.063C48.0039 130.904 47.9149 130.772 47.802 130.673C47.5984 130.495 47.3172 130.426 47.0498 130.516Z"
              fill="#100F0D"
            />
          </svg>
          SWATCH & STYLE
        </span>
        <span className="w-full flex justify-center -mt-3.5">
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
        <span className="w-full flex justify-center text-center mt-3 text-[16px]">
          Each DariaColors keychain holds your <br /> personal color palette,
          based on the science <br /> of the 12 seasons.
        </span>
        <span className="relative w-full h-[300px] mt-5 rounded-4xl overflow-hidden block">
          <Image
            src="/home-chains.png"
            alt="Keychain"
            fill
            className="object-cover"
          />
        </span>
        <span className="w-full flex justify-center mt-8">
          <button className="font-San text-[18px] p-3 px-8 border rounded-full flex items-center gap-2">
            <p className="font-500">SHOP YOUR SWATCH</p> <ArrowRight />
          </button>
        </span>
        <span className="w-full flex justify-center mt-6 font-Tenor text-2xl tracking-widest relative">
          <svg
            className="absolute -top-6 right-3 z-20"
            width="83"
            height="197"
            viewBox="0 0 55 148"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1C14.4844 7.28393 27.4984 15.6242 37.5271 27.6872C47.5559 39.7501 54.3768 55.9001 53.9981 72.5309C53.6381 88.3466 46.8757 103.268 37.7921 115.21C29.1031 126.635 18.3545 135.711 7.61128 144.588"
              stroke="#100F0D"
              strokeWidth="1.9"
              stroke-miterlimit="10"
              strokeLinecap="round"
              stroke-dasharray="13.33 13.33"
            />
            <path
              d="M11.269 132.821L11.27 132.821L11.27 132.82L11.269 132.821Z"
              fill="#100F0D"
              stroke="black"
              strokeWidth="2"
            />
          </svg>
        </span>
        <span className="w-full flex justify-center text-center mt-3 text-[16px]">
          When you wear the right shades, your natural <br /> beauty does the
          rest. No filters needed.
        </span>
        <span className="relative w-full h-[430px] bg-red-500 mt-6 rounded-4xl overflow-hidden block">
          <Image
            src="/modal-twisted.png"
            alt="modal-twisted"
            fill
            className="object-cover"
            style={{ objectPosition: "center 0px" }} // 20px down
          />
          <svg
            className="absolute top-1/2 left-1/2 w-[90%] -translate-x-1/2 -translate-y-1/2 z-10"
            viewBox="0 0 309 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="289.5" cy="20.3826" r="19.5" fill="white" />
            <path
              d="M294 18.196L288 24.0448L285 21.1204M289.5 34.2803C282.044 34.2803 276 28.3884 276 21.1204C276 13.8524 282.044 7.96045 289.5 7.96045C296.956 7.96045 303 13.8524 303 21.1204C303 28.3884 296.956 34.2803 289.5 34.2803Z"
              stroke="#7CB342"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="19.5" cy="20.3826" r="19.5" fill="white" />
            <path
              d="M10.125 11.9815L28.875 30.2592M19.5 34.2803C12.0442 34.2803 6 28.3884 6 21.1204C6 13.8524 12.0442 7.96045 19.5 7.96045C26.9558 7.96045 33 13.8524 33 21.1204C33 28.3884 26.9558 34.2803 19.5 34.2803Z"
              stroke="#D40000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="w-full flex mt-7">
          <span className="w-full font-Tenor text-[35px]">
            Use this <br />
            <span className="text-[#F86672] text-[43px] tracking-wider">
              keychain
            </span>
            <br /> as your secret <br />
            <span className="text-[#9E69CD]">cheat sheet</span>
            <br /> when you <br /> go
            <br /> shopping.
          </span>
          <span className="w-full relative ml-4 rounded-tl-4xl rounded-bl-4xl overflow-hidden">
            <Image
              src="/half-women.png"
              alt="modal-cutted"
              fill
              className="object-cover "
            />
          </span>
        </span>
        <span
          style={{
            display: "inline-block",
            background: "linear-gradient(to bottom right, #F1BDC3, #a56a71)", // darker shade
          }}
          className="w-full rounded-4xl mt-5 text-white p-5 pt-7"
        >
          <p className="font-Sen text-3xl">Modish Look</p>
          <p className="font-Sen text-[17px] mt-2.5 tracking-wider">
            Find Your Perfect Look by Dressing Up with Daira Colors, Get the
            Special Price!
          </p>
          <button className="bg-black px-8 mt-4 py-3 rounded-full text-[17px]">
            SHOP COLOR SWATCHES
          </button>
          <span className="w-full h-[400px] relative">
            <Image
              src="/family-home.png"
              alt="modal-cutted"
              fill
              className="object-cover "
            />
          </span>
        </span>
      </div>
    </div>
  );
}
