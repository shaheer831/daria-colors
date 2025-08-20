"use client";

import { useEffect, useRef, useState } from "react";

// TypeScript declarations for global Shopify objects
declare global {
  interface Window {
    ShopifyBuy: any;
    ShopifyBuyClient: any;
    ShopifyCheckout: any;
  }
}

// Shopify Collection Component with proper React lifecycle
const ShopifyCollection = () => {
  const componentRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);
  const shopifyComponent = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isInitialized.current) return;

    setIsLoading(true);
    setError(null);

    const initializeShopifyBuy = () => {
      if (!window.ShopifyBuy || isInitialized.current) return;

      const client = window.ShopifyBuy.buildClient({
        domain: "v1ydcw-0r.myshopify.com",
        storefrontAccessToken: "c4c57221667b9c125e1976c34b1846c3",
      });

      // Store client globally
      window.ShopifyBuyClient = client;

      // Initialize cart
      client.checkout.create().then((checkout: any) => {
        window.ShopifyCheckout = checkout;
        localStorage.setItem("shopify-checkout-id", checkout.id);

        window.dispatchEvent(
          new CustomEvent("shopify-cart-ready", {
            detail: { client, checkout },
          })
        );
      });

      window.ShopifyBuy.UI.onReady(client)
        .then((ui: any) => {
          if (isInitialized.current || !componentRef.current) return;

          shopifyComponent.current = ui.createComponent("collection", {
            id: "433612062851",
            node: componentRef.current,
            moneyFormat: "Dhs.%20%7B%7Bamount%7D%7D",
            options: {
              product: {
                styles: {
                  product: {
                    "@media (min-width: 601px)": {
                      "max-width": "calc(25% - 20px)",
                      "margin-left": "20px",
                      "margin-bottom": "50px",
                      width: "calc(25% - 20px)",
                    },
                    img: {
                      height: "calc(100% - 15px)",
                      position: "absolute",
                      left: "0",
                      right: "0",
                      top: "0",
                    },
                    imgWrapper: {
                      "padding-top": "calc(75% + 15px)",
                      position: "relative",
                      height: "0",
                    },
                  },
                  button: {
                    "background-color": "#000000",
                    "border-radius": "40px",
                    color: "#FFFFFF",
                    ":hover": {
                      "background-color": "#333333",
                    },
                    ":focus": {
                      "background-color": "#333333",
                    },
                  },
                },
                buttonDestination: "modal",
                contents: {
                  options: false,
                },
                text: {
                  button: "View product",
                },
              },
              productSet: {
                styles: {
                  products: {
                    "@media (min-width: 601px)": {
                      "margin-left": "-20px",
                    },
                  },
                },
              },
              modalProduct: {
                contents: {
                  img: false,
                  imgWithCarousel: true,
                  button: false,
                  buttonWithQuantity: true,
                },
                styles: {
                  product: {
                    "@media (min-width: 601px)": {
                      "max-width": "100%",
                      "margin-left": "0px",
                      "margin-bottom": "0px",
                    },
                  },
                  button: {
                    "background-color": "#000000",
                    "border-radius": "40px",
                    color: "#FFFFFF",
                    ":hover": {
                      "background-color": "#333333",
                    },
                    ":focus": {
                      "background-color": "#333333",
                    },
                  },
                },
                text: {
                  button: "Add to cart",
                },
              },
              option: {},
              cart: {
                styles: {
                  button: {
                    "background-color": "#000000",
                    "border-radius": "40px",
                    color: "#FFFFFF",
                    ":hover": {
                      "background-color": "#333333",
                    },
                    ":focus": {
                      "background-color": "#333333",
                    },
                  },
                },
                text: {
                  button: "Checkout",
                },
                isVisible: true,
              },
              toggle: {
                isVisible: true,
                styles: {
                  toggle: {
                    "background-color": "#000000",
                    color: "#FFFFFF",
                    ":hover": {
                      "background-color": "#333333",
                    },
                    ":focus": {
                      "background-color": "#333333",
                    },
                  },
                  count: {
                    color: "#FFFFFF",
                  },
                  iconPath: {
                    fill: "#FFFFFF",
                  },
                },
              },
            },
          });

          isInitialized.current = true;
          setIsLoading(false);
        })
        .catch((error: any) => {
          console.error("Error initializing Shopify UI:", error);
          setError("Failed to load products. Please try refreshing the page.");
          setIsLoading(false);
        });
    };

    const loadScript = () => {
      return new Promise<void>((resolve, reject) => {
        const existingScript = document.querySelector(
          'script[src="https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js"]'
        );

        if (existingScript) {
          if (window.ShopifyBuy) {
            resolve();
          } else {
            existingScript.addEventListener("load", () => resolve());
            existingScript.addEventListener("error", reject);
          }
          return;
        }

        const script = document.createElement("script");
        script.async = true;
        script.src =
          "https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js";

        script.onload = () => resolve();
        script.onerror = reject;

        document.head.appendChild(script);
      });
    };

    // Load and initialize
    if (window.ShopifyBuy) {
      initializeShopifyBuy();
    } else {
      loadScript()
        .then(() => initializeShopifyBuy())
        .catch((error) => {
          console.error("Failed to load Shopify script:", error);
          setError("Failed to load Shopify SDK. Please check your connection.");
          setIsLoading(false);
        });
    }

    // Cleanup
    return () => {
      if (shopifyComponent.current && shopifyComponent.current.destroy) {
        shopifyComponent.current.destroy();
      }
      if (componentRef.current) {
        componentRef.current.innerHTML = "";
      }
      isInitialized.current = false;
    };
  }, []);

  return (
    <div className="mb-8">
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16">
          {/* Loading Spinner */}
          <div className="relative">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-4"></div>
          </div>
          <p className="text-gray-600 font-Sen text-sm">Loading products...</p>
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
            <div className="text-red-600 mb-2">
              <svg
                className="w-8 h-8 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="font-Sen font-semibold text-red-800 mb-2">
              Loading Error
            </h3>
            <p className="text-red-600 text-sm mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white font-Sen font-semibold py-2 px-4 rounded-full transition-colors duration-200"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      <div
        ref={componentRef}
        className={
          isLoading || error
            ? "opacity-0"
            : "opacity-100 transition-opacity duration-300"
        }
      />
    </div>
  );
};

