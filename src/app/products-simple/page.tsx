"use client";

import Image from "next/image";
import { useState } from "react";
import CustomAddToCart from "../components/CustomAddToCart";
import SeasonFilter from "../components/SeasonFilter";
import shopifyProducts from "@/data/shopify-products.json";

const ProductsSimplePage = () => {
  const [selectedSeason, setSelectedSeason] = useState('All');
  
  const filteredProducts = selectedSeason === 'All' 
    ? shopifyProducts.products 
    : shopifyProducts.products.filter(product => product.season === selectedSeason);
  return (
    <div className="min-h-screen px-7 py-8">
      <div className="max-w-[412px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[28px] font-Tenor font-normal text-black mb-3 leading-tight">
            Color Swatches
          </h1>
          <p className="text-[#7E7E7E] text-[17px] leading-5 tracking-wide">
            Find your perfect color palette and never buy the wrong color again.
          </p>
        </div>

        {/* Season Filter */}
        <SeasonFilter
          selectedSeason={selectedSeason}
          onSeasonChange={setSelectedSeason}
          seasons={shopifyProducts.categories.seasons}
        />

        {/* Products Grid */}
        <div className="space-y-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm"
            >
              {/* Color Swatches Header */}
              <div className="w-full h-48 mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <h4 className="font-Tenor text-lg font-semibold text-gray-600 mb-2">
                    {product.subtype} {product.season}
                  </h4>
                  <p className="text-sm text-gray-500">Color Palette Keychain</p>
                </div>
              </div>

              {/* Color Swatches */}
              <div className="flex gap-2 mb-3">
                {product.colors.map((color, index) => (
                  <div
                    key={index}
                    className="w-6 h-6 rounded-full border border-gray-200"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              {/* Product Info */}
              <div className="space-y-2 mb-4">
                <h3 className="font-Tenor text-[18px] font-semibold text-black">
                  {product.name}
                </h3>
                <p className="text-[#7E7E7E] text-[14px] leading-4">
                  {product.description}
                </p>
                
                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="font-Sen text-[18px] font-bold text-black">
                    Dhs. {product.price}
                  </span>
                </div>
              </div>

              {/* Buy Button */}
              <div className="w-full">
                {product.variantId ? (
                  <CustomAddToCart
                    variantId={product.variantId}
                    buttonText="Add to Cart"
                  />
                ) : (
                  <div className="w-full bg-gray-300 text-gray-600 font-Sen font-semibold py-3 px-6 rounded-full text-center">
                    Coming Soon
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 space-y-4">
          {/* <div className="bg-gradient-to-r from-[#F1BDC3] to-[#a56a71] rounded-2xl p-6 text-white">
            <h3 className="font-Sen text-xl font-bold mb-2">Free Digital Download</h3>
            <p className="text-sm opacity-90">
              Instantly download your digital color palette after purchase
            </p>
          </div> */}
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="font-Tenor text-2xl font-bold text-black">10,000+</div>
              <div className="text-xs text-gray-600">Happy Customers</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="font-Tenor text-2xl font-bold text-black">94%</div>
              <div className="text-xs text-gray-600">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsSimplePage;
