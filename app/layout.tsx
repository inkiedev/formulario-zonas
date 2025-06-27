import type { Metadata } from "next";
import "./globals.css";
import {Providers} from "@/app/providers";
import {ReactNode} from "react";
import NavbarLayout from "@/components/layout/navbar";
import {FormularioDirtyProvider} from "@/context/formulario-context";

export const metadata: Metadata = {
  title: "Formato de Incidentes",
  description: "Formulario y manejo de incidentes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <Providers>
          <FormularioDirtyProvider>
            <main className="w-full min-h-screen light text-foreground bg-background">
              <NavbarLayout />
              {children}
            </main>
          </FormularioDirtyProvider>
        </Providers>
      </body>
    </html>
  );
}
