"use client";

import { useShopifyCart } from '../hooks/useShopifyCart';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

const ShopifyCartDisplay = () => {
  const {
    cart,
    isLoading,
    error,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    checkoutUrl,
    isEmpty
  } = useShopifyCart();

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D29FDC]"></div>
          <span className="ml-2 text-gray-600">Loading cart...</span>
        </div>
        <div className="mt-4 text-sm text-gray-500">
          <p>Debug: Waiting for Shopify client to initialize...</p>
          <p>This may take a few seconds on first load.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <p className="text-red-600">Error loading cart: {error}</p>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-Tenor text-gray-700 mb-2">Your cart is empty</h3>
        <p className="text-gray-500">Add some beautiful color swatches to get started!</p>
      </div>
    );
  }

  const formatPrice = (amount: string) => {
    return `Dhs. ${parseFloat(amount).toFixed(2)}`;
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      {/* Cart Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-Tenor font-semibold">Your Cart ({totalItems} items)</h2>
        <button
          onClick={clearCart}
          className="text-red-500 hover:text-red-700 text-sm"
          disabled={isEmpty}
        >
          Clear Cart
        </button>
      </div>

      {/* Cart Items */}
      <div className="space-y-4 mb-6">
        {cart?.lineItems.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl">
            {/* Product Image */}
            {item.variant.image && (
              <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                <Image
                  src={item.variant.image.src}
                  alt={item.variant.image.altText || item.title}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
            )}

            {/* Product Info */}
            <div className="flex-grow">
              <h3 className="font-Sen font-semibold text-gray-900 mb-1">
                {item.title}
              </h3>
              {item.variant.title !== 'Default Title' && (
                <p className="text-sm text-gray-600 mb-2">{item.variant.title}</p>
              )}
              <p className="text-lg font-bold text-[#D29FDC]">
                {formatPrice(item.variant.price.amount)}
              </p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                disabled={item.quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              
              <span className="w-8 text-center font-semibold">
                {item.quantity}
              </span>
              
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Remove Button */}
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-500 hover:text-red-700 p-2"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-Tenor">Total:</span>
          <span className="text-2xl font-bold text-[#D29FDC]">
            {formatPrice(totalPrice)}
          </span>
        </div>

        {/* Checkout Button */}
        {checkoutUrl && (
          <a
            href={checkoutUrl}
            className="w-full bg-[#D29FDC] hover:bg-[#C285CC] text-black font-Sen font-semibold py-3 px-6 rounded-full transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            Proceed to Checkout
          </a>
        )}
      </div>

      {/* Cart Debug Info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h4 className="font-semibold mb-2">Debug Info:</h4>
          <p className="text-sm">Cart ID: {cart?.id}</p>
          <p className="text-sm">Total Items: {totalItems}</p>
          <p className="text-sm">Subtotal: {cart?.subtotalPrice?.amount}</p>
        </div>
      )}
    </div>
  );
};

export default ShopifyCartDisplay;
