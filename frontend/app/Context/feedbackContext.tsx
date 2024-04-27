'use client'

import React, { createContext, useReducer, useEffect } from 'react'

export const FeedbackContext = createContext<FeedbackContextValue | null>(null);

export const feedbackReducer = (state : FeedbackState, action : FeedbackAction) => {
  switch (action.type) {
    case 'SET_FEEDBACK':
      return { 
        feedback: action.payload 
      }
    case 'CREATE_FEEDBACK':
      return { 
        feedback: [action.payload, ...state.feedback] 
      }
    default:
      return state
  }
}

export const FeedbackContextProvider: React.FC<{children: React.ReactNode}> = ({ children}) => {
    const [state, dispatch] = useReducer(feedbackReducer, { 
        feedback: []
    })

    console.log('FeedbackContext state:', state)
        
    return (
        <FeedbackContext.Provider value={{ ...state, dispatch}}>
            { children }
        </FeedbackContext.Provider>
    )
}