import React, { createContext, useContext, useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface SelectContextType {
  value: string
  onChange: (value: string) => void
  open: boolean
  setOpen: (open: boolean) => void
}

const SelectContext = createContext<SelectContextType | undefined>(undefined)

interface SelectProps {
  children: React.ReactNode
  onValueChange: (value: string) => void
  value: string
}

export function Select({ children, onValueChange, value }: SelectProps) {
  const [open, setOpen] = useState(false)

  return (
    <SelectContext.Provider value={{ value, onChange: onValueChange, open, setOpen }}>
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  )
}

interface SelectTriggerProps {
  children: React.ReactNode
}

export function SelectTrigger({ children }: SelectTriggerProps) {
  const context = useContext(SelectContext)
  if (!context) throw new Error('SelectTrigger must be used within a Select')

  return (
    <button
      type="button"
      onClick={() => context.setOpen(!context.open)}
      className="flex items-center justify-between w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    >
      {children}
      <ChevronDown className="w-4 h-4 ml-2" />
    </button>
  )
}

export function SelectValue({ placeholder }: { placeholder: string }) {
  const context = useContext(SelectContext)
  if (!context) throw new Error('SelectValue must be used within a Select')

  return <span>{context.value || placeholder}</span>
}

interface SelectContentProps {
  children: React.ReactNode
}

export function SelectContent({ children }: SelectContentProps) {
  const context = useContext(SelectContext)
  if (!context) throw new Error('SelectContent must be used within a Select')

  if (!context.open) return null

  return (
    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
      {children}
    </div>
  )
}

interface SelectItemProps {
  children: React.ReactNode
  value: string
}

export function SelectItem({ children, value }: SelectItemProps) {
  const context = useContext(SelectContext)
  if (!context) throw new Error('SelectItem must be used within a Select')

  const handleClick = () => {
    context.onChange(value)
    context.setOpen(false)
  }

  return (
    <div
      onClick={handleClick}
      className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
        context.value === value ? 'bg-blue-100' : ''
      }`}
    >
      {children}
    </div>
  )
}