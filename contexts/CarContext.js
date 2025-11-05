import { createContext, useContext } from 'react'

const CarContext = createContext()

export const useCarContext = () => {
  const context = useContext(CarContext)
  if (!context) {
    throw new Error('useCarContext must be used within a CarProvider')
  }
  return context
}

export const CarProvider = ({ children, value }) => {
  return (
    <CarContext.Provider value={value}>
      {children}
    </CarContext.Provider>
  )
}
