"use client";

import Image from "next/image";
import { useCart } from "../contexts/CartContext";
import { ShoppingBag, Star } from "lucide-react";

const colorSeasons = [
  { 
    key: "bright-spring", 
    value: "8677937250435",
    name: "Bright Spring",
    description: "Vibrant and energetic colors for dynamic personalities",
    colors: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#F9CA24", "#6C5CE7"],
    price: 89,
    originalPrice: 120
  },
  { 
    key: "bright-winter", 
    value: "8677950193795",
    name: "Bright Winter",
    description: "Bold and crisp colors with high contrast",
    colors: ["#2D3436", "#FFFFFF", "#E17055", "#0984E3", "#A29BFE"],
    price: 89,
    originalPrice: 120
  },
  { 
    key: "dark-autumn", 
    value: "8677950947459",
    name: "Dark Autumn",
    description: "Rich, deep colors with golden undertones",
    colors: ["#6C5CE7", "#A0522D", "#8B4513", "#228B22", "#B22222"],
    price: 89,
    originalPrice: 120
  },
  { 
    key: "dark-winter", 
    value: "8677948588163",
    name: "Dark Winter",
    description: "Deep, cool colors with blue undertones",
    colors: ["#000080", "#8B0000", "#2F4F4F", "#4B0082", "#191970"],
    price: 89,
    originalPrice: 120
  },
  { 
    key: "light-spring", 
    value: "8677940494467",
    name: "Light Spring",
    description: "Soft, warm colors with delicate brightness",
    colors: ["#FFB6C1", "#98FB98", "#87CEEB", "#F0E68C", "#DDA0DD"],
    price: 89,
    originalPrice: 120
  },
  { 
    key: "light-summer", 
    value: "8677934596227",
    name: "Light Summer",
    description: "Gentle, cool colors with muted tones",
    colors: ["#B0C4DE", "#D8BFD8", "#F0F8FF", "#E6E6FA", "#FFF8DC"],
    price: 89,
    originalPrice: 120
  },
  { 
    key: "soft-autumn", 
    value: "8677951930499",
    name: "Soft Autumn",
    description: "Muted, warm colors with golden undertones",
    colors: ["#CD853F", "#D2691E", "#BC8F8F", "#F4A460", "#DEB887"],
    price: 89,
    originalPrice: 120
  },
  { 
    key: "soft-summer", 
    value: "8677935349891",
    name: "Soft Summer",
    description: "Subtle, cool colors with gentle saturation",
    colors: ["#9370DB", "#B0C4DE", "#F5F5DC", "#D3D3D3", "#C0C0C0"],
    price: 89,
    originalPrice: 120
  },
  { 
    key: "true-autumn", 
    value: "8677952782467",
    name: "True Autumn",
    description: "Classic autumn colors with warm, earthy tones",
    colors: ["#FF4500", "#FF8C00", "#DAA520", "#B22222", "#8B4513"],
    price: 89,
    originalPrice: 120
  },
  { 
    key: "true-spring", 
    value: "8677945049219",
    name: "True Spring",
    description: "Pure, warm colors with clear brightness",
    colors: ["#32CD32", "#FFD700", "#FF69B4", "#1E90FF", "#FF6347"],
    price: 89,
    originalPrice: 120
  },
  { 
    key: "true-summer", 
    value: "8677936332931",
    name: "True Summer",
    description: "Cool, medium-intensity colors with blue undertones",
    colors: ["#4682B4", "#9370DB", "#20B2AA", "#FF1493", "#00CED1"],
    price: 89,
    originalPrice: 120
  },
  { 
    key: "true-winter", 
    value: "8677932826755",
    name: "True Winter",
    description: "Pure, cool colors with high contrast",
    colors: ["#000000", "#FFFFFF", "#DC143C", "#0000FF", "#8A2BE2"],
    price: 89,
    originalPrice: 120
  },
];

const ProductsPage = () => {
  const { addToCart, cartItems } = useCart();

  const handleAddToCart = (product: typeof colorSeasons[0]) => {
    addToCart({
      id: product.value,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      colors: product.colors,
      description: product.description,
      image: "/results-keychain.png",
    });
  };

  const getItemQuantity = (productId: string) => {
    return cartItems.find(item => item.id === productId)?.quantity || 0;
  };

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

        {/* Products Grid */}
        <div className="space-y-6">
          {colorSeasons.map((product) => (
            <div
              key={product.key}
              className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm"
            >
              {/* Product Image */}
              <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                <Image
                  src="/results-keychain.png"
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                {/* Discount Badge */}
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  -26%
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
                
                {/* Rating */}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                  <span className="text-[#7E7E7E] text-xs ml-1">(127)</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="font-Sen text-[18px] font-bold text-black">
                    Dhs. {product.price}
                  </span>
                  <span className="font-Sen text-[14px] text-gray-400 line-through">
                    Dhs. {product.originalPrice}
                  </span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => handleAddToCart(product)}
                className="w-full bg-[#D29FDC] hover:bg-[#C285CC] active:bg-[#B37BC2] text-black font-Sen font-semibold py-3 px-4 rounded-full transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                {getItemQuantity(product.value) > 0 
                  ? `Added to Cart (${getItemQuantity(product.value)})`
                  : "Add to Cart"
                }
              </button>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 space-y-4">
          <div className="bg-gradient-to-r from-[#F1BDC3] to-[#a56a71] rounded-2xl p-6 text-white">
            <h3 className="font-Sen text-xl font-bold mb-2">Free Shipping</h3>
            <p className="text-sm opacity-90">
              Free shipping on all orders over Dhs. 75
            </p>
          </div>
          
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

export default ProductsPage;
