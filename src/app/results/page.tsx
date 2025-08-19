"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import ShopifyBuyButton from "../components/shopify-btn";

interface Result {
  name: string;
  description: string;
  heroColor: string;
  neutrals: string[];
  midTones: string[];
  accents: string[];
  shopifyUrl: string;
  backgroundRemovedImage: string;
  key: string;
}

const colorSeasons = [
  { key: "bright-spring", value: "8677937250435" },
  { key: "bright-winter", value: "8677950193795" },
  { key: "dark-autumn", value: "8677950947459" },
  { key: "dark-winter", value: "8677948588163" },
  { key: "light-spring", value: "8677940494467" },
  { key: "light-summer", value: "8677934596227" },
  { key: "soft-autumn", value: "8677951930499" },
  { key: "soft-summer", value: "8677935349891" },
  { key: "true-autumn", value: "8677952782467" },
  { key: "true-spring", value: "8677945049219" },
  { key: "true-summer", value: "8677936332931" },
  { key: "true-winter", value: "8677932826755" },
];

const ResultsPage = () => {
  const [result, setResult] = useState<Result | null>(null);

  const [image, setImage] = useState("/results-women.png");

  useEffect(() => {
    const storedResults = localStorage.getItem("Result");
    if (storedResults) {
      try {
        if (storedResults === "[object Object]") {
          console.warn(
            "Invalid data format in localStorage. Please try uploading again."
          );
          return;
        }
        const parsedResults = JSON.parse(storedResults);
        console.log("[v0] Successfully parsed AI results:", parsedResults);
        if (parsedResults.backgroundRemovedImage) {
          setImage(parsedResults.backgroundRemovedImage);
        } else {
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
        }
        setResult(parsedResults);
      } catch (error) {
        console.error("Error parsing AI results:", error);
        localStorage.removeItem("aiResults");
      }
    }
  }, []);

  const displayName = result?.name || "Light Summer";
  const displayDescription =
    result?.description || "Wow! You look stunning. Your best colors are:";

  const allColors = result
    ? [...result.neutrals, ...result.midTones, ...result.accents]
    : [
        "#DD819A",
        "#BCA7D0",
        "#EA9EA8",
        "#DFCBE4",
        "#EDC3AB",
        "#E9DFD6",
        "#FBEDBE",
        "#B5D7C9",
        "#D9EEE7",
        "#A1C9EC",
        "#F4F3F1",
      ];

  const getProductId = (key: string) => {
    const season = colorSeasons.find((s) => s.key === key);
    return season ? season.value : null;
  };

  return (
    <div className="min-h-screen px-7 py-8">
      <div className="max-w-[412px] mx-auto">
        {/* Title Section */}
        <div className="mb-6">
          <h1 className="text-[28px] font-Tenor font-normal text-black mb-3 leading-tight">
            {displayName}
          </h1>
          <p className="text-[#7E7E7E] text-[17px] leading-5 tracking-wide w-[85%]">
            {result ? result.description : displayDescription}
          </p>
        </div>

        {/* Color Palette with Face */}
        <div className="border-2 border-dashed border-[#cccccc] rounded-[24px] bg-white mb-8 overflow-hidden relative">
          <div className="relative w-full h-[300px]">
            {/* Color swatches arranged around the face */}
            <div className="grid grid-cols-5 grid-rows-4 h-full">
              {/* Row 1 - columns 1 and 5 only */}
              <div style={{ backgroundColor: allColors[0] || "#DD819A" }}></div>
              <div className="col-span-3 row-span-3 relative overflow-hidden">
                {/* Face image spanning center area across 3 rows */}
                <Image
                  src={image}
                  alt="Your face"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div style={{ backgroundColor: allColors[1] || "#BCA7D0" }}></div>

              {/* Row 2 - columns 1 and 5 only */}
              <div style={{ backgroundColor: allColors[2] || "#EA9EA8" }}></div>
              <div style={{ backgroundColor: allColors[3] || "#DFCBE4" }}></div>

              {/* Row 3 - columns 1 and 5 only */}
              <div style={{ backgroundColor: allColors[4] || "#EDC3AB" }}></div>
              <div style={{ backgroundColor: allColors[5] || "#E9DFD6" }}></div>

              {/* Row 4 - all columns */}
              <div style={{ backgroundColor: allColors[6] || "#FBEDBE" }}></div>
              <div style={{ backgroundColor: allColors[7] || "#B5D7C9" }}></div>
              <div style={{ backgroundColor: allColors[8] || "#D9EEE7" }}></div>
              <div style={{ backgroundColor: allColors[9] || "#A1C9EC" }}></div>
              <div
                style={{ backgroundColor: allColors[10] || "#F4F3F1" }}
              ></div>
            </div>
          </div>
        </div>

        {/* Shop Button */}
        <div className="mb-1 flex justify-center -mt-6">
          {result && (
            <ShopifyBuyButton
              productId={getProductId(result.key) || ""}
              buttonText="SHOP COLOR SWATCHES"
            />
          )}
        </div>

        {/* Product Image */}
        <div className="mb-6">
          <div className="bg-white rounded-[24px] p-6 text-center">
            <div className="relative w-48 h-48 mx-auto">
              <Image
                src="/results-keychain.png"
                alt="Keychain"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
