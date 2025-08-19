"use client";

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';

// Shopify Configuration
const SHOPIFY_DOMAIN = "v1ydcw-0r.myshopify.com";
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = "c4c57221667b9c125e1976c34b1846c3";

// Helper to convert product ID to GID format
const formatProductGid = (id: string) => {
  if (id.startsWith('gid://shopify/Product/')) {
    return id;
  }
  return `gid://shopify/Product/${id}`;
};

// Helper to convert variant ID to GID format  
const formatVariantGid = (id: string) => {
  if (id.startsWith('gid://shopify/ProductVariant/')) {
    return id;
  }
  return `gid://shopify/ProductVariant/${id}`;
};

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    product: {
      title: string;
      handle: string;
      images: {
        edges: Array<{
          node: {
            url: string;
            altText: string | null;
          };
        }>;
      };
    };
    price: {
      amount: string;
      currencyCode: string;
    };
    compareAtPrice?: {
      amount: string;
      currencyCode: string;
    };
  };
  cost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
}

export interface ShopifyCart {
  id: string;
  lines: {
    edges: Array<{
      node: ShopifyCartLine;
    }>;
  };
  cost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
    subtotalAmount: {
      amount: string;
      currencyCode: string;
    };
    totalTaxAmount?: {
      amount: string;
      currencyCode: string;
    };
  };
  checkoutUrl: string;
}

interface ShopifyCartState {
  cart: ShopifyCart | null;
  loading: boolean;
  error: string | null;
}

type ShopifyCartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CART'; payload: ShopifyCart | null }
  | { type: 'SET_ERROR'; payload: string | null };

interface ShopifyCartContextType extends ShopifyCartState {
  createCart: () => Promise<void>;
  addToCart: (variantId: string, quantity?: number) => Promise<void>;
  updateCartLine: (lineId: string, quantity: number) => Promise<void>;
  removeFromCart: (lineId: string) => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const initialState: ShopifyCartState = {
  cart: null,
  loading: false,
  error: null,
};

function shopifyCartReducer(state: ShopifyCartState, action: ShopifyCartAction): ShopifyCartState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_CART':
      return { ...state, cart: action.payload, loading: false };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

const ShopifyCartContext = createContext<ShopifyCartContextType | undefined>(undefined);

export const useShopifyCart = () => {
  const context = useContext(ShopifyCartContext);
  if (!context) {
    throw new Error('useShopifyCart must be used within a ShopifyCartProvider');
  }
  return context;
};

// GraphQL queries
const CART_QUERY = `
  fragment CartLine on CartLine {
    id
    quantity
    merchandise {
      ... on ProductVariant {
        id
        title
        product {
          title
          handle
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
        }
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
      }
    }
    cost {
      totalAmount {
        amount
        currencyCode
      }
    }
  }

  fragment Cart on Cart {
    id
    lines(first: 100) {
      edges {
        node {
          ...CartLine
        }
      }
    }
    cost {
      totalAmount {
        amount
        currencyCode
      }
      subtotalAmount {
        amount
        currencyCode
      }
      totalTaxAmount {
        amount
        currencyCode
      }
    }
    checkoutUrl
  }
`;

const CREATE_CART_MUTATION = `
  mutation cartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart {
        ...Cart
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_QUERY}
`;

const ADD_TO_CART_MUTATION = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...Cart
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_QUERY}
`;

const UPDATE_CART_MUTATION = `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...Cart
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_QUERY}
`;

const REMOVE_FROM_CART_MUTATION = `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...Cart
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_QUERY}
`;

const GET_CART_QUERY = `
  query getCart($cartId: ID!) {
    cart(id: $cartId) {
      ...Cart
    }
  }
  ${CART_QUERY}
`;

// GraphQL query to get product with variants
const GET_PRODUCT_QUERY = `
  query getProduct($id: ID!) {
    product(id: $id) {
      id
      title
      variants(first: 10) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            availableForSale
          }
        }
      }
    }
  }
`;

// Shopify API helper
async function shopifyFetch(query: string, variables = {}) {
  const response = await fetch(`https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  
  if (data.errors) {
    throw new Error(data.errors[0].message);
  }

  return data;
}

interface ShopifyCartProviderProps {
  children: ReactNode;
}