const ProductsCollectionPage = () => {
  return (
    <div className="min-h-screen px-7 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-[32px] font-Tenor font-normal text-black mb-3 leading-tight">
            Color Swatches Collection
          </h1>
          <p className="text-[#7E7E7E] text-[17px] leading-5 tracking-wide max-w-2xl mx-auto">
            Discover your perfect seasonal color palette with our complete
            collection of color analysis keychains.
          </p>
        </div>

        {/* Shopify Collection */}
        <ShopifyCollection />

        {/* Trust Indicators */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="font-Tenor text-3xl font-bold text-black mb-2">
                10,000+
              </div>
              <div className="text-sm text-gray-600">Happy Customers</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="font-Tenor text-3xl font-bold text-black mb-2">
                94%
              </div>
              <div className="text-sm text-gray-600">Satisfaction Rate</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="font-Tenor text-3xl font-bold text-black mb-2">
                12
              </div>
              <div className="text-sm text-gray-600">Seasonal Palettes</div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="mt-12 max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-Tenor font-semibold text-black mb-4">
            Why Choose Seasonal Color Analysis?
          </h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Seasonal color analysis helps you discover which colors enhance your
            natural beauty. Each season represents a different undertone and
            intensity that complements specific skin tones, hair colors, and eye
            colors.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="text-left">
              <h3 className="font-Sen font-semibold text-lg text-black mb-2">
                🌸 Spring Palettes
              </h3>
              <p className="text-gray-600 text-sm">
                Warm, clear, and bright colors for those with golden undertones
              </p>
            </div>
            <div className="text-left">
              <h3 className="font-Sen font-semibold text-lg text-black mb-2">
                🌊 Summer Palettes
              </h3>
              <p className="text-gray-600 text-sm">
                Cool, soft, and muted colors for those with blue undertones
              </p>
            </div>
            <div className="text-left">
              <h3 className="font-Sen font-semibold text-lg text-black mb-2">
                🍂 Autumn Palettes
              </h3>
              <p className="text-gray-600 text-sm">
                Warm, rich, and earthy colors for deep golden undertones
              </p>
            </div>
            <div className="text-left">
              <h3 className="font-Sen font-semibold text-lg text-black mb-2">
                ❄️ Winter Palettes
              </h3>
              <p className="text-gray-600 text-sm">
                Cool, clear, and dramatic colors for high contrast features
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsCollectionPage;
