"use client";

import { useState } from "react";
import { useShopifyCart } from "../contexts/ShopifyCartContext";
import { ShoppingBag, Loader2 } from "lucide-react";

interface QuickAddToCartProps {
  variantId: string;
  productName: string;
  className?: string;
}

const QuickAddToCart: React.FC<QuickAddToCartProps> = ({ 
  variantId, 
  productName, 
  className = "" 
}) => {
  const { addToCart, loading, getTotalItems } = useShopifyCart();
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = async () => {
    try {
      await addToCart(variantId, 1);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading}
      className={`inline-flex items-center gap-2 bg-[#D29FDC] hover:bg-[#C285CC] active:bg-[#B37BC2] disabled:bg-gray-300 disabled:text-gray-500 text-black font-Sen font-semibold py-2 px-4 rounded-full transition-colors duration-200 ${className}`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <ShoppingBag className="w-4 h-4" />
      )}
      {justAdded ? "Added!" : loading ? "Adding..." : `Add ${productName}`}
    </button>
  );
};

export default QuickAddToCart;
