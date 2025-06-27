"use client";
import { createContext, useContext, useState } from "react";
import { ReactNode } from "react";

type ContextType = {
  isDirty: boolean;
  setIsDirty: (val: boolean) => void;
};

export const FormularioContext = createContext<ContextType>({
  isDirty: false,
  setIsDirty: () => {},
});

export const useFormularioDirty = () => useContext(FormularioContext);

export function FormularioDirtyProvider({ children }: { children: ReactNode }) {
  const [isDirty, setIsDirty] = useState(false);
  return (
    <FormularioContext.Provider value={{ isDirty, setIsDirty }}>
  {children}
  </FormularioContext.Provider>
);
}
