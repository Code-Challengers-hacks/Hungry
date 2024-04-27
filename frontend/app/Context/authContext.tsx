'use client'

import React, { createContext, useReducer, useEffect } from 'react'

export const AuthContext = createContext<AuthContextValue | null>(null);

export const authReducer = (state : AuthState, action : AuthAction) => {
  switch (action.type) {
    case 'LOGIN':
      return { name: action.payload.name , mode : action.payload.mode }
    case 'LOGOUT':
      return { name: null , mode: null }
    default:
      return state
  }
}

export const AuthContextProvider: React.FC<{children: React.ReactNode}> = ({ children}) => {
const [state, dispatch] = useReducer(authReducer, { 
    name : null,
    mode : null,
})

useEffect(() => {
    const  data = JSON.parse(localStorage.getItem('Auth') as string) 

    if (data) {
      console.log(data)
      dispatch({ type: 'LOGIN', payload: { name : data.name, mode : data.mode } }) 
    }
}, [])

console.log('AuthContext state:', state)
    
    return (
        <AuthContext.Provider value={{ ...state, dispatch}}>
            { children }
        </AuthContext.Provider>
    )

}