'use client'

import React, { createContext, useReducer, useEffect } from 'react'

export const OrderedContext = createContext<OrderedContextValue | null>(null);

export const orderedReducer = (state : OrderedState, action : OrderedAction) => {
  switch (action.type) {
    case 'SET_ORDERED':
      return { 
        ordered: action.payload 
      }
    case 'CREATE_ORDERED':
      return { 
        ordered: [action.payload, ...state.ordered] 
      }
    default:
      return state
  }
}

export const OrderedContextProvider: React.FC<{children: React.ReactNode}> = ({ children}) => {
    const [state, dispatch] = useReducer(orderedReducer, { 
        ordered: []
    })

    console.log('OrderedContext state:', state)
        
    return (
        <OrderedContext.Provider value={{ ...state, dispatch}}>
            { children }
        </OrderedContext.Provider>
    )
}