"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    ShopifyBuy: any;
  }
}

interface ShopifyCollectionProps {
  collectionId?: string;
  className?: string;
}

const ShopifyCollection: React.FC<ShopifyCollectionProps> = ({ 
  collectionId = "433612062851",
  className = ""
}) => {
  const componentRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current || !componentRef.current) return;

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
        
        const head = document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0];
        head.appendChild(script);
      });
    }

    function ShopifyBuyInit() {
      if (!window.ShopifyBuy || !componentRef.current || isInitialized.current) return;

      const client = window.ShopifyBuy.buildClient({
        domain: 'v1ydcw-0r.myshopify.com',
        storefrontAccessToken: 'c4c57221667b9c125e1976c34b1846c3',
      });

      window.ShopifyBuy.UI.onReady(client).then((ui: any) => {
        if (isInitialized.current || !componentRef.current) return;

        ui.createComponent('collection', {
          id: collectionId,
          node: componentRef.current,
          moneyFormat: 'Dhs.%20%7B%7Bamount%7D%7D',
          options: {
            product: {
              styles: {
                product: {
                  "@media (min-width: 601px)": {
                    "max-width": "calc(25% - 20px)",
                    "margin-left": "20px",
                    "margin-bottom": "50px",
                    "width": "calc(25% - 20px)"
                  },
                  "img": {
                    "height": "calc(100% - 15px)",
                    "position": "absolute",
                    "left": "0",
                    "right": "0",
                    "top": "0"
                  },
                  "imgWrapper": {
                    "padding-top": "calc(75% + 15px)",
                    "position": "relative",
                    "height": "0"
                  }
                },
                button: {
                  "background-color": "#D29FDC",
                  "border-radius": "40px",
                  "color": "#000000",
                  "font-weight": "600",
                  ":hover": {
                    "background-color": "#C285CC",
                  },
                  ":focus": {
                    "background-color": "#C285CC",
                  },
                }
              },
              text: {
                button: "Add to cart"
              }
            },
            productSet: {
              styles: {
                products: {
                  "@media (min-width: 601px)": {
                    "margin-left": "-20px"
                  }
                }
              }
            },
            modalProduct: {
              contents: {
                img: false,
                imgWithCarousel: true,
                button: false,
                buttonWithQuantity: true
              },
              styles: {
                product: {
                  "@media (min-width: 601px)": {
                    "max-width": "100%",
                    "margin-left": "0px",
                    "margin-bottom": "0px"
                  }
                },
                button: {
                  "background-color": "#D29FDC",
                  "border-radius": "40px",
                  "color": "#000000",
                  ":hover": {
                    "background-color": "#C285CC",
                  },
                  ":focus": {
                    "background-color": "#C285CC",
                  },
                }
              },
              text: {
                button: "Add to cart"
              }
            },
            option: {},
            cart: {
              styles: {
                button: {
                  "background-color": "#D29FDC",
                  "border-radius": "40px",
                  "color": "#000000",
                  ":hover": {
                    "background-color": "#C285CC",
                  },
                  ":focus": {
                    "background-color": "#C285CC",
                  },
                }
              },
              text: {
                total: "Subtotal",
                button: "Checkout"
              }
            },
            toggle: {
              styles: {
                toggle: {
                  "background-color": "#D29FDC",
                  ":hover": {
                    "background-color": "#C285CC",
                  },
                  ":focus": {
                    "background-color": "#C285CC",
                  },
                }
              }
            }
          },
        });

        isInitialized.current = true;
      });
    }

    // Initialize the component
    if (window.ShopifyBuy) {
      if (window.ShopifyBuy.UI) {
        ShopifyBuyInit();
      } else {
        loadScript().then(ShopifyBuyInit);
      }
    } else {
      loadScript().then(ShopifyBuyInit);
    }

    // Cleanup function
    return () => {
      isInitialized.current = false;
      if (componentRef.current) {
        componentRef.current.innerHTML = "";
      }
    };
  }, [collectionId]);

  return (
    <div 
      ref={componentRef}
      className={`shopify-collection-container ${className}`}
      id={`collection-component-${Date.now()}`}
    />
  );
};

export default ShopifyCollection;
