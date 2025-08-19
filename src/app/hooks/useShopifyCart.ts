"use client";

import { useState, useEffect, useCallback } from 'react';

interface ShopifyLineItem {
  id: string;
  title: string;
  variant: {
    id: string;
    title: string;
    price: {
      amount: string;
      currencyCode: string;
    };
    image?: {
      src: string;
      altText: string;
    };
  };
  quantity: number;
}

interface ShopifyCart {
  id: string;
  lineItems: ShopifyLineItem[];
  subtotalPrice: {
    amount: string;
    currencyCode: string;
  };
  totalPrice: {
    amount: string;
    currencyCode: string;
  };
  totalQuantity: number;
  checkoutUrl: string;
}

export const useShopifyCart = () => {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get the Shopify client and cart
  const getShopifyCart = useCallback(async () => {
    try {
      if (typeof window === 'undefined' || !window.ShopifyBuyClient) {
        console.log('Shopify client not available yet');
        return null;
      }

      const client = window.ShopifyBuyClient;
      
      // Try to get existing cart from localStorage
      const existingCartId = localStorage.getItem('shopify-buy-cart-id');
      
      let currentCart;
      if (existingCartId) {
        try {
          // Fetch existing cart
          currentCart = await client.checkout.fetch(existingCartId);
          console.log('Loaded existing cart:', currentCart);
        } catch (error) {
          console.log('Could not fetch existing cart, creating new one');
          currentCart = await client.checkout.create();
          localStorage.setItem('shopify-buy-cart-id', currentCart.id);
        }
      } else {
        // Create new cart
        currentCart = await client.checkout.create();
        localStorage.setItem('shopify-buy-cart-id', currentCart.id);
        console.log('Created new cart:', currentCart);
      }

      setCart(currentCart);
      return currentCart;
    } catch (error) {
      console.error('Error getting Shopify cart:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Add item to cart
  const addToCart = useCallback(async (variantId: string, quantity: number = 1) => {
    try {
      setIsLoading(true);
      const client = window.ShopifyBuyClient;
      
      if (!client) {
        throw new Error('Shopify client not initialized');
      }

      let currentCart = cart;
      if (!currentCart) {
        currentCart = await getShopifyCart();
        if (!currentCart) return;
      }

      const lineItemsToAdd = [{
        variantId,
        quantity
      }];

      const updatedCart = await client.checkout.addLineItems(currentCart.id, lineItemsToAdd);
      setCart(updatedCart);
      
      console.log('Item added to cart:', updatedCart);
      return updatedCart;
    } catch (error) {
      console.error('Error adding to cart:', error);
      setError(error instanceof Error ? error.message : 'Failed to add item to cart');
    } finally {
      setIsLoading(false);
    }
  }, [cart, getShopifyCart]);

  // Remove item from cart
  const removeFromCart = useCallback(async (lineItemId: string) => {
    try {
      setIsLoading(true);
      const client = window.ShopifyBuyClient;
      
      if (!client || !cart) {
        throw new Error('Shopify client or cart not available');
      }

      const updatedCart = await client.checkout.removeLineItems(cart.id, [lineItemId]);
      setCart(updatedCart);
      
      console.log('Item removed from cart:', updatedCart);
      return updatedCart;
    } catch (error) {
      console.error('Error removing from cart:', error);
      setError(error instanceof Error ? error.message : 'Failed to remove item from cart');
    } finally {
      setIsLoading(false);
    }
  }, [cart]);

  // Update item quantity
  const updateQuantity = useCallback(async (lineItemId: string, quantity: number) => {
    try {
      setIsLoading(true);
      const client = window.ShopifyBuyClient;
      
      if (!client || !cart) {
        throw new Error('Shopify client or cart not available');
      }

      const lineItemsToUpdate = [{
        id: lineItemId,
        quantity
      }];

      const updatedCart = await client.checkout.updateLineItems(cart.id, lineItemsToUpdate);
      setCart(updatedCart);
      
      console.log('Cart updated:', updatedCart);
      return updatedCart;
    } catch (error) {
      console.error('Error updating cart:', error);
      setError(error instanceof Error ? error.message : 'Failed to update cart');
    } finally {
      setIsLoading(false);
    }
  }, [cart]);

  // Clear entire cart
  const clearCart = useCallback(async () => {
    try {
      setIsLoading(true);
      const client = window.ShopifyBuyClient;
      
      if (!client) {
        throw new Error('Shopify client not initialized');
      }

      // Create a new empty cart
      const newCart = await client.checkout.create();
      localStorage.setItem('shopify-buy-cart-id', newCart.id);
      setCart(newCart);
      
      console.log('Cart cleared, new cart created:', newCart);
      return newCart;
    } catch (error) {
      console.error('Error clearing cart:', error);
      setError(error instanceof Error ? error.message : 'Failed to clear cart');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize cart on mount
  useEffect(() => {
    const initCart = () => {
      console.log('useShopifyCart: Starting initialization...');
      
      if (window.ShopifyBuyClient) {
        console.log('useShopifyCart: Client already available, initializing cart...');
        getShopifyCart();
        return;
      }
      
      // Listen for the client ready event
      const handleClientReady = () => {
        console.log('useShopifyCart: Received client ready event');
        getShopifyCart();
      };
      
      window.addEventListener('shopify-client-ready', handleClientReady);
      
      // Fallback polling for client availability
      let attempts = 0;
      const maxAttempts = 20; // Wait max 10 seconds
      
      const checkShopify = () => {
        attempts++;
        console.log(`useShopifyCart: Polling attempt ${attempts}`);
        
        if (window.ShopifyBuyClient) {
          console.log('useShopifyCart: Client found via polling, initializing cart...');
          window.removeEventListener('shopify-client-ready', handleClientReady);
          getShopifyCart();
        } else if (attempts < maxAttempts) {
          setTimeout(checkShopify, 500);
        } else {
          console.error('useShopifyCart: Client failed to initialize after', maxAttempts, 'attempts');
          setError('Failed to initialize Shopify. Please refresh the page.');
          setIsLoading(false);
          window.removeEventListener('shopify-client-ready', handleClientReady);
        }
      };
      
      // Start polling as backup
      setTimeout(checkShopify, 1000); // Give the global component time to initialize
      
      // Cleanup function
      return () => {
        window.removeEventListener('shopify-client-ready', handleClientReady);
      };
    };

    return initCart();
  }, [getShopifyCart]);

  // Listen for cart updates from the global cart component
  useEffect(() => {
    const handleCartUpdate = (event: CustomEvent) => {
      setCart(event.detail);
    };

    window.addEventListener('shopify-cart-updated', handleCartUpdate as EventListener);
    
    return () => {
      window.removeEventListener('shopify-cart-updated', handleCartUpdate as EventListener);
    };
  }, []);

  return {
    cart,
    isLoading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    refreshCart: getShopifyCart,
    totalItems: cart?.totalQuantity || 0,
    totalPrice: cart?.totalPrice?.amount || '0',
    checkoutUrl: cart?.checkoutUrl || '',
    isEmpty: !cart?.lineItems || cart.lineItems.length === 0
  };
};
