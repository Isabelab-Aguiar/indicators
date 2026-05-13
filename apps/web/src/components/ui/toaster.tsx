'use client'

import * as React from 'react'
import * as ToastPrimitive from '@radix-ui/react-toast'
import { X } from 'lucide-react'
import { cn } from '@repo/ui'
import { useToast } from '@/hooks/use-toast'

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastPrimitive.Provider swipeDirection="right">
      {toasts.map(({ id, title, description, variant }) => (
        <ToastPrimitive.Root
          key={id}
          open
          className={cn(
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-xl border p-4 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none',
            variant === 'destructive'
              ? 'border-destructive/50 bg-destructive text-destructive-foreground'
              : 'border-border bg-card text-card-foreground',
          )}
        >
          <div className="grid gap-1">
            {title && (
              <ToastPrimitive.Title className="text-sm font-semibold">{title}</ToastPrimitive.Title>
            )}
            {description && (
              <ToastPrimitive.Description className="text-sm opacity-90">
                {description}
              </ToastPrimitive.Description>
            )}
          </div>
          <ToastPrimitive.Close className="absolute right-2 top-2 rounded-md p-1 opacity-0 transition-opacity focus:opacity-100 group-hover:opacity-100">
            <X className="h-4 w-4" />
          </ToastPrimitive.Close>
        </ToastPrimitive.Root>
      ))}
      <ToastPrimitive.Viewport className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:bottom-4 sm:right-4 sm:max-w-[420px]" />
    </ToastPrimitive.Provider>
  )
}
