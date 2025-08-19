"use client"

import { useEffect, useRef } from "react"

interface ShopifyBuyButtonProps {
  productId: string
  domain?: string
  storefrontAccessToken?: string
  moneyFormat?: string
  buttonText?: string
  cartButtonText?: string
  checkoutButtonText?: string
}

declare global {
  interface Window {
    ShopifyBuy: any
  }
}

export default function ShopifyBuyButton({
  productId,
  domain = "v1ydcw-0r.myshopify.com",
  storefrontAccessToken = "c4c57221667b9c125e1976c34b1846c3",
  moneyFormat = "Dhs.%20%7B%7Bamount%7D%7D",
  buttonText = "Buy now",
  cartButtonText = "Add to cart",
  checkoutButtonText = "Checkout",
}: ShopifyBuyButtonProps) {
  const componentRef = useRef<HTMLDivElement>(null)
  const componentId = `product-component-${productId}`
  const isInitialized = useRef(false)
  const shopifyComponent = useRef<any>(null)

  useEffect(() => {
    if (isInitialized.current) return

    const scriptURL = "https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js"

    function loadScript() {
      return new Promise<void>((resolve, reject) => {
        // Check if script already exists
        const existingScript = document.querySelector(`script[src="${scriptURL}"]`)
        if (existingScript) {
          if (window.ShopifyBuy) {
            resolve()
          } else {
            existingScript.addEventListener("load", () => resolve())
            existingScript.addEventListener("error", reject)
          }
          return
        }

        // Create new script
        const script = document.createElement("script")
        script.async = true
        script.src = scriptURL
        script.onload = () => resolve()
        script.onerror = reject

        const head = document.getElementsByTagName("head")[0] || document.getElementsByTagName("body")[0]
        head.appendChild(script)
      })
    }

    function initializeShopifyBuy() {
      if (!window.ShopifyBuy || !componentRef.current || isInitialized.current) return

      const client = window.ShopifyBuy.buildClient({
        domain,
        storefrontAccessToken,
      })

      window.ShopifyBuy.UI.onReady(client).then((ui: any) => {
        if (isInitialized.current) return

        shopifyComponent.current = ui.createComponent("product", {
          id: productId,
          node: componentRef.current,
          moneyFormat,
          options: {
            product: {
              styles: {
                product: {
                  "@media (min-width: 601px)": {
                    "max-width": "calc(25% - 20px)",
                    "margin-left": "20px",
                    "margin-bottom": "50px",
                  },
                },
                button: {
                  "background-color": "#D29FDC",
                  "border-radius": "40px",
                  color: "#000000", // black text
                  "font-weight": "600", // semibold,
                  padding: "15px 39px",
                  text: "20px",
                  ":hover": {
                    "background-color": "#C285CC",
                  },
                  ":focus": {
                    "background-color": "#C285CC",
                  },
                },
              },
              buttonDestination: "checkout",
              contents: {
                img: false,
                title: false,
                price: false,
              },
              text: {
                button: buttonText,
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
                  "background-color": "#D29FDC",
                  "border-radius": "40px",
                  ":hover": {
                    "background-color": "#C285CC",
                  },
                  ":focus": {
                    "background-color": "#C285CC",
                  },
                },
              },
              text: {
                button: cartButtonText,
              },
            },
            option: {},
            cart: {
              styles: {
                button: {
                  "background-color": "#D29FDC",
                  "border-radius": "40px",
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
                button: checkoutButtonText,
              },
            },
            toggle: {},
          },
        })

        isInitialized.current = true
      })
    }

    // Load script and initialize
    if (window.ShopifyBuy) {
      if (window.ShopifyBuy.UI) {
        initializeShopifyBuy()
      } else {
        loadScript().then(initializeShopifyBuy)
      }
    } else {
      loadScript().then(initializeShopifyBuy)
    }

    return () => {
      isInitialized.current = false
      if (shopifyComponent.current && shopifyComponent.current.destroy) {
        shopifyComponent.current.destroy()
      }
      shopifyComponent.current = null
      if (componentRef.current) {
        componentRef.current.innerHTML = ""
      }
    }
  }, [productId, domain, storefrontAccessToken, moneyFormat, buttonText, cartButtonText, checkoutButtonText])

  return <div id={componentId} ref={componentRef} className="font-Sen text-black" />
}
