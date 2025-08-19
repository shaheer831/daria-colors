"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useShopifyCart } from "../contexts/ShopifyCartContext";
import { useShopifyBuyCart } from "../hooks/useShopifyBuyCart";
import { 
  ShoppingBag, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight,
  X,
  ExternalLink
} from "lucide-react";

interface CartDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDropdown: React.FC<CartDropdownProps> = ({ isOpen, onClose }) => {
  const { cart, updateCartLine, removeFromCart, getTotalItems, getTotalPrice } = useShopifyCart();
  const { buyCart, openShopifyBuyCart } = useShopifyBuyCart();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const cartItems = cart?.lines.edges.map(edge => edge.node) || [];
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const hasItems = cartItems.length > 0 || (buyCart && buyCart.lineItems.length > 0);

  return (
    <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 max-h-96 overflow-hidden">
      <div ref={dropdownRef}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="font-Tenor text-lg font-semibold text-black">Your Cart</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {!hasItems ? (
          /* Empty State */
          <div className="p-6 text-center">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h4 className="font-Tenor text-base font-semibold text-gray-600 mb-2">
              Your cart is empty
            </h4>
            <p className="text-gray-400 text-sm mb-4">
              Start shopping to add items to your cart
            </p>
            <Link href="/products-collection" onClick={onClose}>
              <button className="bg-[#D29FDC] hover:bg-[#C285CC] text-black font-Sen font-semibold py-2 px-6 rounded-full transition-colors duration-200">
                Start Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {/* GraphQL Cart Items */}
            {cartItems.length > 0 && (
              <div className="p-4">
                <h4 className="font-Sen text-sm font-semibold text-gray-700 mb-3">Cart Items</h4>
                <div className="space-y-3">
                  {cartItems.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={item.merchandise.product.images.edges[0]?.node.url || '/results-keychain.png'}
                          alt={item.merchandise.product.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h5 className="font-Sen text-sm font-semibold text-black truncate">
                          {item.merchandise.product.title}
                        </h5>
                        {item.merchandise.title !== 'Default Title' && (
                          <p className="text-xs text-gray-500 truncate">
                            {item.merchandise.title}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-semibold text-black">
                            Dhs. {parseFloat(item.merchandise.price.amount).toFixed(0)}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => updateCartLine(item.id, Math.max(0, item.quantity - 1))}
                              className="w-5 h-5 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-medium px-1 min-w-[16px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartLine(item.id, item.quantity + 1)}
                              className="w-5 h-5 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 text-red-500 hover:text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  {cartItems.length > 3 && (
                    <p className="text-xs text-gray-500 text-center py-2">
                      +{cartItems.length - 3} more items
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Shopify Buy Cart Items */}
            {buyCart && buyCart.lineItems.length > 0 && (
              <div className="p-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-Sen text-sm font-semibold text-gray-700">Shopify Items</h4>
                  <button
                    onClick={() => {
                      openShopifyBuyCart();
                      onClose();
                    }}
                    className="text-xs text-[#D29FDC] hover:text-[#C285CC] font-semibold flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Open
                  </button>
                </div>
                <div className="space-y-3">
                  {buyCart.lineItems.slice(0, 2).map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                      {item.variant.product.images[0] && (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image
                            src={item.variant.product.images[0].src}
                            alt={item.variant.product.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <h5 className="font-Sen text-sm font-semibold text-black truncate">
                          {item.variant.product.title}
                        </h5>
                        {item.variant.title !== 'Default Title' && (
                          <p className="text-xs text-gray-500 truncate">
                            {item.variant.title}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-semibold text-black">
                            Dhs. {parseFloat(item.variant.price).toFixed(0)}
                          </span>
                          <span className="text-xs text-gray-500">
                            Qty: {item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {buyCart.lineItems.length > 2 && (
                    <p className="text-xs text-gray-500 text-center py-2">
                      +{buyCart.lineItems.length - 2} more items
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        {hasItems && (
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            {/* Totals */}
            {cartItems.length > 0 && (
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-Sen text-sm text-gray-600">Subtotal:</span>
                  <span className="font-Sen text-sm font-semibold text-black">
                    Dhs. {totalPrice.toFixed(0)}
                  </span>
                </div>
                {buyCart && buyCart.lineItems.length > 0 && (
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-Sen text-sm text-gray-600">Shopify Items:</span>
                    <span className="font-Sen text-sm font-semibold text-black">
                      Dhs. {parseFloat(buyCart.totalPrice).toFixed(0)}
                    </span>
                  </div>
                )}
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="space-y-2">
              <Link href="/cart" onClick={onClose}>
                <button className="w-full bg-[#D29FDC] hover:bg-[#C285CC] text-black font-Sen font-semibold py-2 px-4 rounded-full transition-colors duration-200 flex items-center justify-center gap-2">
                  View Full Cart
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              
              {cart?.checkoutUrl && (
                <a
                  href={cart.checkoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  className="block w-full text-center bg-black hover:bg-gray-800 text-white font-Sen font-semibold py-2 px-4 rounded-full transition-colors duration-200"
                >
                  Quick Checkout
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDropdown;
