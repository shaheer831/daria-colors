"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    ShopifyBuy: any;
    ShopifyBuyClient: any;
    ShopifyCartComponent: any;
  }
}

const GlobalShopifyCart = () => {
  const isInitialized = useRef(false);
  const [isClient, setIsClient] = useState(false);

  // Ensure this only runs on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Only run if we're on the client and not already initialized
    if (!isClient || isInitialized.current || typeof window === "undefined")
      return;

    console.log("GlobalShopifyCart: Starting initialization...");
    const scriptURL =
      "https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js";

    function loadScript() {
      return new Promise<void>((resolve, reject) => {
        console.log("GlobalShopifyCart: Checking for existing script...");
        const existingScript = document.querySelector(
          `script[src="${scriptURL}"]`
        );

        if (existingScript) {
          console.log(
            "GlobalShopifyCart: Script already exists, checking if loaded..."
          );
          if (window.ShopifyBuy) {
            console.log("GlobalShopifyCart: ShopifyBuy already available");
            resolve();
          } else {
            console.log(
              "GlobalShopifyCart: Script exists but not loaded, waiting..."
            );
            existingScript.addEventListener("load", () => {
              console.log("GlobalShopifyCart: Existing script loaded");
              resolve();
            });
            existingScript.addEventListener("error", (err) => {
              console.error(
                "GlobalShopifyCart: Existing script failed to load",
                err
              );
              reject(err);
            });
          }
          return;
        }

        console.log("GlobalShopifyCart: Creating new script element...");
        const script = document.createElement("script");
        script.async = true;
        script.src = scriptURL;

        script.onload = () => {
          console.log("GlobalShopifyCart: Script loaded successfully");
          resolve();
        };

        script.onerror = (err) => {
          console.error("GlobalShopifyCart: Failed to load script", err);
          reject(err);
        };

        const head =
          document.getElementsByTagName("head")[0] ||
          document.getElementsByTagName("body")[0];
        if (!head) {
          console.error("GlobalShopifyCart: No head or body element found");
          reject(new Error("No head or body element found"));
          return;
        }

        console.log("GlobalShopifyCart: Appending script to", head.tagName);
        head.appendChild(script);
      });
    }

    function initializeShopifyCart() {
      if (!window.ShopifyBuy || isInitialized.current) return;

      console.log("Initializing Shopify Buy SDK...");

      try {
        const client = window.ShopifyBuy.buildClient({
          domain: "v1ydcw-0r.myshopify.com",
          storefrontAccessToken: "c4c57221667b9c125e1976c34b1846c3",
        });

        // Store the client globally so other components can use it
        window.ShopifyBuyClient = client;
        console.log("Shopify Buy client created successfully:", client);

        // Dispatch event to notify other components
        window.dispatchEvent(
          new CustomEvent("shopify-client-ready", { detail: client })
        );

        window.ShopifyBuy.UI.onReady(client)
          .then((ui: any) => {
            if (isInitialized.current) return;

            console.log("Shopify Buy UI ready, creating cart component...");

            // Create a dedicated container for the cart
            let cartContainer = document.getElementById("shopify-cart-widget");
            if (!cartContainer) {
              cartContainer = document.createElement("div");
              cartContainer.id = "shopify-cart-widget";
              cartContainer.style.position = "fixed";
              cartContainer.style.top = "0";
              cartContainer.style.left = "0";
              cartContainer.style.zIndex = "999999";
              cartContainer.style.pointerEvents = "none";
              document.body.appendChild(cartContainer);
            }

            // Create the cart component (floating widget)
            const cartComponent = ui.createComponent("cart", {
              node: cartContainer,
              moneyFormat: "Dhs.%20%7B%7Bamount%7D%7D",
              options: {
                cart: {
                  styles: {
                    button: {
                      "background-color": "#D29FDC",
                      "border-radius": "40px",
                      color: "#000000",
                      ":hover": {
                        "background-color": "#C285CC",
                      },
                      ":focus": {
                        "background-color": "#C285CC",
                      },
                    },
                  },
                  text: {
                    total: "Subtotal",
                    button: "Checkout",
                  },
                },
                toggle: {
                  styles: {
                    toggle: {
                      "background-color": "#D29FDC",
                      "border-radius": "50%",
                      width: "60px",
                      height: "60px",
                      position: "fixed",
                      bottom: "20px",
                      right: "20px",
                      "z-index": "9999",
                      ":hover": {
                        "background-color": "#C285CC",
                      },
                      ":focus": {
                        "background-color": "#C285CC",
                      },
                    },
                  },
                },
              },
            });

            console.log("Shopify cart component created:", cartComponent);

            // Store reference to the cart component globally
            window.ShopifyCartComponent = cartComponent;

            isInitialized.current = true;
          })
          .catch((error: any) => {
            console.error("Error initializing Shopify Buy UI:", error);
          });
      } catch (error) {
        console.error("Error creating Shopify client:", error);
      }
    }

    // Initialize
    if (window.ShopifyBuy) {
      console.log(
        "GlobalShopifyCart: ShopifyBuy already available, initializing..."
      );
      initializeShopifyCart();
    } else {
      console.log(
        "GlobalShopifyCart: ShopifyBuy not available, loading script..."
      );
      loadScript()
        .then(() => {
          console.log("GlobalShopifyCart: Script loaded, initializing cart...");
          initializeShopifyCart();
        })
        .catch((error) => {
          console.error(
            "GlobalShopifyCart: Failed to load Shopify script:",
            error
          );
        });
    }

    // Cleanup
    return () => {
      isInitialized.current = false;
    };
  }, [isClient]);

  return null;
};

export default GlobalShopifyCart;
