'use client'

import React, { createContext, useReducer, useEffect } from 'react'

export const MenuContext = createContext<MenuContextValue | null>(null);

export const menuReducer = (state : MenuState, action : MenuAction) => {
  switch (action.type) {
    case 'SET_MENU':
      return { 
        menu: action.payload 
      }
    case 'CREATE_MENU':
      return { 
        menu: [action.payload, ...state.menu] 
      }
    case 'DELETE_MENU':
      return {
        menu: state.menu.filter(w => w.id != action.payload.id) 
      }
    case 'UPDATE_PRICE':
        return {
            menu : state.menu.map((item) => {
                if (item.id === action.payload.item.id) {
                    return {
                        ...item,
                        price: action.payload.price
                    }
                }
                return item;
            }) 
        };
    default:
      return state
  }
}

export const MenuContextProvider: React.FC<{children: React.ReactNode}> = ({ children}) => {
    const [state, dispatch] = useReducer(menuReducer, { 
        menu: []
    })

    console.log('MenuContext state:', state)
        
    return (
        <MenuContext.Provider value={{ ...state, dispatch}}>
            { children }
        </MenuContext.Provider>
    )
}