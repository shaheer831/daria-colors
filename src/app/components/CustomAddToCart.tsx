"use client";

import React, { useState } from 'react';
import { useShopifyCart } from '../contexts/ShopifyCartContext';

interface CustomAddToCartProps {
  variantId: string;
  buttonText?: string;
  className?: string;
}

const CustomAddToCart: React.FC<CustomAddToCartProps> = ({
  variantId,
  buttonText = "Add to Cart",
  className = "",
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useShopifyCart();

  const handleAddToCart = async () => {
    if (!variantId) {
      console.error('No variant ID provided');
      return;
    }

    setIsAdding(true);
    try {
      // Convert to GID format if needed
      const gidVariantId = variantId.startsWith('gid://') 
        ? variantId 
        : `gid://shopify/ProductVariant/${variantId}`;
        
      await addToCart(gidVariantId, 1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding || !variantId}
      className={`
        w-full bg-[#D29FDC] hover:bg-[#C285CC] 
        text-black font-Sen font-semibold 
        py-3 px-6 rounded-full 
        transition-colors duration-200 
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {isAdding ? 'Adding...' : buttonText}
    </button>
  );
};

export default CustomAddToCart;
