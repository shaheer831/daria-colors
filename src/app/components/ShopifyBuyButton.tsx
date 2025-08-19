"use client";

import { useState } from "react";
import { ShoppingBag, Loader2, Check } from "lucide-react";

declare global {
  interface Window {
    ShopifyBuy: any;
    ShopifyBuyClient: any;
  }
}

interface ShopifyBuyButtonProps {
  variantId: string;
  productTitle: string;
  className?: string;
}

const ShopifyBuyButton: React.FC<ShopifyBuyButtonProps> = ({ 
  variantId, 
  productTitle, 
  className = "" 
}) => {
  const [loading, setLoading] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const addToCart = async () => {
    if (!window.ShopifyBuyClient && !window.ShopifyBuy) {
      console.error("Shopify Buy SDK not loaded");
      return;
    }

    try {
      setLoading(true);
      console.log('Adding to cart:', productTitle, 'with variant ID:', variantId);

      // Use global client if available, otherwise create one
      const client = window.ShopifyBuyClient || window.ShopifyBuy.buildClient({
        domain: 'v1ydcw-0r.myshopify.com',
        storefrontAccessToken: 'c4c57221667b9c125e1976c34b1846c3',
      });

      console.log('Using client:', client);

      // Get or create checkout
      let checkoutId = localStorage.getItem('shopify-buy-cart-id');
      let checkout;

      console.log('Existing checkout ID:', checkoutId);

      if (checkoutId) {
        try {
          checkout = await client.checkout.fetch(checkoutId);
          console.log('Fetched existing checkout:', checkout);
        } catch (error) {
          console.log("Existing checkout not found, creating new one", error);
          checkout = null;
        }
      }

      if (!checkout || checkout.completedAt) {
        console.log('Creating new checkout...');
        // Create new checkout
        checkout = await client.checkout.create();
        localStorage.setItem('shopify-buy-cart-id', checkout.id);
        console.log('Created new checkout:', checkout);
      }

      // Add line item
      const lineItemsToAdd = [{
        variantId: variantId,
        quantity: 1
      }];

      console.log('Adding line items:', lineItemsToAdd);
      checkout = await client.checkout.addLineItems(checkout.id, lineItemsToAdd);
      console.log('Updated checkout with new items:', checkout);
      
      console.log('Successfully added to cart:', productTitle);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);

      // Trigger a custom event to notify other components
      window.dispatchEvent(new CustomEvent('shopify-cart-updated', { 
        detail: { checkout, productTitle } 
      }));

    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={addToCart}
      disabled={loading}
      className={`inline-flex items-center gap-2 bg-[#D29FDC] hover:bg-[#C285CC] active:bg-[#B37BC2] disabled:bg-gray-300 disabled:text-gray-500 text-black font-Sen font-semibold py-3 px-6 rounded-full transition-colors duration-200 ${className}`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : justAdded ? (
        <Check className="w-4 h-4" />
      ) : (
        <ShoppingBag className="w-4 h-4" />
      )}
      {justAdded 
        ? "Added!" 
        : loading 
        ? "Adding..." 
        : "Add to Cart"
      }
    </button>
  );
};

export default ShopifyBuyButton;
