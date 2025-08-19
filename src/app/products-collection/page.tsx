"use client";

import ShopifyCollection from "../components/ShopifyCollection";

const ProductsCollectionPage = () => {
  return (
    <div className="min-h-screen px-7 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-[32px] font-Tenor font-normal text-black mb-3 leading-tight">
            Color Swatches Collection
          </h1>
          <p className="text-[#7E7E7E] text-[17px] leading-5 tracking-wide max-w-2xl mx-auto">
            Discover your perfect seasonal color palette with our complete collection of color analysis keychains.
          </p>
        </div>

        {/* Shopify Collection */}
        <div className="mb-8">
          <ShopifyCollection 
            collectionId="433612062851"
            className="w-full"
          />
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 max-w-4xl mx-auto">
          {/* <div className="bg-gradient-to-r from-[#F1BDC3] to-[#a56a71] rounded-2xl p-6 text-white text-center mb-6">
            <h3 className="font-Sen text-xl font-bold mb-2">Free Digital Download</h3>
            <p className="text-sm opacity-90">
              Instantly download your digital color palette after purchase
            </p>
          </div>
           */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="font-Tenor text-3xl font-bold text-black mb-2">10,000+</div>
              <div className="text-sm text-gray-600">Happy Customers</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="font-Tenor text-3xl font-bold text-black mb-2">94%</div>
              <div className="text-sm text-gray-600">Satisfaction Rate</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="font-Tenor text-3xl font-bold text-black mb-2">12</div>
              <div className="text-sm text-gray-600">Seasonal Palettes</div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="mt-12 max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-Tenor font-semibold text-black mb-4">
            Why Choose Seasonal Color Analysis?
          </h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Seasonal color analysis helps you discover which colors enhance your natural beauty. 
            Each season represents a different undertone and intensity that complements specific skin tones, 
            hair colors, and eye colors.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="text-left">
              <h3 className="font-Sen font-semibold text-lg text-black mb-2">🌸 Spring Palettes</h3>
              <p className="text-gray-600 text-sm">Warm, clear, and bright colors for those with golden undertones</p>
            </div>
            <div className="text-left">
              <h3 className="font-Sen font-semibold text-lg text-black mb-2">🌊 Summer Palettes</h3>
              <p className="text-gray-600 text-sm">Cool, soft, and muted colors for those with blue undertones</p>
            </div>
            <div className="text-left">
              <h3 className="font-Sen font-semibold text-lg text-black mb-2">🍂 Autumn Palettes</h3>
              <p className="text-gray-600 text-sm">Warm, rich, and earthy colors for deep golden undertones</p>
            </div>
            <div className="text-left">
              <h3 className="font-Sen font-semibold text-lg text-black mb-2">❄️ Winter Palettes</h3>
              <p className="text-gray-600 text-sm">Cool, clear, and dramatic colors for high contrast features</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsCollectionPage;
