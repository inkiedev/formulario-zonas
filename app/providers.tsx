'use client'

import {HeroUIProvider} from '@heroui/react'
import {ReactNode} from "react";
import {ToastProvider} from "@heroui/toast";

export function Providers({children}: { children: ReactNode }) {
  return (
    <HeroUIProvider>
      <ToastProvider />
      {children}
    </HeroUIProvider>
  )
}
