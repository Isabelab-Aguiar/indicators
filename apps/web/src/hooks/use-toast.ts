'use client'

import * as React from 'react'

export interface ToastProps {
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
  duration?: number
}

interface ToasterToast extends ToastProps {
  id: string
  open: boolean
}

type ToastAction = { type: 'ADD'; toast: ToasterToast } | { type: 'REMOVE'; id: string }

const toastLimit = 5
const listeners: Array<(state: ToasterToast[]) => void> = []
let memoryState: ToasterToast[] = []

function dispatch(action: ToastAction) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((l) => l(memoryState))
}

function reducer(state: ToasterToast[], action: ToastAction): ToasterToast[] {
  switch (action.type) {
    case 'ADD':
      return [action.toast, ...state].slice(0, toastLimit)
    case 'REMOVE':
      return state.filter((t) => t.id !== action.id)
  }
}

export function toast(props: ToastProps) {
  const id = Math.random().toString(36).slice(2)
  dispatch({ type: 'ADD', toast: { ...props, id, open: true } })
  setTimeout(() => dispatch({ type: 'REMOVE', id }), props.duration ?? 4000)
  return id
}

export function useToast() {
  const [toasts, setToasts] = React.useState<ToasterToast[]>(memoryState)

  React.useEffect(() => {
    listeners.push(setToasts)
    return () => {
      const index = listeners.indexOf(setToasts)
      if (index > -1) listeners.splice(index, 1)
    }
  }, [])

  return { toasts, toast, dismiss: (id: string) => dispatch({ type: 'REMOVE', id }) }
}
