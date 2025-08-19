"use client";

import { useEffect, useState } from 'react';

const ShopifyDebug = () => {
  const [status, setStatus] = useState<string>('Initializing...');
  const [clientAvailable, setClientAvailable] = useState(false);
  const [cartId, setCartId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set client-side flag
    setIsClient(true);
    
    const checkStatus = () => {
      if (typeof window === 'undefined') return;
      
      const shopifyBuy = !!(window as any).ShopifyBuy;
      const shopifyClient = !!(window as any).ShopifyBuyClient;
      const storedCartId = localStorage.getItem('shopify-buy-cart-id');
      
      setClientAvailable(shopifyClient);
      setCartId(storedCartId);
      
      if (!shopifyBuy && !shopifyClient) {
        setStatus('Shopify SDK not loaded');
      } else if (shopifyBuy && !shopifyClient) {
        setStatus('Shopify SDK loaded, client not initialized');
      } else if (shopifyClient) {
        setStatus('Shopify client ready');
      }
    };

    // Check immediately
    checkStatus();

    // Check periodically
    const interval = setInterval(checkStatus, 1000);

    // Listen for client ready event
    const handleClientReady = () => {
      setStatus('Client ready event received');
      checkStatus();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('shopify-client-ready', handleClientReady);
    }

    return () => {
      clearInterval(interval);
      if (typeof window !== 'undefined') {
        window.removeEventListener('shopify-client-ready', handleClientReady);
      }
    };
  }, []);

  const testCreateCart = async () => {
    try {
      const client = (window as any).ShopifyBuyClient;
      if (!client) {
        setStatus('No client available for testing');
        return;
      }

      setStatus('Creating test cart...');
      const cart = await client.checkout.create();
      setStatus(`Test cart created: ${cart.id}`);
      localStorage.setItem('shopify-buy-cart-id', cart.id);
      setCartId(cart.id);
      
      // Trigger a cart update event so the cart display refreshes
      window.dispatchEvent(new CustomEvent('shopify-cart-updated', { detail: cart }));
    } catch (error) {
      setStatus(`Error creating cart: ${error}`);
    }
  };

  const testAddProduct = async () => {
    try {
      const client = (window as any).ShopifyBuyClient;
      if (!client) {
        setStatus('No client available for testing');
        return;
      }

      // Get or create cart
      let cartId = localStorage.getItem('shopify-buy-cart-id');
      let cart;
      
      if (cartId) {
        try {
          cart = await client.checkout.fetch(cartId);
        } catch {
          cart = await client.checkout.create();
          localStorage.setItem('shopify-buy-cart-id', cart.id);
        }
      } else {
        cart = await client.checkout.create();
        localStorage.setItem('shopify-buy-cart-id', cart.id);
      }

      setStatus('Adding test product...');
      
      // First, let's fetch your products to get a real variant ID
      const products = await client.product.fetchAll();
      if (products.length === 0) {
        setStatus('No products found in store');
        return;
      }
      
      const firstProduct = products[0];
      const variantId = firstProduct.variants[0].id;
      
      setStatus(`Adding product: ${firstProduct.title}...`);
      
      const lineItemsToAdd = [{
        variantId: variantId,
        quantity: 1
      }];

      const updatedCart = await client.checkout.addLineItems(cart.id, lineItemsToAdd);
      setStatus(`Product added! Cart has ${updatedCart.lineItems.length} item(s)`);
      
      // Update stored cart ID and trigger refresh
      localStorage.setItem('shopify-buy-cart-id', updatedCart.id);
      setCartId(updatedCart.id);
      
      // Trigger a cart update event so the cart display refreshes
      window.dispatchEvent(new CustomEvent('shopify-cart-updated', { detail: updatedCart }));
      
    } catch (error) {
      setStatus(`Error adding product: ${error}`);
      console.error('Full error:', error);
    }
  };

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
      <h3 className="font-semibold mb-2">🔧 Shopify Debug Status</h3>
      <div className="text-sm space-y-1">
        <p><strong>Status:</strong> {status}</p>
        <p><strong>Client Available:</strong> {clientAvailable ? '✅' : '❌'}</p>
        <p><strong>Stored Cart ID:</strong> {cartId || 'None'}</p>
        <p><strong>ShopifyBuy Global:</strong> {isClient && typeof window !== 'undefined' && !!(window as any).ShopifyBuy ? '✅' : '❌'}</p>
        <p><strong>ShopifyBuyClient Global:</strong> {isClient && typeof window !== 'undefined' && !!(window as any).ShopifyBuyClient ? '✅' : '❌'}</p>
      </div>
      
      <div className="flex gap-2 mt-3">
        <button
          onClick={testCreateCart}
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
        >
          Test Create Cart
        </button>
        <button
          onClick={testAddProduct}
          className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
        >
          Test Add Product
        </button>
      </div>
    </div>
  );
};

export default ShopifyDebug;
