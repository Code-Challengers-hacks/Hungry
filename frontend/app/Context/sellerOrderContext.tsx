"use client";

import React, { createContext, useReducer, useEffect } from "react";

export const SellerOrdersContext = createContext<SellerOrdersContextValue | null>(null);

export const sellerOrdersReducer = (state: SellerOrdersState, action: SellerOrdersAction) => {
  switch (action.type) {
    case "SET_SELLER_ORDERS":
      return {
        sellerOrders: action.payload,
      };
    case "CREATE_SELLER_ORDER":
      return {
        sellerOrders: [action.payload, ...state.sellerOrders],
      };
    case "DELETE_SELLER_ORDER":
      return {
        sellerOrders: state.sellerOrders.filter((w) => w.id != action.payload.id),
      };
    default:
      return state;
  }
};

export const SellerOrdersContextProvider: React.FC<{ children: React.ReactNode;}> = ({ children }) => {
    const [state, dispatch] = useReducer(sellerOrdersReducer, {
        sellerOrders: [], 
    });

    console.log("SellerOrdersContext state:", state);

    return (
        <SellerOrdersContext.Provider value={{ ...state, dispatch }}>
            {children}
        </SellerOrdersContext.Provider>
    );
};
