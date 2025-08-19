"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    ShopifyBuy: any;
    ShopifyBuyClient: any;
  }
}

const ShopifyClientOnly = () => {
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current || typeof window === 'undefined') return;

    const scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
    
    function loadScript() {
      return new Promise<void>((resolve, reject) => {
        const existingScript = document.querySelector(`script[src="${scriptURL}"]`);
        
        if (existingScript) {
          if (window.ShopifyBuy) {
            resolve();
          } else {
            existingScript.addEventListener("load", () => resolve());
            existingScript.addEventListener("error", reject);
          }
          return;
        }

        const script = document.createElement('script');
        script.async = true;
        script.src = scriptURL;
        script.onload = () => resolve();
        script.onerror = reject;
        
        const head = document.getElementsByTagName('head')[0];
        if (head) {
          head.appendChild(script);
        }
      });
    }

    function initializeClient() {
      if (!window.ShopifyBuy || isInitialized.current) return;

      try {
        const client = window.ShopifyBuy.buildClient({
          domain: 'v1ydcw-0r.myshopify.com',
          storefrontAccessToken: 'c4c57221667b9c125e1976c34b1846c3',
        });

        // Store the client globally
        window.ShopifyBuyClient = client;
        
        // Dispatch event to notify other components
        window.dispatchEvent(new CustomEvent('shopify-client-ready', { detail: client }));
        
        console.log('✅ Shopify client initialized successfully (no widget)');
        console.log('Cart data will be managed through our custom components');
        isInitialized.current = true;
      } catch (error) {
        console.error('Error creating Shopify client:', error);
      }
    }

    // Initialize
    if (window.ShopifyBuy) {
      initializeClient();
    } else {
      loadScript()
        .then(initializeClient)
        .catch((error) => {
          console.error('Failed to load Shopify script:', error);
        });
    }

    return () => {
      isInitialized.current = false;
    };
  }, []);

  return null; // This component doesn't render anything
};

export default ShopifyClientOnly;
