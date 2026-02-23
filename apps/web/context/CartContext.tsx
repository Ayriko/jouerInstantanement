"use client";

import React, { createContext, useContext, useEffect, useReducer } from "react";

import { Game } from "@/types/game";

const STORAGE_KEY = "ji-cart";

type CartAction =
  | { type: "HYDRATE"; items: Game[] }
  | { type: "ADD_ITEM"; game: Game }
  | { type: "REMOVE_ITEM"; gameId: string }
  | { type: "CLEAR" };

interface CartState {
  items: Game[];
  isHydrated: boolean;
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return { items: action.items, isHydrated: true };
    case "ADD_ITEM":
      if (state.items.some((item) => item.id === action.game.id)) {
        return state;
      }
      return { ...state, items: [...state.items, action.game] };
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.gameId),
      };
    case "CLEAR":
      return { ...state, items: [] };
    default:
      return state;
  }
}

interface CartContextValue {
  items: Game[];
  isHydrated: boolean;
  addItem: (game: Game) => void;
  removeItem: (gameId: string) => void;
  clearCart: () => void;
  isInCart: (gameId: string) => boolean;
  itemCount: number;
  subtotal: number;
  total: number;
  discount: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isHydrated: false,
  });

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const items: Game[] = stored ? JSON.parse(stored) : [];
      dispatch({ type: "HYDRATE", items });
    } catch {
      dispatch({ type: "HYDRATE", items: [] });
    }
  }, []);

  // Persist to localStorage after each change (post-hydration)
  useEffect(() => {
    if (state.isHydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    }
  }, [state.items, state.isHydrated]);

  const addItem = (game: Game) => dispatch({ type: "ADD_ITEM", game });
  const removeItem = (gameId: string) =>
    dispatch({ type: "REMOVE_ITEM", gameId });
  const clearCart = () => dispatch({ type: "CLEAR" });
  const isInCart = (gameId: string) =>
    state.items.some((item) => item.id === gameId);

  const itemCount = state.items.length;
  const subtotal = state.items.reduce(
    (sum, item) => sum + item.originalPrice,
    0,
  );
  const total = state.items.reduce((sum, item) => sum + item.price, 0);
  const discount = subtotal - total;

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isHydrated: state.isHydrated,
        addItem,
        removeItem,
        clearCart,
        isInCart,
        itemCount,
        subtotal,
        total,
        discount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
