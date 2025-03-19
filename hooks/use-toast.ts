"use client"

import * as React from "react"
import type { ToastActionElement, ToastProps } from "@/components/ui/toast.jsx"

const TOAST_LIMIT = 1
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TOAST_REMOVE_DELAY = 1000000;


type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

type State = {
  toasts: ToasterToast[]
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

type Action =
  | { type: typeof actionTypes.ADD_TOAST; toast: ToasterToast }
  | { type: typeof actionTypes.UPDATE_TOAST; toast: Partial<ToasterToast> }
  | { type: typeof actionTypes.DISMISS_TOAST; toastId?: string }
  | { type: typeof actionTypes.REMOVE_TOAST; toastId?: string }

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return { ...state, toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT) }
    case actionTypes.UPDATE_TOAST:
      return { ...state, toasts: state.toasts.map(t => t.id === action.toast.id ? { ...t, ...action.toast } : t) }
    case actionTypes.DISMISS_TOAST:
      return { ...state, toasts: state.toasts.map(t => (t.id === action.toastId || action.toastId === undefined) ? { ...t, open: false } : t) }
    case actionTypes.REMOVE_TOAST:
      return { ...state, toasts: action.toastId === undefined ? [] : state.toasts.filter(t => t.id !== action.toastId) }
  }
}

const listeners: Array<(state: State) => void> = []
let memoryState: State = { toasts: [] }

const dispatch = (action: Action): void => {
  memoryState = reducer(memoryState, action)
  listeners.forEach(listener => listener(memoryState))
}

type Toast = Omit<ToasterToast, "id">

function toast(props: Toast) {
  const id = Math.random().toString(36).substr(2, 9)
  const update = (props: ToasterToast) => dispatch({ type: actionTypes.UPDATE_TOAST, toast: { ...props, id } })
  const dismiss = () => dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id })

  dispatch({
    type: actionTypes.ADD_TOAST,
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open: boolean) => {
        if (!open) dismiss()
      },
    },
  })

  return { id, dismiss, update }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: actionTypes.DISMISS_TOAST, toastId }),
  }
}

export { useToast, toast }
