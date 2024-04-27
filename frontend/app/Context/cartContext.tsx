"use client";

import React, { createContext, useReducer, useEffect } from "react";

export const CartsContext = createContext<CartContextValue | null>(null);

export const CartsReducer = (state: CartState, action: CartAction) => {
  switch (action.type) {
    case "SET_CARTS":
      return {
        cart: action.payload,
      };
    case "CREATE_CART":
      return {
        cart: [action.payload, ...state.cart],
      };
    case "DELETE_CART":
      return {
        cart: state.cart.filter((w) => w.id != action.payload.id),
      };
    case "DELETE_CART_ITEM":
      return {
        cart: state.cart.map((item) => {
          if (item.id === action.payload.item.CartId) {
            return {
              ...item,
              items: item.items.filter((w) => w.id != action.payload.item.id),
              total: action.payload.total
            };
          }
          return item;
        }),
      };
    case "PLACE_ORDER":
      return {
        cart: state.cart.filter((w) => w.id != action.payload.id),
      };
    case "UPDATE_QUANTITY":
      return {
        cart: state.cart.map((item) => {
          if (item.id === action.payload.item.CartId) {
            const updatedItems = item.items.map((w) => {
              if (w.id === action.payload.item.id) {
                return {
                  ...w,
                  quantity: action.payload.quantity
                };
              }
              return w;
            });
    
            return {
              ...item,
              items: updatedItems,
              total: action.payload.total
            };
        }
          return item;
        }),
      };
    case "UPDATE_BY_QUANTITY":
      return {
        cart: state.cart.map((item) => {
          if (item.id === action.payload.item.CartId) {
            return {
              ...item,
              items: item.items.map((w) => {
                if (w.id === action.payload.item.id) {
                  return {
                    ...w,
                    quantity: w.quantity + action.payload.quantity
                  };
                }
                return w;
              }),
              total: action.payload.total
            };
          }
          return item;
        }),
      };
    case "UPDATE_CART_TOTAL":
      return {
        cart: state.cart.map((item) => {
          if (item.id === action.payload.id) {
            return {
              ...item,
              total: action.payload.total
            };
          }
          return item;
        }),
      };
    case "ADD_ITEMS_CART":
      return {
      cart: state.cart.map((item) => {
        if (item.id === action.payload.id) {
          return {
            ...item,
            items: [...item.items, action.payload.item],
            total : action.payload.total
          };
        }
        return item;
      }),
      };
    default:
      return state;
  }
};

export const CartsContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(CartsReducer, {
    cart: [],
  });

  console.log("CartsContext state:", state);

  return (
    <CartsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </CartsContext.Provider>
  );
};
