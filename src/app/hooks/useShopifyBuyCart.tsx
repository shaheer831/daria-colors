"use client";

import { useState, useEffect } from "react";

declare global {
  interface Window {
    ShopifyBuy: any;
    ShopifyBuyClient: any;
  }
}

interface ShopifyBuyCartItem {
  id: string;
  title: string;
  quantity: number;
  variant: {
    id: string;
    title: string;
    price: string;
    product: {
      title: string;
      images: Array<{
        src: string;
        alt: string;
      }>;
    };
  };
}

interface ShopifyBuyCart {
  id: string;
  lineItems: ShopifyBuyCartItem[];
  subtotalPrice: string;
  totalPrice: string;
  webUrl: string;
}

export const useShopifyBuyCart = () => {
  const [buyCart, setBuyCart] = useState<ShopifyBuyCart | null>(null);
  const [loading, setLoading] = useState(false);

  const getShopifyBuyCart = async () => {
    if (!window.ShopifyBuyClient && !window.ShopifyBuy) {
      console.log("Shopify Buy SDK not loaded");
      return null;
    }

    try {
      setLoading(true);
      
      // Try to get cart from localStorage
      const cartId = localStorage.getItem('shopify-buy-cart-id');
      
      if (!cartId) {
        console.log("No Shopify Buy cart found in localStorage");
        return null;
      }

      // Use global client if available, otherwise create one
      const client = window.ShopifyBuyClient || window.ShopifyBuy.buildClient({
        domain: 'v1ydcw-0r.myshopify.com',
        storefrontAccessToken: 'c4c57221667b9c125e1976c34b1846c3',
      });

      const cart = await client.checkout.fetch(cartId);
      
      if (cart && cart.lineItems && cart.lineItems.length > 0) {
        const formattedCart: ShopifyBuyCart = {
          id: cart.id,
          lineItems: cart.lineItems.map((item: any) => ({
            id: item.id,
            title: item.title,
            quantity: item.quantity,
            variant: {
              id: item.variant.id,
              title: item.variant.title,
              price: item.variant.price.amount,
              product: {
                title: item.variant.product.title,
                images: item.variant.product.images || []
              }
            }
          })),
          subtotalPrice: cart.subtotalPrice?.amount || '0',
          totalPrice: cart.totalPrice?.amount || '0',
          webUrl: cart.webUrl || ''
        };
        
        setBuyCart(formattedCart);
        return formattedCart;
      }
      
      return null;
    } catch (error) {
      console.error("Error fetching Shopify Buy cart:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const detectShopifyBuyCart = () => {
    // Check localStorage for cart data
    const cartId = localStorage.getItem('shopify-buy-cart-id');
    if (!cartId) return false;
    
    // Check if we have cart data in our state
    return buyCart && buyCart.lineItems.length > 0;
  };

  const openShopifyBuyCart = () => {
    // Try to trigger the Shopify Buy SDK floating cart
    const cartToggle = document.querySelector('[data-element="toggle"]') as HTMLElement;
    if (cartToggle) {
      cartToggle.click();
    } else if (buyCart && buyCart.webUrl) {
      // Fallback to direct checkout if toggle not found
      window.open(buyCart.webUrl, '_blank');
    }
  };

  useEffect(() => {
    // Try to load cart data when component mounts
    if (window.ShopifyBuyClient || window.ShopifyBuy) {
      getShopifyBuyCart();
    } else {
      // Wait for Shopify Buy SDK to load
      const checkShopifyBuy = setInterval(() => {
        if (window.ShopifyBuyClient || window.ShopifyBuy) {
          getShopifyBuyCart();
          clearInterval(checkShopifyBuy);
        }
      }, 500);

      return () => clearInterval(checkShopifyBuy);
    }
  }, []);

  return {
    buyCart,
    loading,
    detectShopifyBuyCart,
    openShopifyBuyCart,
    refreshCart: getShopifyBuyCart
  };
};