export const ShopifyCartProvider: React.FC<ShopifyCartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(shopifyCartReducer, initialState);

  // Load existing cart from localStorage
  useEffect(() => {
    const loadExistingCart = async () => {
      const cartId = localStorage.getItem('shopify-cart-id');
      if (cartId) {
        try {
          dispatch({ type: 'SET_LOADING', payload: true });
          const { data } = await shopifyFetch(GET_CART_QUERY, { cartId });
          if (data.cart) {
            dispatch({ type: 'SET_CART', payload: data.cart });
          } else {
            // Cart doesn't exist anymore, remove from localStorage
            localStorage.removeItem('shopify-cart-id');
          }
        } catch (error) {
          console.error('Error loading cart:', error);
          dispatch({ type: 'SET_ERROR', payload: 'Failed to load cart' });
          localStorage.removeItem('shopify-cart-id');
        }
      }
    };

    loadExistingCart();
  }, []);

  const createCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { data } = await shopifyFetch(CREATE_CART_MUTATION, { lines: [] });
      
      if (data.cartCreate.userErrors.length > 0) {
        throw new Error(data.cartCreate.userErrors[0].message);
      }

      const cart = data.cartCreate.cart;
      localStorage.setItem('shopify-cart-id', cart.id);
      dispatch({ type: 'SET_CART', payload: cart });
    } catch (error) {
      console.error('Error creating cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create cart' });
    }
  };

  const addToCart = async (variantId: string, quantity = 1) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      let cartId = state.cart?.id;
      
      // Create cart if it doesn't exist
      if (!cartId) {
        const { data } = await shopifyFetch(CREATE_CART_MUTATION, { 
          lines: [{ merchandiseId: variantId, quantity }] 
        });
        
        if (data.cartCreate.userErrors.length > 0) {
          throw new Error(data.cartCreate.userErrors[0].message);
        }

        const cart = data.cartCreate.cart;
        localStorage.setItem('shopify-cart-id', cart.id);
        dispatch({ type: 'SET_CART', payload: cart });
        return;
      }

      // Add to existing cart
      const { data } = await shopifyFetch(ADD_TO_CART_MUTATION, {
        cartId,
        lines: [{ merchandiseId: variantId, quantity }]
      });

      if (data.cartLinesAdd.userErrors.length > 0) {
        throw new Error(data.cartLinesAdd.userErrors[0].message);
      }

      dispatch({ type: 'SET_CART', payload: data.cartLinesAdd.cart });
    } catch (error) {
      console.error('Error adding to cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add item to cart' });
    }
  };

  const updateCartLine = async (lineId: string, quantity: number) => {
    if (!state.cart) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const { data } = await shopifyFetch(UPDATE_CART_MUTATION, {
        cartId: state.cart.id,
        lines: [{ id: lineId, quantity }]
      });

      if (data.cartLinesUpdate.userErrors.length > 0) {
        throw new Error(data.cartLinesUpdate.userErrors[0].message);
      }

      dispatch({ type: 'SET_CART', payload: data.cartLinesUpdate.cart });
    } catch (error) {
      console.error('Error updating cart line:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update cart' });
    }
  };

  const removeFromCart = async (lineId: string) => {
    if (!state.cart) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const { data } = await shopifyFetch(REMOVE_FROM_CART_MUTATION, {
        cartId: state.cart.id,
        lineIds: [lineId]
      });

      if (data.cartLinesRemove.userErrors.length > 0) {
        throw new Error(data.cartLinesRemove.userErrors[0].message);
      }

      dispatch({ type: 'SET_CART', payload: data.cartLinesRemove.cart });
    } catch (error) {
      console.error('Error removing from cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to remove item from cart' });
    }
  };

  const getTotalItems = () => {
    if (!state.cart) return 0;
    return state.cart.lines.edges.reduce((total, edge) => total + edge.node.quantity, 0);
  };

  const getTotalPrice = () => {
    if (!state.cart) return 0;
    return parseFloat(state.cart.cost.totalAmount.amount);
  };

  const contextValue: ShopifyCartContextType = {
    ...state,
    createCart,
    addToCart,
    updateCartLine,
    removeFromCart,
    getTotalItems,
    getTotalPrice,
  };

  return (
    <ShopifyCartContext.Provider value={contextValue}>
      {children}
    </ShopifyCartContext.Provider>
  );
};
