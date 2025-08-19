"use client";

import { useEffect, useState } from 'react';

const SimpleShopifyLoader = () => {
  const [status, setStatus] = useState('Starting...');

  useEffect(() => {
    const loadShopify = async () => {
      try {
        setStatus('Loading script...');
        
        // Check if already loaded
        if ((window as any).ShopifyBuy) {
          setStatus('Already loaded!');
          return;
        }

        // Create script element
        const script = document.createElement('script');
        script.src = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
        script.async = true;
        
        // Wait for script to load
        const scriptPromise = new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });

        // Add to head
        document.head.appendChild(script);
        setStatus('Script added to head, waiting...');

        // Wait for load
        await scriptPromise;
        setStatus('Script loaded, checking ShopifyBuy...');

        // Check if ShopifyBuy is available
        if ((window as any).ShopifyBuy) {
          setStatus('✅ ShopifyBuy available!');
          
          // Try to create client
          const client = (window as any).ShopifyBuy.buildClient({
            domain: 'v1ydcw-0r.myshopify.com',
            storefrontAccessToken: 'c4c57221667b9c125e1976c34b1846c3',
          });

          (window as any).ShopifyBuyClient = client;
          setStatus('✅ Client created successfully!');
        } else {
          setStatus('❌ ShopifyBuy not available after load');
        }

      } catch (error) {
        setStatus(`❌ Error: ${error}`);
        console.error('SimpleShopifyLoader error:', error);
      }
    };

    loadShopify();
  }, []);

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <h4 className="font-semibold mb-2">🧪 Simple Shopify Loader</h4>
      <p className="text-sm">{status}</p>
    </div>
  );
};

export default SimpleShopifyLoader;
